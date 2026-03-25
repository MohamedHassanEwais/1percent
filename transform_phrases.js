const fs = require('fs');
const path = require('path');

const sourcePath = 'e:\\1percent\\oxford_phrases_full.csv';
const destPath = 'e:\\1percent\\web-app\\src\\lib\\data\\seed_phrases.json';

try {
    const rawData = fs.readFileSync(sourcePath, 'utf8');
    const lines = rawData.split('\n');
    const headers = lines[0].split(',');

    // Helper to parse CSV line respecting quotes
    const parseLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };

    const transformed = [];

    // Skip header, start at 1
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const cols = parseLine(line);
        // word,pos,level,url,uk_audio,us_audio,definition,origin

        const word = cols[0];
        const pos = cols[1] || 'phrase';
        const uk_audio = cols[4];
        const us_audio = cols[5];
        const definition = cols[6] ? cols[6].replace(/^"|"$/g, '') : '';

        // Clean audio link if generic N/A
        const audio = (uk_audio && uk_audio !== 'N/A') ? uk_audio :
            (us_audio && us_audio !== 'N/A') ? us_audio : "";

        if (word) {
            transformed.push({
                word: word,
                phonetics: "", // Phrases rarely have phonetic text in this CSV
                audio: audio,
                definition: definition,
                exampleSentence: `Usage of: ${word}`, // Placeholder
                translation: "", // No translation in CSV
                pos: pos,
                rank: 10000 + i // Offset rank to appear after words for now
            });
        }
    }

    fs.writeFileSync(destPath, JSON.stringify(transformed, null, 2));
    console.log(`Success! Wrote ${transformed.length} phrases to ${destPath}`);

} catch (err) {
    console.error("Error:", err);
}
