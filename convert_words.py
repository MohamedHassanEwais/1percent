import csv
import json

csv_path = "e:\\1percent\\oxford_words_full.csv"
json_path = "e:\\1percent\\web-app\\src\\lib\\data\\seed.json"

# Schema mapping based on previous inspections
# CSV headers: word,pos,level,phonetics,audio,definition,example,translation (inferred)

data = []

with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader):
        # Construct the object matching VocabularyCard / seed.json structure
        item = {
            "word": row.get('word', ''),
            "phonetics": row.get('phonetics', ''),
            "audio": row.get('audio', '') or row.get('url', ''), # Fallback if audio col differs
            "definition": row.get('definition', ''),
            "exampleSentence": row.get('example', '') or row.get('exampleSentence', ''),
            "translation": row.get('translation', ''),
            "pos": row.get('pos', 'word'),
            "rank": i + 1, # Explicit rank
            "level": row.get('level', 'N/A')
        }
        data.append(item)

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Successfully converted {len(data)} words to {json_path}")
