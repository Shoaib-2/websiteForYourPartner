'use client';

import React, { Suspense, useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Car, Gamepad2, Mouse, Volume2, VolumeX } from 'lucide-react';
import { CuteCar, CuteCarRef } from './CuteCar';
import { Road, Trees, Flowers, Birds, Ocean, Sun, Island, HeartDecorations, Clouds } from './Road';
import { DayMarkers } from './DayMarkers';
import { MobileControls, ControlState } from './MobileControls';
import { HeartParticles3D } from './HeartParticles3D';
import { RomanticElements } from './RomanticElements';
import { useJourney } from '@/context/JourneyContext';
import { getBackgroundMusic } from '@/lib/audio';

interface SceneProps {
    mobileControls: ControlState;
    carRef: React.RefObject<CuteCarRef | null>;
    isMobile: boolean;
}

function Scene({ mobileControls, carRef, isMobile }: SceneProps) {
    const { progress } = useJourney();

    // Calculate car start position based on completed puzzles
    // Road radius is 30, use same formula as DayMarkers
    const roadRadius = 30;
    const completedCount = progress.completedDays.length;
    const carStartPosition = useMemo<[number, number, number]>(() => {
        // Position car at next day's location (or Day 1 if none completed)
        const nextDay = Math.min(completedCount, 7); // 0-7 for array index
        const angle = (nextDay / 8) * Math.PI * 2 - Math.PI / 2;
        const carX = Math.cos(angle) * roadRadius;
        const carZ = Math.sin(angle) * roadRadius;
        return [carX, 0.4, carZ];
    }, [completedCount]);

    return (
        <>
            {/* Valentine-themed lighting - simplified on mobile */}
            <ambientLight intensity={isMobile ? 0.8 : 0.7} color="#FFF5F7" />
            <directionalLight
                position={[50, 80, 30]}
                intensity={1.5}
                castShadow={!isMobile}
                shadow-mapSize={isMobile ? [512, 512] : [2048, 2048]}
                color="#FFE5E5"
            />
            {!isMobile && <hemisphereLight intensity={0.5} groundColor="#7CB342" color="#FFB3C1" />}

            {/* Warm fog for romantic atmosphere */}
            <fog attach="fog" args={['#FFF9F0', 50, 200]} />

            {/* Environment */}
            <Ocean />
            <Island />
            <Road />

            {/* Nature - reduced on mobile */}
            <Trees />
            {!isMobile && <Flowers />}
            <HeartDecorations />

            {/* Animated elements - skip some on mobile for performance */}
            {!isMobile && <Birds />}
            <Sun />
            {!isMobile && <Clouds />}

            {/* Romantic elements - skip on mobile for performance */}
            {!isMobile && <HeartParticles3D position={[0, 2, 0]} count={15} />}
            {!isMobile && <RomanticElements />}

            {/* Day Markers */}
            <DayMarkers />

            {/* Player car - starts at position based on progress */}
            <CuteCar ref={carRef} mobileControls={mobileControls} startPosition={carStartPosition} />
        </>
    );
}

// Smooth camera zoom helper - smooths out discrete mouse wheel steps
function SmoothZoom({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
    const { camera } = useThree();
    const targetDistance = useRef<number>(camera.position.length());
    const currentDistance = useRef<number>(camera.position.length());

    useFrame(() => {
        if (!controlsRef.current) return;

        // Lerp current towards target (smooth interpolation)
        currentDistance.current += (targetDistance.current - currentDistance.current) * 0.08;

        // Get direction from origin (target point) to camera
        const direction = camera.position.clone().normalize();

        // Apply new distance
        camera.position.copy(direction.multiplyScalar(currentDistance.current));

        // Update controls
        controlsRef.current.update();
    });

    // Listen for wheel events to update target zoom
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            const zoomDelta = e.deltaY * 0.02;
            targetDistance.current = Math.max(8, Math.min(80, targetDistance.current + zoomDelta));
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        return () => window.removeEventListener('wheel', handleWheel);
    }, []);

    return null;
}

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center h-full bg-gradient-to-b from-sky-100 to-green-100">
            <div
                className="text-6xl text-primary animate-bounce"
                style={{ animation: 'bounce 1s ease-in-out infinite, sway 1.5s ease-in-out infinite' }}
            >
                <Car size={64} />
            </div>
        </div>
    );
}

