'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface Point {
    x: number;
    y: number;
}

const HEART_TOP: Point = { x: 150, y: 70 };
const HEART_BOTTOM: Point = { x: 150, y: 250 };
const PATH_THRESHOLD = 26;
const START_THRESHOLD = 45;

const cubicBezier = (p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point => {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;

    return {
        x: (mt2 * mt * p0.x) + (3 * mt2 * t * p1.x) + (3 * mt * t2 * p2.x) + (t2 * t * p3.x),
        y: (mt2 * mt * p0.y) + (3 * mt2 * t * p1.y) + (3 * mt * t2 * p2.y) + (t2 * t * p3.y)
    };
};

const sampleBezier = (p0: Point, p1: Point, p2: Point, p3: Point, segments: number) => {
    const points: Point[] = [];
    for (let i = 0; i <= segments; i++) {
        points.push(cubicBezier(p0, p1, p2, p3, i / segments));
    }
    return points;
};

const HEART_PATH: Point[] = [
    ...sampleBezier(
        HEART_TOP,
        { x: 50, y: 0 },
        { x: 0, y: 100 },
        HEART_BOTTOM,
        70
    ),
    ...sampleBezier(
        HEART_BOTTOM,
        { x: 300, y: 100 },
        { x: 250, y: 0 },
        HEART_TOP,
        70
    ).slice(1)
];

export default function Day7Puzzle({ onComplete }: { onComplete: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const activePointerId = useRef<number | null>(null);
    const pathIndexRef = useRef(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<Point[]>([]);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [startHint, setStartHint] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Guide path
        ctx.save();
        ctx.strokeStyle = '#FFB3C1';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(HEART_PATH[0].x, HEART_PATH[0].y);
        HEART_PATH.slice(1).forEach(point => ctx.lineTo(point.x, point.y));
        ctx.stroke();
        ctx.restore();

        // Progress highlight along the heart path
        const progressIndex = Math.floor(progress * (HEART_PATH.length - 1));
        if (progressIndex > 1) {
            ctx.save();
            ctx.strokeStyle = '#FF6B6B';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.shadowColor = 'rgba(255, 107, 107, 0.35)';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(HEART_PATH[0].x, HEART_PATH[0].y);
            HEART_PATH.slice(1, progressIndex + 1).forEach(point => ctx.lineTo(point.x, point.y));
            ctx.stroke();
            ctx.restore();
        }

        // User path
        if (points.length > 1) {
            ctx.save();
            ctx.strokeStyle = '#B76E79';
            ctx.lineWidth = 3;
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

        // Start marker
        ctx.save();
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(HEART_TOP.x, HEART_TOP.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Hint marker for the next section
        const hintIndex = Math.min(progressIndex + 6, HEART_PATH.length - 1);
        const hintPoint = HEART_PATH[hintIndex];
        ctx.save();
        ctx.beginPath();
        ctx.arc(hintPoint.x, hintPoint.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#FF8FA3';
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = '#FF6B6B';
        ctx.font = '16px sans-serif';
        ctx.fillText('Start Here', HEART_TOP.x - 40, HEART_TOP.y - 20);
    }, [points, progress]);

    const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const updateProgress = (point: Point) => {
        let closestIndex = -1;
        let closestDistance = Infinity;

        for (let i = 0; i < HEART_PATH.length; i++) {
            const dx = point.x - HEART_PATH[i].x;
            const dy = point.y - HEART_PATH[i].y;
            const distance = dx * dx + dy * dy;
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = i;
            }
        }

        if (closestDistance <= PATH_THRESHOLD * PATH_THRESHOLD) {
            const newIndex = Math.max(pathIndexRef.current, closestIndex);
            if (newIndex !== pathIndexRef.current) {
                pathIndexRef.current = newIndex;
                const newProgress = newIndex / (HEART_PATH.length - 1);
                setProgress(newProgress);

                if (newProgress >= 0.92 && !completed) {
                    setCompleted(true);
                    setTimeout(() => onComplete(), 500);
                }
            }
        }
    };

    const handleStart = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (activePointerId.current !== null) return;
        activePointerId.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);

        const point = getCanvasPoint(e);
        if (point) {
            const dx = point.x - HEART_TOP.x;
            const dy = point.y - HEART_TOP.y;
            const distanceToStart = Math.sqrt(dx * dx + dy * dy);
            setStartHint(distanceToStart > START_THRESHOLD && progress < 0.05);
            setIsDrawing(true);
            setPoints([point]);
            updateProgress(point);
        }
    };

    const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (activePointerId.current !== e.pointerId) return;
        if (!isDrawing) return;

        const point = getCanvasPoint(e);
        if (point) {
            setPoints(prev => {
                const newPoints = [...prev, point];
                return newPoints;
            });
            updateProgress(point);
        }
    };

    const handleEnd = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (activePointerId.current !== e.pointerId) return;
        activePointerId.current = null;
        setIsDrawing(false);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    const resetDrawing = () => {
        pathIndexRef.current = 0;
        setPoints([]);
        setProgress(0);
        setCompleted(false);
        setStartHint(false);
    };

    return (
        <div className="text-center w-full">
            <div className="glass-card w-full max-w-md mx-auto p-4 mb-6">
                <p className="text-charcoal-light text-sm">
                    Trace the heart path. Stay close to the glowing line and follow the hint dot.
                </p>
                <div className="mt-3 h-2 bg-blush-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-coral to-rose-gold"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress * 100}%` }}
                    />
                </div>
                <p className="text-xs text-charcoal-light mt-1">{Math.round(progress * 100)}% complete</p>
                {startHint && (
                    <p className="text-xs text-coral mt-1">Tip: start at the glowing dot.</p>
                )}
            </div>

            <div className="glass-card w-full max-w-[320px] sm:max-w-[360px] mx-auto p-2 sm:p-4">
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="w-full h-auto cursor-crosshair touch-none rounded-xl"
                    style={{ background: 'rgba(255, 249, 240, 0.8)' }}
                    onPointerDown={handleStart}
                    onPointerMove={handleMove}
                    onPointerUp={handleEnd}
                    onPointerLeave={handleEnd}
                    onPointerCancel={handleEnd}
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
