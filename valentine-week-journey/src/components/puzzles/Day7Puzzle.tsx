'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface Point {
    x: number;
    y: number;
}

export default function Day7Puzzle({ onComplete }: { onComplete: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<Point[]>([]);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);

    // Heart path checkpoints
    const heartCheckpoints: Point[] = [
        { x: 150, y: 60 },   // top left curve
        { x: 75, y: 120 },   // left side
        { x: 150, y: 250 },  // bottom point
        { x: 225, y: 120 },  // right side
        { x: 150, y: 60 },   // back to top
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw guide heart (dashed)
        ctx.save();
        ctx.strokeStyle = '#FFB3C1';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        ctx.moveTo(150, 70);
        // Left curve
        ctx.bezierCurveTo(50, 0, 0, 100, 150, 250);
        // Right curve
        ctx.moveTo(150, 70);
        ctx.bezierCurveTo(250, 0, 300, 100, 150, 250);
        ctx.stroke();
        ctx.restore();

        // Draw user path
        if (points.length > 1) {
            ctx.save();
            ctx.strokeStyle = '#FF6B6B';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
            ctx.restore();
        }

        // Draw checkpoints
        heartCheckpoints.forEach((point, index) => {
            const reached = index < Math.floor(progress * heartCheckpoints.length);
            ctx.beginPath();
            ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = reached ? '#FF6B6B' : '#FFE5E5';
            ctx.fill();
            ctx.strokeStyle = '#FF6B6B';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Start point indicator
        ctx.fillStyle = '#FF6B6B';
        ctx.font = '16px sans-serif';
        ctx.fillText('Start Here ↓', 110, 45);

    }, [points, progress]);

    const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent): Point | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        if ('touches' in e) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        }

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const checkProgress = (newPoints: Point[]) => {
        if (newPoints.length < 2) return;

        let checkpointsReached = 0;

        for (const checkpoint of heartCheckpoints) {
            const reached = newPoints.some(point => {
                const distance = Math.sqrt(
                    Math.pow(point.x - checkpoint.x, 2) +
                    Math.pow(point.y - checkpoint.y, 2)
                );
                return distance < 30;
            });

            if (reached) checkpointsReached++;
        }

        const newProgress = checkpointsReached / heartCheckpoints.length;
        setProgress(newProgress);

        if (newProgress >= 0.8 && !completed) {
            setCompleted(true);
            setTimeout(() => onComplete(), 500);
        }
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const point = getCanvasPoint(e);
        if (point) {
            setIsDrawing(true);
            setPoints([point]);
        }
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (!isDrawing) return;

        const point = getCanvasPoint(e);
        if (point) {
            const newPoints = [...points, point];
            setPoints(newPoints);
            checkProgress(newPoints);
        }
    };

    const handleEnd = () => {
        setIsDrawing(false);
    };

    const resetDrawing = () => {
        setPoints([]);
        setProgress(0);
        setCompleted(false);
    };

    return (
        <div className="text-center">
            <div className="glass-card p-4 mb-6">
                <p className="text-charcoal-light text-sm">
                    💋 Trace the heart path! Start at the top and follow the dotted line.
                </p>
                <div className="mt-2 h-2 bg-blush-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-coral to-rose-gold"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress * 100}%` }}
                    />
                </div>
                <p className="text-xs text-charcoal-light mt-1">{Math.round(progress * 100)}% complete</p>
            </div>

            <div className="glass-card p-4 inline-block">
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="cursor-crosshair touch-none rounded-xl"
                    style={{ background: 'rgba(255, 249, 240, 0.8)' }}
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                />
            </div>

            <div className="mt-4">
                <Button variant="secondary" onClick={resetDrawing}>
                    Start Over
                </Button>
            </div>
        </div>
    );
}
