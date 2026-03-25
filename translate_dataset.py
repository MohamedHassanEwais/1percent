import json
import time
from deep_translator import GoogleTranslator
import os
from concurrent.futures import ThreadPoolExecutor

INPUT_FILE = "oxford_words_detailed.json"
OUTPUT_FILE = "oxford_words_translated.json"
PROGRESS_FILE = "translation_progress.json"

translator = GoogleTranslator(source='auto', target='ar')

def translate_text(text):
    if not text or text == "N/A":
        return text
    try:
        # Retry logic
        for attempt in range(3):
            try:
                result = translator.translate(text)
                return result
            except Exception as e:
                time.sleep(2 * (attempt + 1))
                if attempt == 2:
                   print(f"Failed to translate: {text} - {e}")
                   return text
    except Exception:
        return text

def translate_entry(entry):
    # Create a copy to avoid mutating original immediately (though threads share memory, we are careful)
    new_entry = entry.copy()
    
    # Translate Word
    new_entry['word_ar'] = translate_text(entry['word'])
    
    # Translate Definitions
    if 'definitions' in entry:
        new_defs = []
        for definition in entry['definitions']:
            new_def = definition.copy()
            if 'definition' in new_def:
                new_def['definition_ar'] = translate_text(new_def['definition'])
            
            if 'examples' in new_def:
                new_examples_ar = []
                for ex in new_def['examples']:
                    new_examples_ar.append(translate_text(ex))
                new_def['examples_ar'] = new_examples_ar
            
            new_defs.append(new_def)
        new_entry['definitions'] = new_defs
        
    return new_entry

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"File {INPUT_FILE} not found!")
        return

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    total_words = len(data)
    print(f"Loaded {total_words} words to translate.")
    
    # Check for existing progress
    translated_data = []
    start_index = 0
    
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
                translated_data = json.load(f)
                start_index = len(translated_data)
                print(f"Resuming from index {start_index}...")
                if start_index >= total_words:
                    print("Translation already complete!")
                    return
        except json.JSONDecodeError:
            print("Output file corrupt, starting over.")
            translated_data = []

    # Process in batches to save regularly
    BATCH_SIZE = 50
    
    for i in range(start_index, total_words, BATCH_SIZE):
        batch = data[i : i + BATCH_SIZE]
        print(f"Translating batch {i} - {i + len(batch)} / {total_words}...")
        
        with ThreadPoolExecutor(max_workers=10) as executor:
            results = list(executor.map(translate_entry, batch))
        
        translated_data.extend(results)
        
        # Save progress
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(translated_data, f, indent=2, ensure_ascii=False)
            
        # Slight pause to respect rate limits if not using proxies
        time.sleep(1)

    print("Translation Complete!")

if __name__ == "__main__":
    main()