export function RoadScene() {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const carRef = useRef<CuteCarRef>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isJoystickActive, setIsJoystickActive] = useState(false);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkMobile();
    }, []);

    const [mobileControls, setMobileControls] = useState<ControlState>({
        forward: false,
        backward: false,
        left: false,
        right: false,
        brake: false,
    });

    const handleMobileControlChange = useCallback((controls: ControlState) => {
        setMobileControls(controls);
    }, []);

    // Background music state
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);

    const handleMusicToggle = useCallback(async () => {
        try {
            console.log('Toggling music...');
            const music = getBackgroundMusic();
            const wasPlaying = music.getIsPlaying();
            await music.toggle();
            const isNowPlaying = music.getIsPlaying();
            console.log(`Music toggle: ${wasPlaying} -> ${isNowPlaying}`);
            setIsMusicPlaying(isNowPlaying);
        } catch (error) {
            console.error('Error toggling music:', error);
            setIsMusicPlaying(false);
        }
    }, []);

    return (
        <div className="w-full h-full">
            <Suspense fallback={<LoadingFallback />}>
                <Canvas
                    shadows={!isMobile}
                    camera={{ position: [0, 50, 80], fov: 60 }}
                    dpr={isMobile ? 1 : [1, 2]}
                >
                    {/* Soft blush sky */}
                    <color attach="background" args={['#87CEEB']} />
                    <Scene mobileControls={mobileControls} carRef={carRef} isMobile={isMobile} />

                    {/* Camera controls - zoom handled by SmoothZoom for better feel */}
                    <OrbitControls
                        ref={controlsRef}
                        makeDefault
                        enabled={!isMobile || !isJoystickActive}
                        enablePan={true}
                        enableZoom={false}
                        enableRotate={true}
                        minDistance={8}
                        maxDistance={80}
                        minPolarAngle={0.1}
                        maxPolarAngle={Math.PI / 2.1}
                        rotateSpeed={0.5}
                        dampingFactor={0.1}
                        enableDamping={true}
                    />

                    {/* Smooth zoom handler */}
                    <SmoothZoom controlsRef={controlsRef} />
                </Canvas>
            </Suspense>

            {/* Mobile Controls Overlay */}
            <MobileControls
                onControlChange={handleMobileControlChange}
                onMusicToggle={handleMusicToggle}
                isMusicPlaying={isMusicPlaying}
                onJoystickActiveChange={setIsJoystickActive}
            />

            {/* Desktop Controls overlay - hidden on mobile, tablets, and smart displays */}
            <div className="absolute bottom-24 left-4 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-xl p-4 text-sm shadow-lg border border-white/50 hidden 2xl:block">
                <p className="font-bold text-coral mb-2 flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" /> Controls
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-charcoal">
                    <span>W / ↑</span><span>Accelerate</span>
                    <span>S / ↓</span><span>Reverse</span>
                    <span>A / ←</span><span>Turn Left</span>
                    <span>D / →</span><span>Turn Right</span>
                    <span>Space</span><span>Brake</span>
                </div>
                <div className="border-t border-blush-300 mt-2 pt-2">
                    <p className="font-bold text-rose-gold mb-1 flex items-center gap-2"><Mouse className="w-4 h-4" /> Camera</p>
                    <p className="text-charcoal-light text-xs">Drive: Auto-follow</p>
                    <p className="text-charcoal-light text-xs">Stop: Free Look</p>
                </div>
            </div>

            {/* Desktop Music Toggle Button */}
            {!isMobile && (
                <button
                    onClick={handleMusicToggle}
                    className={`absolute bottom-8 right-8 w-12 h-12 md:w-14 md:h-14 z-50 rounded-full backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-2xl shadow-lg transition-all hover:scale-110 active:scale-95 ${isMusicPlaying ? 'bg-coral/60' : 'bg-white/60'}`}
                    title={isMusicPlaying ? 'Mute Music' : 'Play Music'}
                >
                    {isMusicPlaying ? <Volume2 className="w-6 h-6 md:w-8 md:h-8" /> : <VolumeX className="w-6 h-6 md:w-8 md:h-8" />}
                </button>
            )}
        </div>
    );
}
