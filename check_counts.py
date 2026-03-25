import json
import csv
import sys

def count_csv(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            header = next(reader, None)
            return sum(1 for row in reader)
    except Exception as e:
        return f"Error: {e}"

def count_json(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return len(data)
    except Exception as e:
        return f"Error: {e}"

files = {
    "Words CSV": "e:\\1percent\\oxford_words_full.csv",
    "Words JSON": "e:\\1percent\\web-app\\src\\lib\\data\\seed.json",
    "Phrases CSV": "e:\\1percent\\oxford_phrases_full.csv",
    "Phrases JSON": "e:\\1percent\\web-app\\src\\lib\\data\\seed_phrases.json"
}

results = {}
for name, path in files.items():
    if "CSV" in name:
        results[name] = count_csv(path)
    else:
        results[name] = count_json(path)

print(json.dumps(results, indent=2))
