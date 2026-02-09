'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Octagon, Volume2, VolumeX } from 'lucide-react';

interface MobileControlsProps {
    onControlChange: (controls: ControlState) => void;
    onMusicToggle: () => void;
    isMusicPlaying: boolean;
    onJoystickActiveChange?: (active: boolean) => void;
}

export interface ControlState {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    brake: boolean;
}

type TouchPoint = {
    readonly identifier: number;
    readonly clientX: number;
    readonly clientY: number;
};

export function MobileControls({ onControlChange, onMusicToggle, isMusicPlaying, onJoystickActiveChange }: MobileControlsProps) {
    const [isMobile, setIsMobile] = useState(false);
    const joystickRef = useRef<HTMLDivElement>(null);
    const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
    const [isJoystickActive, setIsJoystickActive] = useState(false);
    const [isBraking, setIsBraking] = useState(false);
    const joystickTouchIdRef = useRef<number | null>(null);
    const lastControlsRef = useRef<ControlState>({
        forward: false,
        backward: false,
        left: false,
        right: false,
        brake: false,
    });

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Convert joystick position to controls
    const emitControls = useCallback((controls: ControlState) => {
        const last = lastControlsRef.current;
        if (
            controls.forward === last.forward &&
            controls.backward === last.backward &&
            controls.left === last.left &&
            controls.right === last.right &&
            controls.brake === last.brake
        ) {
            return;
        }
        lastControlsRef.current = controls;
        onControlChange(controls);
    }, [onControlChange]);

    const updateControls = useCallback((x: number, y: number, braking: boolean) => {
        const threshold = 0.3;
        const controls: ControlState = {
            forward: y < -threshold,
            backward: y > threshold,
            left: x < -threshold,
            right: x > threshold,
            brake: braking,
        };
        emitControls(controls);
    }, [emitControls]);

    useEffect(() => {
        onJoystickActiveChange?.(isJoystickActive);
    }, [isJoystickActive, onJoystickActiveChange]);

    // Joystick touch handlers
    const updateFromTouch = useCallback((touch: TouchPoint) => {
        if (!joystickRef.current) return;

        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = (touch.clientX - centerX) / (rect.width / 2);
        let dy = (touch.clientY - centerY) / (rect.height / 2);

        // Clamp to circle
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1) {
            dx /= dist;
            dy /= dist;
        }

        setJoystickPos({ x: dx, y: dy });
        updateControls(dx, dy, isBraking);
    }, [isBraking, updateControls]);

    const resetJoystick = useCallback(() => {
        joystickTouchIdRef.current = null;
        setIsJoystickActive(false);
        setJoystickPos({ x: 0, y: 0 });
        updateControls(0, 0, isBraking);
    }, [isBraking, updateControls]);

    const handleJoystickStart = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        if (joystickTouchIdRef.current !== null) return;
        const touch = e.changedTouches[0];
        if (!touch) return;

        joystickTouchIdRef.current = touch.identifier;
        setIsJoystickActive(true);
        updateFromTouch(touch);
    }, [updateFromTouch]);

    const handleJoystickMove = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        const id = joystickTouchIdRef.current;
        if (id === null) return;

        let trackedTouch: TouchPoint | null = null;
        for (let i = 0; i < e.touches.length; i += 1) {
            const touch = e.touches[i];
            if (touch.identifier === id) {
                trackedTouch = touch;
                break;
            }
        }
        if (!trackedTouch) return;

        updateFromTouch(trackedTouch);
    }, [updateFromTouch]);

    const handleJoystickEnd = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        const id = joystickTouchIdRef.current;
        if (id === null) return;

        for (let i = 0; i < e.changedTouches.length; i += 1) {
            if (e.changedTouches[i].identifier === id) {
                resetJoystick();
                break;
            }
        }
    }, [resetJoystick]);

    const handleJoystickCancel = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        resetJoystick();
    }, [resetJoystick]);

    // Brake handlers
    const handleBrakeStart = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        setIsBraking(true);
        updateControls(joystickPos.x, joystickPos.y, true);
    }, [joystickPos, updateControls]);

    const handleBrakeEnd = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        setIsBraking(false);
        updateControls(joystickPos.x, joystickPos.y, false);
    }, [joystickPos, updateControls]);

    // Music toggle handler
    const handleMusicToggle = useCallback(() => {
        onMusicToggle();
    }, [onMusicToggle]);

    if (!isMobile) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {/* Left side: Joystick - responsive positioning */}
            <div
                ref={joystickRef}
                className="absolute bottom-20 sm:bottom-24 md:bottom-28 lg:bottom-8 left-4 sm:left-6 md:left-8 lg:left-8 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 pointer-events-auto touch-none"
                onTouchStart={handleJoystickStart}
                onTouchMove={handleJoystickMove}
                onTouchEnd={handleJoystickEnd}
                onTouchCancel={handleJoystickCancel}
            >
                {/* Joystick base */}
                <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40">
                    {/* Direction indicators */}
                    <div className="absolute top-1 sm:top-2 left-1/2 -translate-x-1/2 text-white/60"><ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /></div>
                    <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 text-white/60"><ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" /></div>
                    <div className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 text-white/60"><ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /></div>
                    <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-white/60"><ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" /></div>
                </div>
                {/* Joystick knob */}
                <div
                    className="absolute w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-coral to-rose-gold shadow-lg border-2 border-white/50 transition-transform duration-75"
                    style={{
                        left: `calc(50% - 20px + ${joystickPos.x * 30}px)`,
                        top: `calc(50% - 20px + ${joystickPos.y * 30}px)`,
                    }}
                />
            </div>

            {/* Right side: Buttons - responsive positioning */}
            <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 lg:bottom-8 right-4 sm:right-6 md:right-8 lg:right-8 flex flex-col gap-2 sm:gap-3 md:gap-4 pointer-events-auto">
                {/* Brake button */}
                <button
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold shadow-lg transition-all ${isBraking
                        ? 'bg-red-500 scale-95'
                        : 'bg-white/30 backdrop-blur-sm border-2 border-white/40'
                        } touch-none`}
                    onTouchStart={handleBrakeStart}
                    onTouchEnd={handleBrakeEnd}
                    onTouchCancel={handleBrakeEnd}
                >
                    <Octagon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 fill-current" />
                </button>

{/* Music toggle button */}
                <button
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-lg active:scale-95 transition-all ${isMusicPlaying ? 'bg-coral/60' : 'bg-white/30'} touch-none`}
                    onClick={handleMusicToggle}
                    onTouchStart={(e) => e.preventDefault()}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        handleMusicToggle();
                    }}
                >
                    {isMusicPlaying ? <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" /> : <VolumeX className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />}
                </button>
            </div>

            {/* Joystick active indicator - responsive */}
            {isJoystickActive && (
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap flex items-center gap-2">
                    {joystickPos.y < -0.3 ? <><ChevronUp className="w-3 h-3 inline" /> Forward</> : joystickPos.y > 0.3 ? <><ChevronDown className="w-3 h-3 inline" /> Reverse</> : ''}
                    {joystickPos.x < -0.3 ? <><ChevronLeft className="w-3 h-3 inline" /> Left</> : joystickPos.x > 0.3 ? <><ChevronRight className="w-3 h-3 inline" /> Right</> : ''}
                </div>
            )}
        </div>
    );
}
