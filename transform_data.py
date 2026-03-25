import json
import os

source_words_path = r"e:\1percent\oxford_words_translated.json"
source_phrases_path = r"e:\1percent\oxford_phrases_translated.json"
dest_path = r"e:\1percent\web-app\src\lib\data\seed.json"

def process_item(item, default_pos="noun"):
    # Extract phonetics
    phonetic_text = ""
    if item.get("phonetics"):
        if item["phonetics"].get("uk"):
            phonetic_text = item["phonetics"]["uk"][0]
        elif item["phonetics"].get("us"):
            phonetic_text = item["phonetics"]["us"][0]

    # Extract audio
    audio_url = ""
    if item.get("phonetics"):
        if item["phonetics"].get("uk_audio"):
            audio_url = item["phonetics"]["uk_audio"]
        elif item["phonetics"].get("us_audio"):
            audio_url = item["phonetics"]["us_audio"]

    # Extract definition/examples
    definition = ""
    example = "No example available."
    translation = item.get("word_ar", "")
    
    # Logic to pick the best definition (e.g., first one usually)
    if item.get("definitions") and len(item["definitions"]) > 0:
        def_obj = item["definitions"][0]
        definition = def_obj.get("definition", "")
        if def_obj.get("examples") and len(def_obj["examples"]) > 0:
            example = def_obj["examples"][0]
        
        # Prefer contextual translation if available, else generic word translation
        if def_obj.get("definition_ar"):
                translation = def_obj.get("definition_ar")

    return {
        "word": item["word"],
        "phonetics": phonetic_text,
        "audio": audio_url,
        "definition": definition,
        "exampleSentence": example,
        "translation": translation,
        "pos": item.get("pos", default_pos),
    }

def transform_data():
    transformed = []

    # Process Words
    if os.path.exists(source_words_path):
        print(f"Processing words from {source_words_path}...")
        with open(source_words_path, 'r', encoding='utf-8') as f:
            words_data = json.load(f)
            for item in words_data:
                transformed.append(process_item(item, default_pos="noun"))
    else:
        print(f"Warning: Words file not found at {source_words_path}")

    # Process Phrases
    if os.path.exists(source_phrases_path):
        print(f"Processing phrases from {source_phrases_path}...")
        with open(source_phrases_path, 'r', encoding='utf-8') as f:
            phrases_data = json.load(f)
            for item in phrases_data:
                transformed.append(process_item(item, default_pos="phrase"))
    else:
        print(f"Warning: Phrases file not found at {source_phrases_path}")

    with open(dest_path, 'w', encoding='utf-8') as f:
        json.dump(transformed, f, indent=2, ensure_ascii=False)
    
    print(f"Successfully transformed {len(transformed)} items to {dest_path}")

if __name__ == "__main__":
    transform_data()
