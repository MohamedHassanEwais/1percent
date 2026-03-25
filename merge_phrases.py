
import csv
import json
import os

CSV_PATH = 'e:\\1percent\\oxford_phrases_full.csv'
JSON_PATH = 'e:\\1percent\\web-app\\src\\lib\\data\\seed.json'
OUTPUT_PATH = 'e:\\1percent\\web-app\\src\\lib\\data\\seed-v2.json'

def load_phrases():
    phrases = {}
    if not os.path.exists(CSV_PATH):
        print(f"CSV not found at {CSV_PATH}")
        return phrases
        
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            word = row.get('parent_word', '').strip().lower()
            phrase = row.get('phrase', '').strip()
            
            if word and phrase:
                if word not in phrases:
                    phrases[word] = []
                # Avoid duplicates
                if phrase not in phrases[word]:
                    phrases[word].append(phrase)
    return phrases

def merge_data():
    phrases_map = load_phrases()
    print(f"Loaded phrases for {len(phrases_map)} words.")
    
    if not os.path.exists(JSON_PATH):
        print(f"JSON not found at {JSON_PATH}")
        return

    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    updated_count = 0
    
    for item in data:
        word = item.get('word', '').lower()
        
        # If we have phrases for this word
        if word in phrases_map:
            # Join top 3 phrases
            new_example = " • ".join(phrases_map[word][:3])
            
            # Simple heuristic: If current example is "bad" or user wants to override
            # The user asked to use phrases AS examples.
            # Let's preserve the old example if it looks like a real sentence (long), 
            # but prioritize the new phrases if they exist.
            # Actually, user said "use phrases to be the examples". Let's PREPEND or REPLACE?
            # Let's REPLACE because the current ones have artifacts like "abuse alcohol/drugs".
            # The CSV phrases are cleaner collocations.
            
            item['exampleSentence'] = new_example
            updated_count += 1
            
    print(f"Updated {updated_count} words with new examples.")
    
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    merge_data()
