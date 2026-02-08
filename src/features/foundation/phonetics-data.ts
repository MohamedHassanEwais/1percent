
export interface PhoneticSound {
    id: string;
    ipa: string;
    name: string;
    category: 'monophthong' | 'diphthong' | 'consonant';
    subcategory?: 'voiced' | 'unvoiced' | 'plosive' | 'fricative' | 'nasal' | 'approximant' | 'long' | 'short';
    examples: string[];
    description: string;
    videoUrl?: string; // Placeholder for now
    audioUrl?: string; // Placeholder
}

export const PHONETICS_DATA: PhoneticSound[] = [
    // --- Monophthongs (Vowels) ---
    { id: 'i:', ipa: 'i:', name: 'Long i', category: 'monophthong', subcategory: 'long', examples: ['see', 'tree', 'green'], description: 'Spread your lips like a smile. High tongue position.' },
    { id: 'I', ipa: 'ɪ', name: 'Short i', category: 'monophthong', subcategory: 'short', examples: ['sit', 'fish', 'city'], description: 'Relaxed mouth, slightly open.' },
    { id: 'u:', ipa: 'u:', name: 'Long u', category: 'monophthong', subcategory: 'long', examples: ['blue', 'shoe', 'moon'], description: 'Round your lips into a tight circle.' },
    { id: 'U', ipa: 'ʊ', name: 'Short u', category: 'monophthong', subcategory: 'short', examples: ['book', 'put', 'could'], description: 'Relaxed rounded lips.' },
    { id: 'e', ipa: 'e', name: 'Short e', category: 'monophthong', subcategory: 'short', examples: ['bed', 'head', 'many'], description: 'Mouth slightly more open than "i".' },
    { id: 'schwa', ipa: 'ə', name: 'Schwa', category: 'monophthong', subcategory: 'short', examples: ['about', 'teacher', 'banana'], description: 'The most common sound! Relax mouth completely.' },
    { id: '3:', ipa: 'ɜ:', name: 'Long bird', category: 'monophthong', subcategory: 'long', examples: ['bird', 'word', 'turn'], description: 'Mid-central vowel. Lips relaxed.' },
    { id: 'c:', ipa: 'ɔ:', name: 'Long o', category: 'monophthong', subcategory: 'long', examples: ['door', 'four', 'saw'], description: 'Round lips, jaw dropped.' },
    { id: 'ae', ipa: 'æ', name: 'Cat a', category: 'monophthong', subcategory: 'short', examples: ['cat', 'apple', 'man'], description: 'Open mouth wide, smile slightly.' },
    { id: '^', ipa: 'ʌ', name: 'Cup u', category: 'monophthong', subcategory: 'short', examples: ['cup', 'up', 'love'], description: 'Jaw dropped, relaxed lips.' },
    { id: 'a:', ipa: 'ɑ:', name: 'Car a', category: 'monophthong', subcategory: 'long', examples: ['car', 'father', 'art'], description: 'Open mouth very wide, tongue back.' },
    { id: 'Q', ipa: 'ɒ', name: 'Hot o', category: 'monophthong', subcategory: 'short', examples: ['hot', 'on', 'stop'], description: 'Round lips slightly, jaw dropped.' },

    // --- Diphthongs ---
    { id: 'ei', ipa: 'eɪ', name: 'Say', category: 'diphthong', examples: ['say', 'eight', 'rain'], description: 'Glide from "e" to "ɪ".' },
    { id: 'ai', ipa: 'aɪ', name: 'My', category: 'diphthong', examples: ['my', 'high', 'eye'], description: 'Glide from "a" to "ɪ".' },
    { id: 'oi', ipa: 'ɔɪ', name: 'Boy', category: 'diphthong', examples: ['boy', 'toy', 'oil'], description: 'Glide from "ɔ" to "ɪ".' },
    { id: 'au', ipa: 'aʊ', name: 'Now', category: 'diphthong', examples: ['now', 'cow', 'out'], description: 'Glide from "a" to "ʊ".' },
    { id: 'ou', ipa: 'əʊ', name: 'Go', category: 'diphthong', examples: ['go', 'home', 'boat'], description: 'Glide from "ə" to "ʊ".' },
    { id: 'ie', ipa: 'ɪə', name: 'Near', category: 'diphthong', examples: ['near', 'hear', 'ear'], description: 'Glide from "ɪ" to "ə".' },
    { id: 'ea', ipa: 'eə', name: 'Hair', category: 'diphthong', examples: ['hair', 'there', 'care'], description: 'Glide from "e" to "ə".' },
    { id: 'ue', ipa: 'ʊə', name: 'Pure', category: 'diphthong', examples: ['pure', 'tourist', 'cure'], description: 'Glide from "ʊ" to "ə".' },

    // --- Consonants (Voiced/Unvoiced Pairs often) ---
    { id: 'p', ipa: 'p', name: 'P', category: 'consonant', subcategory: 'unvoiced', examples: ['pen', 'stop', 'happy'], description: 'Pop your lips.' },
    { id: 'b', ipa: 'b', name: 'B', category: 'consonant', subcategory: 'voiced', examples: ['bed', 'rub', 'black'], description: 'Voice the "p" sound.' },
    { id: 't', ipa: 't', name: 'T', category: 'consonant', subcategory: 'unvoiced', examples: ['tea', 'put', 'time'], description: 'Tip of tongue behind teeth.' },
    { id: 'd', ipa: 'd', name: 'D', category: 'consonant', subcategory: 'voiced', examples: ['dog', 'bad', 'do'], description: 'Voice the "t" sound.' },
    { id: 'k', ipa: 'k', name: 'K', category: 'consonant', subcategory: 'unvoiced', examples: ['cat', 'back', 'key'], description: 'Back of tongue hits roof.' },
    { id: 'g', ipa: 'g', name: 'G', category: 'consonant', subcategory: 'voiced', examples: ['go', 'bag', 'get'], description: 'Voice the "k" sound.' },
    { id: 'f', ipa: 'f', name: 'F', category: 'consonant', subcategory: 'unvoiced', examples: ['fly', 'off', 'coffee'], description: 'Top teeth on bottom lip.' },
    { id: 'v', ipa: 'v', name: 'V', category: 'consonant', subcategory: 'voiced', examples: ['video', 'have', 'move'], description: 'Voice the "f" sound.' },
    { id: 'th', ipa: 'θ', name: 'Theta', category: 'consonant', subcategory: 'unvoiced', examples: ['think', 'bath', 'three'], description: 'Tongue between teeth. Blow.' },
    { id: 'dh', ipa: 'ð', name: 'Eth', category: 'consonant', subcategory: 'voiced', examples: ['this', 'mother', 'brother'], description: 'Voice the "θ" sound.' },
    { id: 's', ipa: 's', name: 'S', category: 'consonant', subcategory: 'unvoiced', examples: ['see', 'miss', 'snake'], description: 'Hissing sound.' },
    { id: 'z', ipa: 'z', name: 'Z', category: 'consonant', subcategory: 'voiced', examples: ['zoo', 'lazy', 'rose'], description: 'Buzzing bee.' },
    { id: 'sh', ipa: 'ʃ', name: 'Esh', category: 'consonant', subcategory: 'unvoiced', examples: ['she', 'fish', 'sugar'], description: 'Quiet signal (shh!).' },
    { id: 'zh', ipa: 'ʒ', name: 'Yogh', category: 'consonant', subcategory: 'voiced', examples: ['television', 'measure', 'vision'], description: 'Voice the "ʃ" sound.' },
    { id: 'm', ipa: 'm', name: 'M', category: 'consonant', subcategory: 'nasal', examples: ['man', 'mom', 'lemon'], description: 'Lips together, sound through nose.' },
    { id: 'n', ipa: 'n', name: 'N', category: 'consonant', subcategory: 'nasal', examples: ['now', 'no', 'ten'], description: 'Tongue behind teeth, sound through nose.' },
    { id: 'ng', ipa: 'ŋ', name: 'Eng', category: 'consonant', subcategory: 'nasal', examples: ['sing', 'finger', 'bank'], description: 'Back of tongue up, sound through nose.' },
    { id: 'h', ipa: 'h', name: 'H', category: 'consonant', subcategory: 'unvoiced', examples: ['hat', 'hello', 'who'], description: 'Just a breath out.' },
    { id: 'l', ipa: 'l', name: 'L', category: 'consonant', subcategory: 'approximant', examples: ['love', 'ball', 'like'], description: 'Tongue tip touches roof.' },
    { id: 'r', ipa: 'r', name: 'R', category: 'consonant', subcategory: 'approximant', examples: ['red', 'try', 'room'], description: 'Tongue curled back.' },
    { id: 'w', ipa: 'w', name: 'W', category: 'consonant', subcategory: 'approximant', examples: ['wet', 'win', 'where'], description: 'Round lips tight.' },
    { id: 'j', ipa: 'j', name: 'Y', category: 'consonant', subcategory: 'approximant', examples: ['yes', 'yellow', 'student'], description: 'Like beginning of "i".' },
    { id: 'ch', ipa: 'tʃ', name: 'Ch', category: 'consonant', subcategory: 'unvoiced', examples: ['chips', 'teacher', 'match'], description: 'Stop then Release (t+ʃ).' },
    { id: 'dj', ipa: 'dʒ', name: 'Dj', category: 'consonant', subcategory: 'voiced', examples: ['jam', 'danger', 'bridge'], description: 'Voice the "tʃ" sound.' },
];
