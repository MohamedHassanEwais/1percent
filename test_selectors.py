from bs4 import BeautifulSoup

def test_extraction():
    with open(r"e:\1percent\test_page.html", "r", encoding="utf-8") as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, "html.parser")
    entry = soup.find("div", class_="entry")
    
    data = {}
    
    # 1. Word
    data['word'] = entry.find("h1", class_="headword").get_text(strip=True)
    
    # 2. Part of Speech
    pos_span = entry.find("span", class_="pos")
    data['pos'] = pos_span.get_text(strip=True) if pos_span else "N/A"
    
    # 3. Phonetics (Rich extraction)
    phonetics = {'uk': [], 'us': []}
    
    # UK
    phons_br = entry.find("div", class_="phons_br")
    if phons_br:
        for phon in phons_br.find_all("span", class_="phon"):
            phonetics['uk'].append(phon.get_text(strip=True))
        # Audio
        audio_btn = phons_br.find("div", class_="audio_play_button")
        if audio_btn and audio_btn.has_attr("data-src-mp3"):
            phonetics['uk_audio'] = audio_btn["data-src-mp3"]

    # US
    phons_nam = entry.find("div", class_="phons_n_am")
    if phons_nam:
        for phon in phons_nam.find_all("span", class_="phon"):
            phonetics['us'].append(phon.get_text(strip=True))
        # Audio
        audio_btn = phons_nam.find("div", class_="audio_play_button")
        if audio_btn and audio_btn.has_attr("data-src-mp3"):
            phonetics['us_audio'] = audio_btn["data-src-mp3"]
            
    data['phonetics'] = phonetics

    # 4. Definitions & Examples (The core)
    definitions = []
    senses = entry.find_all("li", class_="sense")
    
    for sense in senses:
        sense_data = {}
        
        # Level
        level_span = sense.find("span", class_="ox3ksym_a1") or \
                     sense.find("span", class_="ox3ksym_a2") or \
                     sense.find("span", class_="ox3ksym_b1") or \
                     sense.find("span", class_="ox3ksym_b2") or \
                     sense.find("span", class_="ox3ksym_c1")
        
        # Sometimes level is in the parent container
        if not level_span:
             parent_sym = sense.find_previous("div", class_="symbols")
             if parent_sym:
                 level_span = parent_sym.find("span", class_=lambda x: x and x.startswith('ox3ksym_'))

        if level_span:
            # Class name is like 'ox3ksym_a1', extract 'a1'
            sense_data['level'] = level_span['class'][0].split('_')[-1].upper()
        else:
            sense_data['level'] = "N/A"

        # Definition
        def_span = sense.find("span", class_="def")
        if def_span:
            sense_data['definition'] = def_span.get_text(strip=True)
        else:
             # Sometimes it's a cross reference or short def
             sense_data['definition'] = sense.get_text(strip=True) # Fallback

        # Examples
        examples = []
        example_ul = sense.find("ul", class_="examples")
        if example_ul:
            for li in example_ul.find_all("li"):
                examples.append(li.get_text(strip=True))
        sense_data['examples'] = examples
        
        definitions.append(sense_data)

    data['definitions'] = definitions
    
    # 5. Word Origin
    origin_box = entry.find("span", unbox="wordorigin")
    if origin_box:
        body = origin_box.find("span", class_="body")
        data['origin'] = body.get_text(strip=True) if body else "N/A"
    else:
        data['origin'] = "N/A"

    import json
    print(json.dumps(data, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    test_extraction()
