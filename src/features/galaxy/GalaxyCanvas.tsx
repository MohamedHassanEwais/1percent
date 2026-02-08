"use client";

import React, { useEffect, useRef, useState } from 'react';
import { generateGalaxyStars, StarNode } from './star-utils';
import { wordsRepo } from '@/core/services/words-repo';
import { db } from '@/lib/db/dexie';

interface GalaxyCanvasProps {
    onStarClick?: (id: number) => void;
}

export const GalaxyCanvas: React.FC<GalaxyCanvasProps> = ({ onStarClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<StarNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pan & Zoom State
    const transform = useRef({ x: 0, y: 0, scale: 0.5 });
    const isDragging = useRef(false);
    const lastMouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize Handler
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Center initial view
            transform.current.x = canvas.width / 2;
            transform.current.y = canvas.height / 2;
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        const initGalaxy = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Words FIRST to get count
                const allWords = await db.words.orderBy('rank').toArray();
                const count = allWords.length || 3000;

                // 2. Generate Base Stars
                const baseStars = generateGalaxyStars(count);

                // 3. Fetch User Progress (The Data)
                const allProgress = await db.progress.toArray();
                const progressMap = new Map(allProgress.map(p => [p.wordId, p]));

                // 4. Merge Data into Stars
                starsRef.current = baseStars.map((star, index) => {
                    const wordPrototype = allWords[index];
                    // ... (rest logic same as before)
                    let status: 'locked' | 'learning' | 'mastered' = 'locked';
                    // Default Color
                    let color = 'rgba(255, 255, 255, 0.1)';

                    // A0 / Audio Foundation Color (Gold/Yellow distinct from others)
                    // We check if it's potentially A0 based on rank if not yet loaded in progress
                    const isA0 = wordPrototype ? wordPrototype.rank <= 0 : false;
                    if (isA0) {
                        color = 'rgba(255, 215, 0, 0.3)'; // Goldish for A0 Locked
                    }

                    if (wordPrototype) {
                        star.id = index;
                        // Map wordId to star for click
                        // We attach it to the star object in memory (casting needed or update interface)
                        (star as any).wordId = wordPrototype.id;

                        const progress = progressMap.get(wordPrototype.id);
                        if (progress) {
                            if (progress.status === 'graduated') {
                                status = 'mastered';
                                color = '#CCFF00';
                            } else {
                                status = 'learning';
                                color = '#22D3EE';
                            }
                        } else if (wordPrototype.pos === 'phrase' || wordPrototype.rank > 10000) {
                            // Phrase Identifier (Locked but visible as Pink?)
                            // Or just when unlocked?
                            // Let's make them faint pink if locked, bright pink if learning
                            color = 'rgba(236, 72, 153, 0.3)'; // Pink faded
                        }

                        // Override color if it's a phrase and active
                        if (wordPrototype.pos === 'phrase' || wordPrototype.rank > 10000) {
                            if (status === 'mastered') color = '#F472B6'; // Pink-400
                            if (status === 'learning') color = '#EC4899'; // Pink-500
                        }
                        // Override color if it's a phrase and active
                        if (wordPrototype.pos === 'phrase' || wordPrototype.rank > 10000) {
                            if (status === 'mastered') color = '#F472B6'; // Pink-400
                            if (status === 'learning') color = '#EC4899'; // Pink-500
                        }

                        // Override color if it's A0 and active
                        if (isA0) {
                            if (status === 'mastered') color = '#FFD700'; // Gold
                            if (status === 'learning') color = '#FDE047'; // Yellow-300
                        }
                    }
                    return { ...star, status, color };
                });

                // Sort: Draw LOCKED first, then LEARNING, then MASTERED (on top)
                starsRef.current.sort((a, b) => {
                    const score = (s: string) => s === 'locked' ? 0 : s === 'learning' ? 1 : 2;
                    return score(a.status) - score(b.status);
                });

            } catch (error) {
                console.error("Failed to load galaxy data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Initialize Data
        initGalaxy();

        // Animation Loop
        let animationFrameId: number;

        const render = () => {
            if (!canvas || !ctx) return;

            // Clear
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Core Glow
            const cx = transform.current.x;
            const cy = transform.current.y;
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300 * transform.current.scale);
            gradient.addColorStop(0, 'rgba(100, 100, 255, 0.05)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Stars
            starsRef.current.forEach(star => {
                // ... same draw logic
                const screenX = star.x * transform.current.scale + transform.current.x;
                const screenY = star.y * transform.current.scale + transform.current.y;

                if (screenX < -50 || screenX > canvas.width + 50 || screenY < -50 || screenY > canvas.height + 50) return;

                ctx.beginPath();
                // ... rest of draw
                let visibleSize = Math.max(0.5, (star.size / transform.current.scale) * (transform.current.scale < 1 ? 0.5 : 1));

                if (star.status === 'mastered' || star.status === 'learning') {
                    visibleSize = visibleSize * 3; // Even bigger pop
                }

                ctx.arc(screenX, screenY, visibleSize, 0, Math.PI * 2); // use screen coords directly

                // Styling
                if (star.status === 'mastered') {
                    ctx.fillStyle = '#CCFF00';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#CCFF00';
                } else if (star.status === 'learning') {
                    ctx.fillStyle = '#22D3EE';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#22D3EE';
                } else {
                    // Check if it's A0 locked but visible enough
                    // We can check color directly or passed prop
                    ctx.fillStyle = star.color || 'rgba(255, 255, 255, 0.1)';
                    ctx.shadowBlur = 0;
                    // bloom for A0 even if locked? Maybe slight
                    if (star.color === 'rgba(255, 215, 0, 0.3)') {
                        ctx.shadowBlur = 5;
                        ctx.shadowColor = 'rgba(255, 215, 0, 0.2)';
                    }
                }

                ctx.fill();
                ctx.shadowBlur = 0;
            });

            ctx.restore();
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Interaction Handlers (Pan/Zoom)
    const handleWheel = (e: React.WheelEvent) => {
        const zoomSensitivity = 0.001;
        const newScale = transform.current.scale - e.deltaY * zoomSensitivity;
        transform.current.scale = Math.max(0.1, Math.min(newScale, 5)); // Clamp zoom
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;

        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;

        transform.current.x += dx;
        transform.current.y += dy;

        lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        isDragging.current = false;

        // Check for click on star if not dragging much
        // Simple hit detection
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Transform mouse to world space
        // worldX = (mouseX - panX) / scale
        const worldX = (mouseX - transform.current.x) / transform.current.scale;
        const worldY = (mouseY - transform.current.y) / transform.current.scale;

        // Find clicked star
        // Optimization: only check stars reasonably close or use a spatial index (too complex for now)
        // Brute force 3000 is fine for a click event
        const clickRadius = 10 / transform.current.scale; // Larger hit area

        const clickedStar = starsRef.current.find(star => {
            const dist = Math.sqrt(Math.pow(star.x - worldX, 2) + Math.pow(star.y - worldY, 2));
            return dist < clickRadius;
        });

        if (clickedStar && onStarClick) {
            onStarClick(clickedStar.id);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 cursor-move bg-black"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => isDragging.current = false}
        />
    );
};
