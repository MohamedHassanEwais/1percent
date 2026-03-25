import requests
from bs4 import BeautifulSoup
import json

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def scrape_full_details(url):
    print(f"Scraping {url}...")
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(response.content, "html.parser")
    except Exception as e:
        print(e)
        return None

    data = {}
    entry = soup.find("div", class_="entry")
    if not entry:
        return {"error": "No entry found"}

    data['word'] = entry.find("h1", class_="headword").get_text(strip=True)

    # Phonetics
    phonetics = {'uk': [], 'us': [], 'uk_audio': 'N/A', 'us_audio': 'N/A'}
    phons_br = entry.find("div", class_="phons_br")
    if phons_br:
        for phon in phons_br.find_all("span", class_="phon"):
            phonetics['uk'].append(phon.get_text(strip=True))
        audio_btn = phons_br.find("div", class_="audio_play_button")
        if audio_btn and audio_btn.has_attr("data-src-mp3"):
            phonetics['uk_audio'] = audio_btn["data-src-mp3"]

    phons_nam = entry.find("div", class_="phons_n_am")
    if phons_nam:
        for phon in phons_nam.find_all("span", class_="phon"):
            phonetics['us'].append(phon.get_text(strip=True))
        audio_btn = phons_nam.find("div", class_="audio_play_button")
        if audio_btn and audio_btn.has_attr("data-src-mp3"):
            phonetics['us_audio'] = audio_btn["data-src-mp3"]
    
    data['phonetics'] = phonetics

    # Definitions
    definitions = []
    senses = entry.find_all("li", class_="sense")
    for sense in senses:
        sense_data = {}
        # Level
        level_span = sense.find("span", class_=lambda x: x and x.startswith('ox3ksym_'))
        if not level_span:
             parent_sym = sense.find_previous("div", class_="symbols")
             if parent_sym:
                 level_span = parent_sym.find("span", class_=lambda x: x and x.startswith('ox3ksym_'))
        sense_data['level'] = level_span['class'][0].split('_')[-1].upper() if level_span else "N/A"
        
        # Def
        def_span = sense.find("span", class_="def")
        sense_data['definition'] = def_span.get_text(strip=True) if def_span else "N/A"
        
        # Examples
        sense_data['examples'] = [li.get_text(strip=True) for li in sense.find("ul", class_="examples").find_all("li")] if sense.find("ul", class_="examples") else []
        
        definitions.append(sense_data)
    data['definitions'] = definitions
    
    return data

if __name__ == "__main__":
    # Test with 'abandon'
    url = "https://www.oxfordlearnersdictionaries.com/definition/english/abandon_1"
    result = scrape_full_details(url)
    print(json.dumps(result, indent=2, ensure_ascii=False))
