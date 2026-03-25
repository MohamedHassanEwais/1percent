const fs = require('fs');
const path = require('path');

const sourcePath = 'e:\\1percent\\oxford_words_translated.json';
const destPath = 'e:\\1percent\\web-app\\src\\lib\\data\\seed.json';

try {
    const rawData = fs.readFileSync(sourcePath, 'utf8');
    const data = JSON.parse(rawData);

    console.log(`Loaded ${data.length} records.`);

    const transformed = data.map((item, index) => {
        const defObj = item.definitions?.[0] || {};
        const phonetics = item.phonetics || {};

        return {
            word: item.word,
            phonetics: phonetics.uk?.[0] || phonetics.us?.[0] || "",
            audio: phonetics.uk_audio || phonetics.us_audio || "",
            definition: defObj.definition || "",
            exampleSentence: defObj.examples?.[0] || "No example available.",
            translation: defObj.definition_ar || item.word_ar || "",
            pos: item.pos || "noun",
            rank: index + 1
        };
    });

    fs.writeFileSync(destPath, JSON.stringify(transformed, null, 2));
    console.log(`Success! Wrote ${transformed.length} items to ${destPath}`);

} catch (err) {
    console.error("Error:", err);
}
