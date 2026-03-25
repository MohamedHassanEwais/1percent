import requests
from bs4 import BeautifulSoup
import csv
import concurrent.futures
import os
import json
import time

# Constants
BASE_URL = "https://www.oxfordlearnersdictionaries.com/wordlists/oxford-phrase-list"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}
OUTPUT_CSV = "oxford_phrases_full.csv"
OUTPUT_JSON = "oxford_phrases_detailed.json"

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
    """Scrapes detailed information from a phrase's page."""
    soup = get_soup(url)
    if not soup:
        return None

    data = {}
    entry = soup.find("div", class_="entry")
    if not entry:
        # Some phrases might be inside idiomatic blocks or different structures.
        # Check for .top-container if .entry is missing (rare)
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
    
    # Phrases often just have one main definition block without li.sense wrappers if simple?
    # Or in .idiom elements.
    if not senses:
         # Try finding just one definition if structure is simpler for simple phrases
         def_span = entry.find("span", class_="def")
         if def_span:
             # Create a dummy sense object
             senses = [entry] # treat entry as the container to search in
    
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
        if sense_data['definition'] != "N/A" or len(examples) > 0:
            definitions.append(sense_data)

    data['definitions'] = definitions

    # 3. Word/Phrase Origin
    origin_box = entry.find("span", unbox="wordorigin")
    if origin_box:
        body = origin_box.find("span", class_="body")
        data['origin'] = body.get_text(strip=True) if body else "N/A"
    else:
        data['origin'] = "N/A"

    return data

def scrape_oxford_phrases():
    print("Step 1: Fetching main phrase list...")
    soup = get_soup(BASE_URL)
    if not soup:
        print("Failed to get main list page.")
        return

    # Look for the phrase list
    # Based on word list structure, usually .top-g li
    list_items = soup.select(".top-g li") 
    
    phrases_data = []
    
    print(f"Found {len(list_items)} potential items.")

    for item in list_items:
        try:
            link = item.find("a")
            if not link: 
                continue
                
            phrase = link.get_text(strip=True)
            href = link["href"]
            if not href.startswith("http"):
                href = "https://www.oxfordlearnersdictionaries.com" + href
                
            # CEFR Level (Initial from list page)
            level = "N/A"
            if item.has_attr("data-ox3000"):
                level = item["data-ox3000"].upper()
            elif item.has_attr("data-ox5000"):
                 level = item["data-ox5000"].upper()

            phrases_data.append({
                "word": phrase, # Keeping key 'word' for consistency with schema
                "pos": "phrase",
                "initial_level": level, 
                "url": href
            })
        except Exception as e:
            continue

    print(f"Filtered down to {len(phrases_data)} phrases. Starting detailed scraping...")
    
    # Threaded scraping of details
    final_results = []
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor: # Reduced workers slightly to be safe
        future_to_phrase = {executor.submit(scrape_full_details, w['url']): w for w in phrases_data}
        
        count = 0
        total = len(phrases_data)
        
        for future in concurrent.futures.as_completed(future_to_phrase):
            phrase_entry = future_to_phrase[future]
            try:
                details = future.result()
                if details:
                    # Merge data
                    phrase_entry.update(details)
                    final_results.append(phrase_entry)
                else:
                    # If details failed, keep basic info (maybe url was broken or structure different)
                    # For now we skip, or we could keep it. Let's keep valid ones.
                    pass 
            except Exception as exc:
                print(f"{phrase_entry['word']} generated an exception: {exc}")
            
            count += 1
            if count % 20 == 0:
                print(f"Progress: {count}/{total} phrases processed")

    # Save to JSON (Primary rich output)
    print(f"Saving {len(final_results)} phrases to JSON...")
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
    scrape_oxford_phrases()
