export interface OxfordWord {
    word: string;
    pos: string;
    initial_level: string;
    url: string;
    phonetics: {
        uk: string[];
        us: string[];
        uk_audio: string;
        us_audio: string;
    };
    definitions: {
        level: string;
        definition: string;
        examples: string[];
        definition_ar: string;
        examples_ar: string[];
    }[];
    origin: string;
    word_ar: string;
}
