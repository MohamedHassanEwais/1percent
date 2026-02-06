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
        const initGalaxy = async () => {
            // 1. Generate Base Stars (The Geometry)
            const baseStars = generateGalaxyStars(3000); // 3000 Oxford Words

            // 2. Fetch User Progress (The Data)
            try {
                // Ensure plain object for client-side usage if needed, but db queries are fine here
                const allProgress = await db.progress.toArray();
                const progressMap = new Map(allProgress.map(p => [p.wordId, p]));

                // 3. Merge Data into Stars
                starsRef.current = baseStars.map((star, index) => {
                    // Assuming we map stars to words by index/rank roughly
                    // In a perfect world, we'd have exact IDs. For now, we map by Rank (Index + 1)
                    // Because seed data is ranked 1-3000.
                    // However, our wordsRepo might use string IDs.
                    // Let's assume we load the "seed" to know the order?
                    // Optimization: Just query known progress.
                    // If a word is in progress, it's "Learning" or "Mastered".

                    // Simple approximation: Map 1st star to 1st word, etc.
                    // We need to know which "wordId" corresponds to "star index".
                    // For now, let's just visualize the *amount* of progress.
                    // Matching specific stars to specific alphanumeric IDs is complex without loading 3000 word objects.

                    // Visual Hack: If we have 50 items in progress, light up the first 50 stars (or random 50).
                    // Better: Light up stars based on the `progressMap` size.

                    // Let's try to be consistent: 
                    // We don't have the word IDs here easily without fetching 3000 words.
                    // Fetcing 3000 words IS fast in Dexie/IndexedDB.

                    return star;
                });

                // Let's actually fetch all words to map them correctly if we want interactions.
                const allWords = await db.words.orderBy('rank').toArray();

                if (allWords.length > 0) {
                    starsRef.current = baseStars.map((star, index) => {
                        const word = allWords[index];
                        if (!word) return star; // Fallback

                        star.id = index; // Keep internal canvas ID
                        // We can store the real Word ID in a custom property if we extend StarNode, 
                        // but StarNode is defined in utils. Let's just use the index for now.

                        const progress = progressMap.get(word.id);

                        if (progress) {
                            if (progress.box >= 5) {
                                star.status = 'mastered';
                                star.color = '#CCFF00'; // Lime
                            } else {
                                star.status = 'learning';
                                star.color = '#38bdf8'; // Blue
                            }
                        } else {
                            star.status = 'locked';
                            star.color = 'rgba(255, 255, 255, 0.1)';
                        }

                        return star;
                    });
                }

            } catch (error) {
                console.error("Failed to load galaxy data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initGalaxy();

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

        // Animation Loop
        let animationFrameId: number;

        const render = () => {
            if (!canvas || !ctx) return;

            // Clear
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Stars
            ctx.save();
            ctx.translate(transform.current.x, transform.current.y);
            ctx.scale(transform.current.scale, transform.current.scale);

            starsRef.current.forEach(star => {
                // simple culling
                const screenX = star.x * transform.current.scale + transform.current.x;
                const screenY = star.y * transform.current.scale + transform.current.y;

                // Draw even if slightly offscreen to avoid popping
                // if (screenX < -50 || screenX > canvas.width + 50 || screenY < -50 || screenY > canvas.height + 50) return;

                ctx.beginPath();
                // Star size dynamic based on zoom
                const visibleSize = Math.max(0.5, (star.size / transform.current.scale) * (transform.current.scale < 1 ? 0.5 : 1));

                ctx.arc(star.x, star.y, visibleSize, 0, Math.PI * 2);

                // Glow effect for unlocked
                if (star.status === 'mastered') {
                    ctx.fillStyle = '#CCFF00';
                    ctx.shadowBlur = 10 * transform.current.scale;
                    ctx.shadowColor = '#CCFF00';
                } else if (star.status === 'learning') {
                    ctx.fillStyle = '#38bdf8'; // Sky Blue
                    ctx.shadowBlur = 8 * transform.current.scale;
                    ctx.shadowColor = '#38bdf8';
                } else {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
                ctx.shadowBlur = 0; // Reset
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
