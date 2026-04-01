import { z } from 'zod';

export const CoreItemSchema = z.object({
    id: z.string(),
    normalized: z.string(),
    rank: z.number(),
    level: z.string(),
    pos: z.enum(['word', 'phrase', 'phoneme']),
    translation: z.string().optional(),
    phase: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    phonetic: z.boolean().optional(),
    audioUrl: z.string().optional(),
});

export const LanguageCoreSchema = z.object({
    language: z.string(),
    version: z.string(),
    items: z.array(CoreItemSchema)
});

export type LanguageCore = z.infer<typeof LanguageCoreSchema>;
export type CoreItemInput = z.infer<typeof CoreItemSchema>;
