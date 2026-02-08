import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '1 Percent',
        short_name: '1 Percent',
        description: 'Master the Oxford 3000 words with Spaced Repetition.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#CCFF00',
        icons: [
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
