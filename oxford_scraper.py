import requests
from bs4 import BeautifulSoup
import csv
import concurrent.futures
import os
import json
import time

# Constants
BASE_URL = "https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}
OUTPUT_CSV = "oxford_words_full.csv"
OUTPUT_JSON = "oxford_words_detailed.json"

# Initialize Session for connection pooling
session = requests.Session()
adapter = requests.adapters.HTTPAdapter(pool_connections=100, pool_maxsize=100)
session.mount('http://', adapter)
session.mount('https://', adapter)
session.headers.update(HEADERS)

def get_soup(url):
    try:
        response = session.get(url, timeout=10)
        response.raise_for_status()
        return BeautifulSoup(response.content, "html.parser")
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def scrape_full_details(url):
    """Scrapes detailed information from a word's page."""
    soup = get_soup(url)
    if not soup:
        return None

    data = {}
    entry = soup.find("div", class_="entry")
    if not entry:
        return None

    # 1. Phonetics & Audio
    phonetics = {'uk': [], 'us': [], 'uk_audio': 'N/A', 'us_audio': 'N/A'}
    
    # UK
    phons_br = entry.find("div", class_="phons_br")
    if phons_br:
        for phon in phons_br.find_all("span", class_="phon"):
            phonetics['uk'].append(phon.get_text(strip=True))
        audio_btn = phons_br.find("div", class_="audio_play_button")
        if audio_btn and audio_btn.has_attr("data-src-mp3"):
            phonetics['uk_audio'] = audio_btn["data-src-mp3"]

    # US
    phons_nam = entry.find("div", class_="phons_n_am")
    if phons_nam:
        for phon in phons_nam.find_all("span", class_="phon"):
            phonetics['us'].append(phon.get_text(strip=True))
        audio_btn = phons_nam.find("div", class_="audio_play_button")
        if audio_btn and audio_btn.has_attr("data-src-mp3"):
            phonetics['us_audio'] = audio_btn["data-src-mp3"]
    
    data['phonetics'] = phonetics

    # 2. Definitions, Levels, Examples (Iterate over senses)
    definitions = []
    # Major senses are often in ol.senses_multiple > li.sense OR just a single span.def depending on structure
    # We will look for .sense elements which cover both cases usually
    senses = entry.find_all("li", class_="sense")
    if not senses:
         # Fallback for single definition words that might not have li.sense structure (rare in OALD but possible)
         pass

    for sense in senses:
        sense_data = {}
        
        # CEFR Level
        level_span = sense.find("span", class_=lambda x: x and x.startswith('ox3ksym_'))
        # Search in parents if not found (sometimes level applies to the whole group)
        if not level_span:
             parent_sym = sense.find_previous("div", class_="symbols")
             if parent_sym:
                 level_span = parent_sym.find("span", class_=lambda x: x and x.startswith('ox3ksym_'))
        
        if level_span:
            # e.g., ox3ksym_a1 -> A1
            sense_data['level'] = level_span['class'][0].split('_')[-1].upper()
        else:
            sense_data['level'] = "N/A"

        # Definition text
        def_span = sense.find("span", class_="def")
        if def_span:
            sense_data['definition'] = def_span.get_text(strip=True)
        else:
            sense_data['definition'] = "N/A"

        # Examples
        examples = []
        example_ul = sense.find("ul", class_="examples")
        if example_ul:
            for li in example_ul.find_all("li"):
                text = li.get_text(strip=True)
                examples.append(text)
        sense_data['examples'] = examples
        
        # Only add valid definitions
        if sense_data['definition'] != "N/A":
            definitions.append(sense_data)

    data['definitions'] = definitions

    # 3. Word Origin
    origin_box = entry.find("span", unbox="wordorigin")
    if origin_box:
        body = origin_box.find("span", class_="body")
        data['origin'] = body.get_text(strip=True) if body else "N/A"
    else:
        data['origin'] = "N/A"

    return data

def scrape_oxford_words():
    print("Step 1: Fetching main word list...")
    soup = get_soup(BASE_URL)
    if not soup:
        return

    # Look for the word list
    list_items = soup.select(".top-g li") 
    
    words_data = []
    
    for item in list_items:
        try:
            link = item.find("a")
            if not link: 
                continue
                
            word = link.get_text(strip=True)
            href = link["href"]
            if not href.startswith("http"):
                href = "https://www.oxfordlearnersdictionaries.com" + href
                
            pos_span = item.find("span", class_="pos")
            pos = pos_span.get_text(strip=True) if pos_span else "N/A"
            
            # CEFR Level (Initial from list page, might be updated by detail page)
            level = "N/A"
            if item.has_attr("data-ox3000"):
                level = item["data-ox3000"].upper()
            elif item.has_attr("data-ox5000"):
                 level = item["data-ox5000"].upper()

            words_data.append({
                "word": word,
                "pos": pos,
                "initial_level": level, # Keep this as fallback
                "url": href
            })
        except Exception as e:
            continue

    print(f"Found {len(words_data)} words. Starting detailed scraping...")
    
    # Threaded scraping of details
    final_results = []
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        future_to_word = {executor.submit(scrape_full_details, w['url']): w for w in words_data}
        
        count = 0
        total = len(words_data)
        
        for future in concurrent.futures.as_completed(future_to_word):
            word_entry = future_to_word[future]
            try:
                details = future.result()
                if details:
                    # Merge data
                    word_entry.update(details)
                    final_results.append(word_entry)
            except Exception as exc:
                print(f"{word_entry['word']} generated an exception: {exc}")
            
            count += 1
            if count % 100 == 0:
                print(f"Progress: {count}/{total} words processed")

    # Save to JSON (Primary rich output)
    print(f"Saving {len(final_results)} words to JSON...")
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(final_results, f, indent=2, ensure_ascii=False)

    # Save to CSV (Summary)
    print("Saving summary to CSV...")
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        fieldnames = ["word", "pos", "level", "url", "uk_audio", "us_audio", "definition", "origin"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for item in final_results:
            # Flatten for CSV: Take first definition and level
            first_def = "N/A"
            final_level = item['initial_level']
            
            if item.get('definitions') and len(item['definitions']) > 0:
                first_def = item['definitions'][0].get('definition', 'N/A')
                # If detail page has level, use it, otherwise keep list level
                if item['definitions'][0].get('level') != "N/A":
                    final_level = item['definitions'][0]['level']

            writer.writerow({
                "word": item['word'],
                "pos": item['pos'],
                "level": final_level,
                "url": item['url'],
                "uk_audio": item.get('phonetics', {}).get('uk_audio', 'N/A'),
                "us_audio": item.get('phonetics', {}).get('us_audio', 'N/A'),
                "definition": first_def,
                "origin": item.get('origin', 'N/A')
            })

    print("Done! Files saved.")

if __name__ == "__main__":
    scrape_oxford_words()
