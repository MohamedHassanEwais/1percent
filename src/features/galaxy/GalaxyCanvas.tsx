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
            setIsLoading(true);
            try {
                // 1. Generate Base Stars (The Geometry)
                const baseStars = generateGalaxyStars(3000);

                // 2. Fetch User Progress (The Data)
                const allProgress = await db.progress.toArray();
                const progressMap = new Map(allProgress.map(p => [p.wordId, p]));

                // 3. Fetch All Words to map index -> wordId
                // Optimization: We only need IDs and Ranks, but getting all is fine for 3000 items in IndexedDB
                const allWords = await db.words.orderBy('rank').toArray();

                // 4. Merge Data into Stars
                // We assume the star index corresponds to the word rank (1-based)
                // baseStars[0] -> Rank 1
                starsRef.current = baseStars.map((star, index) => {
                    const wordPrototype = allWords[index];

                    // Default State (Locked)
                    let status: 'locked' | 'learning' | 'mastered' = 'locked';
                    let color = 'rgba(255, 255, 255, 0.1)'; // Default fade

                    if (wordPrototype) {
                        star.id = index; // Keep index as ID for visual selection for now, or use wordPrototype.id
                        // Store wordId for actual lookup on click
                        // We might need to extend the StarNode type if we want to store wordId directly
                        // For now we use the index to lookup the word again on click.

                        const progress = progressMap.get(wordPrototype.id);

                        if (progress) {
                            if (progress.status === 'graduated') {
                                status = 'mastered';
                                color = '#CCFF00'; // Brand Primary
                            } else {
                                status = 'learning';
                                color = '#22D3EE'; // Brand Accent
                            }
                        }
                    }

                    return { ...star, status, color };
                });

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
            starsRef.current.forEach(star => {
                const screenX = star.x * transform.current.scale + transform.current.x;
                const screenY = star.y * transform.current.scale + transform.current.y;

                // Optimization: Cull offscreen
                if (screenX < -50 || screenX > canvas.width + 50 || screenY < -50 || screenY > canvas.height + 50) return;

                ctx.beginPath();

                let visibleSize = Math.max(0.5, (star.size / transform.current.scale) * (transform.current.scale < 1 ? 0.5 : 1));

                // Boost size for active stars
                if (star.status === 'mastered' || star.status === 'learning') {
                    visibleSize = visibleSize * 2.5; // Make them significantly larger
                }

                ctx.arc(star.x, star.y, visibleSize, 0, Math.PI * 2);

                // Styling based on Status
                if (star.status === 'mastered') {
                    // Signature Lime
                    ctx.fillStyle = '#CCFF00';
                    ctx.shadowBlur = 15; // Strong glow
                    ctx.shadowColor = '#CCFF00';
                } else if (star.status === 'learning') {
                    // Cyan for in-progress
                    ctx.fillStyle = '#22D3EE';
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = '#22D3EE';
                } else {
                    // Locked / Background
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
                ctx.shadowBlur = 0; // Reset for next draw
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
