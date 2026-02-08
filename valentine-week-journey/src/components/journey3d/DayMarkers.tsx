'use client';

import React, { useState, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useJourney } from '@/context/JourneyContext';
import { getDayName } from '@/lib/utils';
import { getDayTheme, VALENTINE_COLORS } from '@/lib/theme';
import { useRouter } from 'next/navigation';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function DayMarkers() {
    const { canAccess, isDayCompleted } = useJourney();
    const router = useRouter();

    const handleDayClick = (day: number) => {
        if (canAccess(day)) {
            router.push(`/day/${day}`);
        }
    };

    const roadRadius = 30;

    return (
        <group>
            {Array.from({ length: 8 }).map((_, i) => {
                const day = i + 1;
                const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(angle) * (roadRadius - 6);
                const z = Math.sin(angle) * (roadRadius - 6);
                const accessible = canAccess(day);
                const completed = isDayCompleted(day);

                return (
                    <DayMarker
                        key={day}
                        day={day}
                        position={[x, 0, z]}
                        rotation={angle}
                        accessible={accessible}
                        completed={completed}
                        onClick={() => handleDayClick(day)}
                    />
                );
            })}
        </group>
    );
}

interface DayMarkerProps {
    day: number;
    position: [number, number, number];
    rotation: number;
    accessible: boolean;
    completed: boolean;
    onClick: () => void;
}

function DayMarker({ day, position, rotation, accessible, completed, onClick }: DayMarkerProps) {
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef<THREE.Group>(null);
    const scaleRef = useRef(1);
    const dayName = getDayName(day);
    const theme = getDayTheme(day);

    // Smooth floating and scale animation
    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + day) * 0.08;
            const targetScale = hovered && accessible ? 1.15 : 1;
            scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, delta * 8);
            groupRef.current.scale.setScalar(scaleRef.current);
        }
    });

    // Valentine theme colors (coral/rose-gold/blush palette)
    // Completed: Day's accent color + gold border
    // Accessible: Day's primary color + rose-gold border
    // Locked: Muted lavender + gray
    const plateColor = completed ? theme.accent : accessible ? theme.primary : VALENTINE_COLORS.lavender;
    const borderColor = completed ? '#FFD700' : accessible ? VALENTINE_COLORS.roseGold : '#9E9E9E';
    const textColor = '#FFFFFF';

    const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        if (accessible) {
            document.body.style.cursor = 'pointer';
        }
    };

    const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
    };

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (accessible) {
            onClick();
        }
    };

    return (
        <group position={position} rotation={[0, -rotation + Math.PI, 0]}>
            <group ref={groupRef}>
                {/* Invisible hitbox */}
                <mesh
                    position={[0, 4, 0]}
                    onPointerOver={handlePointerOver}
                    onPointerOut={handlePointerOut}
                    onClick={handleClick}
                    visible={false}
                >
                    <boxGeometry args={[4, 6, 1]} />
                </mesh>

                {/* Pole */}
                <mesh position={[0, 2.5, 0]} castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 5, 8]} />
                    <meshStandardMaterial color="#4E342E" />
                </mesh>

                {/* Board - Dark background for text pop */}
                <mesh position={[0, 5, 0]} castShadow>
                    <boxGeometry args={[3.5, 2, 0.2]} />
                    <meshStandardMaterial color={plateColor} />
                </mesh>

                {/* Border */}
                <mesh position={[0, 5, 0.11]}>
                    <boxGeometry args={[3.7, 2.2, 0.05]} />
                    <meshStandardMaterial color={borderColor} roughness={0.4} metalness={0.6} />
                </mesh>

                {/* Day Number - Large & Bold */}
                <Text
                    position={[0, 5.4, 0.15]}
                    fontSize={0.7}
                    color={textColor}
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                >
                    {`Day ${day}`}
                </Text>

                {/* Day Name - Readable */}
                <Text
                    position={[0, 4.6, 0.15]}
                    fontSize={0.4}
                    color="#E0E0E0" // Slightly off-white
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.01}
                    outlineColor="#000000"
                >
                    {dayName}
                </Text>

                {/* 3D Icons above board */}
                <group position={[0, 6.4, 0]} scale={0.8}>
                    {completed ? (
                        <group>
                            <mesh>
                                <sphereGeometry args={[0.5, 16, 16]} />
                                <meshStandardMaterial color="#4CAF50" />
                            </mesh>
                            {/* Checkmark */}
                            <group position={[0, 0, 0.4]} scale={0.6}>
                                <mesh rotation={[0, 0, -0.6]} position={[-0.2, -0.1, 0]}>
                                    <boxGeometry args={[0.2, 0.6, 0.1]} />
                                    <meshStandardMaterial color="white" />
                                </mesh>
                                <mesh rotation={[0, 0, 0.8]} position={[0.2, 0.1, 0]}>
                                    <boxGeometry args={[0.2, 0.8, 0.1]} />
                                    <meshStandardMaterial color="white" />
                                </mesh>
                            </group>
                        </group>
                    ) : accessible ? (
                        <group>
                            <mesh>
                                <sphereGeometry args={[0.5, 16, 16]} />
                                <meshStandardMaterial color="#E91E63" />
                            </mesh>
                            {/* Play Triangle */}
                            <mesh position={[0.05, 0, 0.4]} rotation={[0, 0, -Math.PI / 2]}>
                                <coneGeometry args={[0.3, 0.5, 3]} />
                                <meshStandardMaterial color="white" />
                            </mesh>
                        </group>
                    ) : (
                        <group>
                            {/* Lock body */}
                            <mesh position={[0, -0.15, 0]}>
                                <boxGeometry args={[0.6, 0.5, 0.3]} />
                                <meshStandardMaterial color="#78909C" />
                            </mesh>
                            {/* Lock shackle */}
                            <mesh position={[0, 0.2, 0]}>
                                <torusGeometry args={[0.2, 0.08, 8, 16, Math.PI]} />
                                <meshStandardMaterial color="#B0BEC5" />
                            </mesh>
                        </group>
                    )}
                </group>

                {/* Click hint - positioned in front of board */}
                {hovered && accessible && (
                    <Text
                        position={[0, 6.5, 0.5]}
                        fontSize={0.4}
                        color="#FFD700"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.03}
                        outlineColor="#000000"
                    >
                        Click to Play!
                    </Text>
                )}
            </group>
        </group>
    );
}
