'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Billboard, Text } from '@react-three/drei';
import { VALENTINE_COLORS } from '@/lib/theme';

// Love notes that float near trees
const LOVE_NOTES = [
    "Forever yours ♥",
    "You & Me",
    "I love you",
    "My heart belongs to you",
    "Always together",
    "You make me smile",
];

interface LoveNoteProps {
    position: [number, number, number];
    text: string;
}

function LoveNote({ position, text }: LoveNoteProps) {
    const ref = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (ref.current) {
            // Gentle floating animation
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3;
        }
    });

    return (
        <group ref={ref} position={position}>
            <Billboard follow={true}>
                {/* Note background */}
                <mesh>
                    <planeGeometry args={[2.5, 0.8]} />
                    <meshStandardMaterial
                        color="#FFF5F7"
                        transparent
                        opacity={0.9}
                    />
                </mesh>
                {/* Note text */}
                <Text
                    position={[0, 0, 0.01]}
                    fontSize={0.2}
                    color={VALENTINE_COLORS.coralDark}
                    anchorX="center"
                    anchorY="middle"
                >
                    {text}
                </Text>
            </Billboard>
        </group>
    );
}

export function LoveNotes() {
    const notePositions = useMemo(() => {
        return [
            { pos: [15, 4, 10] as [number, number, number], text: LOVE_NOTES[0] },
            { pos: [-18, 3.5, -5] as [number, number, number], text: LOVE_NOTES[1] },
            { pos: [8, 4, -15] as [number, number, number], text: LOVE_NOTES[2] },
            { pos: [-12, 3, 18] as [number, number, number], text: LOVE_NOTES[3] },
        ];
    }, []);

    return (
        <group>
            {notePositions.map((note, i) => (
                <LoveNote key={i} position={note.pos} text={note.text} />
            ))}
        </group>
    );
}

// Couple silhouette on a bench
function CoupleSilhouette({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
    return (
        <group position={position} rotation={[0, rotation, 0]}>
            {/* Bench */}
            <mesh position={[0, 0.4, 0]} castShadow>
                <boxGeometry args={[2, 0.1, 0.6]} />
                <meshStandardMaterial color="#8D6E63" />
            </mesh>
            {/* Bench legs */}
            <mesh position={[-0.8, 0.2, 0]} castShadow>
                <boxGeometry args={[0.1, 0.4, 0.5]} />
                <meshStandardMaterial color="#6D4C41" />
            </mesh>
            <mesh position={[0.8, 0.2, 0]} castShadow>
                <boxGeometry args={[0.1, 0.4, 0.5]} />
                <meshStandardMaterial color="#6D4C41" />
            </mesh>
            {/* Back rest */}
            <mesh position={[0, 0.7, -0.25]} castShadow>
                <boxGeometry args={[2, 0.5, 0.08]} />
                <meshStandardMaterial color="#8D6E63" />
            </mesh>

            {/* Person 1 silhouette (simple shapes) */}
            <group position={[-0.4, 0.8, 0]}>
                {/* Head */}
                <mesh position={[0, 0.4, 0]}>
                    <sphereGeometry args={[0.15, 12, 12]} />
                    <meshStandardMaterial color="#37474F" />
                </mesh>
                {/* Body */}
                <mesh position={[0, 0.1, 0]}>
                    <capsuleGeometry args={[0.12, 0.25, 6, 8]} />
                    <meshStandardMaterial color="#455A64" />
                </mesh>
            </group>

            {/* Person 2 silhouette */}
            <group position={[0.3, 0.8, 0]}>
                {/* Head */}
                <mesh position={[0, 0.35, 0]}>
                    <sphereGeometry args={[0.12, 12, 12]} />
                    <meshStandardMaterial color="#37474F" />
                </mesh>
                {/* Body */}
                <mesh position={[0, 0.05, 0]}>
                    <capsuleGeometry args={[0.1, 0.22, 6, 8]} />
                    <meshStandardMaterial color="#546E7A" />
                </mesh>
            </group>

            {/* Heart floating above them */}
            <mesh position={[0, 1.4, 0]} rotation={[0, 0, Math.PI]}>
                <HeartGeometry size={0.15} />
                <meshStandardMaterial color={VALENTINE_COLORS.coral} />
            </mesh>
        </group>
    );
}

// Reusable heart geometry component
function HeartGeometry({ size = 1 }: { size?: number }) {
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        const x = 0, y = 0;
        const scale = size;
        s.moveTo(x * scale, (y + 0.25) * scale);
        s.bezierCurveTo(x * scale, (y + 0.25) * scale, (x - 0.25) * scale, y * scale, (x - 0.25) * scale, y * scale);
        s.bezierCurveTo((x - 0.55) * scale, y * scale, (x - 0.55) * scale, (y + 0.35) * scale, (x - 0.55) * scale, (y + 0.35) * scale);
        s.bezierCurveTo((x - 0.55) * scale, (y + 0.55) * scale, (x - 0.35) * scale, (y + 0.77) * scale, x * scale, (y + 1) * scale);
        s.bezierCurveTo((x + 0.35) * scale, (y + 0.77) * scale, (x + 0.55) * scale, (y + 0.55) * scale, (x + 0.55) * scale, (y + 0.35) * scale);
        s.bezierCurveTo((x + 0.55) * scale, (y + 0.35) * scale, (x + 0.55) * scale, y * scale, (x + 0.25) * scale, y * scale);
        s.bezierCurveTo((x + 0.1) * scale, y * scale, x * scale, (y + 0.25) * scale, x * scale, (y + 0.25) * scale);
        return s;
    }, [size]);

    return <shapeGeometry args={[shape]} />;
}

export function CoupleSilhouettes() {
    const positions = useMemo(() => [
        { pos: [40, 0, 15] as [number, number, number], rot: -0.5 },
        { pos: [-35, 0, -20] as [number, number, number], rot: 2.2 },
        { pos: [20, 0, -40] as [number, number, number], rot: 1.2 },
    ], []);

    return (
        <group>
            {positions.map((item, i) => (
                <CoupleSilhouette key={i} position={item.pos} rotation={item.rot} />
            ))}
        </group>
    );
}

// Export all romantic elements as a single component
export function RomanticElements() {
    return (
        <group>
            <LoveNotes />
            <CoupleSilhouettes />
        </group>
    );
}
