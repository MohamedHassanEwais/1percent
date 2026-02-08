export interface StarNode {
    id: number;
    x: number;
    y: number;
    z: number; // For depth parallax
    size: number;
    color: string;
    status: 'locked' | 'unlocked' | 'learning' | 'mastered';
    wordId?: string; // Optional: Link to actual word logic
}

/**
 * Generates a spiral galaxy distribution of stars.
 * @param count Number of stars (default 3000)
 */
export function generateGalaxyStars(count: number = 3000): StarNode[] {
    const stars: StarNode[] = [];

    // Golden Angle for distribution
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
        // Distance from center depends on index (sqrt avoids clumping at center)
        const distance = Math.sqrt(i) / Math.sqrt(count);
        const radius = distance * 1000; // Spread factor
        const angle = i * phi;

        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        // Add some random scatter/noise
        const scatterX = (Math.random() - 0.5) * 50;
        const scatterY = (Math.random() - 0.5) * 50;

        stars.push({
            id: i,
            x: x + scatterX,
            y: y + scatterY,
            z: Math.random() * 2,
            size: Math.random() * 2 + 0.5, // 0.5px to 2.5px
            color: 'rgba(255, 255, 255, 0.1)',
            status: 'locked'
        });
    }

    return stars;
}
