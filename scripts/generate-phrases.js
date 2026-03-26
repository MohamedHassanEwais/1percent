const fs = require('fs');
const path = require('path');

const CSV_PATH = String.raw`e:\1percent\oxford_phrases_full.csv`;
const OUT_PATH = String.raw`e:\1percent\web-app\src\lib\data\seed_phrases.json`;

// Simple CSV parser that handles quotes
function parseCSV(text) {
    const lines = text.split(/\r?\n/);
    // Columns: word,pos,level,url,uk_audio,us_audio,definition,origin
    // But let's detect headers dynamically
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const row = [];
        let current = '';
        let inQuote = false;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                if (j + 1 < line.length && line[j + 1] === '"') {
                    current += '"';
                    j++;
                } else {
                    inQuote = !inQuote;
                }
            } else if (char === ',' && !inQuote) {
                row.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        row.push(current.trim());

        // Simple mapping, might need robustness if row length varies
        // But for this task, we try to match headers
        const obj = {};

        // Safety check to avoid index out of bounds
        headers.forEach((h, index) => {
            const value = row[index] ? row[index].replace(/^"|"$/g, '') : "";
            obj[h] = value;
        });
        result.push(obj);
    }
    return result;
}

try {
    console.log(`Reading CSV from ${CSV_PATH}...`);
    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const data = parseCSV(csvContent);

    console.log(`Parsed ${data.length} rows.`);

    const phrases = data.map((item, index) => ({
        word: item.word,
        phonetics: "",
        audio: item.uk_audio || item.us_audio || "",
        definition: item.definition || "",
        exampleSentence: `Usage of: ${item.word}`,
        translation: "",
        pos: "phrase",
        rank: 10000 + index + 1,
        // Ensure level is uppercase and valid, default to N/A
        level: item.level ? item.level.toUpperCase() : "N/A"
    }));

    fs.writeFileSync(OUT_PATH, JSON.stringify(phrases, null, 2));
    console.log(`Successfully wrote ${phrases.length} phrases to ${OUT_PATH}`);
} catch (error) {
    console.error("Error processing CSV:", error);
}
