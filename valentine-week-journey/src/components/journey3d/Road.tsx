'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Circular road loop with better colors
export function Road() {
    const roadRadius = 30;
    const roadWidth = 4;
    const segments = 48;

    return (
        <group>
            {/* Circular Road - darker asphalt */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
                <ringGeometry args={[roadRadius - roadWidth / 2, roadRadius + roadWidth / 2, segments]} />
                <meshStandardMaterial color="#3a3a3a" />
            </mesh>

            {/* Road center line - yellow dashed */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
                <ringGeometry args={[roadRadius - 0.15, roadRadius + 0.15, segments]} />
                <meshStandardMaterial color="#FFD700" />
            </mesh>

            {/* Road edges - white */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
                <ringGeometry args={[roadRadius - roadWidth / 2 - 0.3, roadRadius - roadWidth / 2 - 0.1, segments]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
                <ringGeometry args={[roadRadius + roadWidth / 2 + 0.1, roadRadius + roadWidth / 2 + 0.3, segments]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
        </group>
    );
}

// Better looking trees with round foliage
export function Trees() {
    const treePositions = Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.2;
        const radius = i % 2 === 0 ? 16 + Math.random() * 3 : 38 + Math.random() * 5;
        const scale = 0.7 + Math.random() * 0.6;
        return { pos: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [number, number, number], scale };
    });

    return (
        <group>
            {treePositions.map((tree, i) => (
                <PrettyTree key={i} position={tree.pos} scale={tree.scale} />
            ))}
        </group>
    );
}

function PrettyTree({ position, scale }: { position: [number, number, number]; scale: number }) {
    return (
        <group position={position} scale={scale}>
            {/* Trunk - brown cylinder */}
            <mesh position={[0, 1.2, 0]} castShadow>
                <cylinderGeometry args={[0.25, 0.35, 2.4, 8]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
            {/* Foliage - multiple spheres for fluffy look */}
            <mesh position={[0, 3, 0]} castShadow>
                <sphereGeometry args={[1.5, 12, 12]} />
                <meshStandardMaterial color="#43A047" />
            </mesh>
            <mesh position={[0.8, 2.5, 0.5]} castShadow>
                <sphereGeometry args={[1, 10, 10]} />
                <meshStandardMaterial color="#66BB6A" />
            </mesh>
            <mesh position={[-0.7, 2.7, -0.4]} castShadow>
                <sphereGeometry args={[0.9, 10, 10]} />
                <meshStandardMaterial color="#4CAF50" />
            </mesh>
            <mesh position={[0.2, 3.8, 0]} castShadow>
                <sphereGeometry args={[0.8, 10, 10]} />
                <meshStandardMaterial color="#81C784" />
            </mesh>
        </group>
    );
}

// Better flowers - actual flower shapes
export function Flowers() {
    const flowerData = Array.from({ length: 40 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 8 + Math.random() * 35;
        // Avoid road area
        if (radius > 26 && radius < 34) return null;
        const colors = ['#FF69B4', '#FF1493', '#E91E63', '#F06292', '#FF5722', '#FFEB3B', '#9C27B0'];
        return {
            pos: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [number, number, number],
            color: colors[Math.floor(Math.random() * colors.length)],
            scale: 0.5 + Math.random() * 0.5
        };
    }).filter(Boolean);

    return (
        <group>
            {flowerData.map((flower, i) => flower && (
                <PrettyFlower key={i} position={flower.pos} color={flower.color} scale={flower.scale} />
            ))}
        </group>
    );
}

function PrettyFlower({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
    return (
        <group position={position} scale={scale}>
            {/* Stem */}
            <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
                <meshStandardMaterial color="#4CAF50" />
            </mesh>
            {/* Center */}
            <mesh position={[0, 0.65, 0]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial color="#FFC107" />
            </mesh>
            {/* Petals */}
            {[0, 1, 2, 3, 4].map((j) => (
                <mesh key={j} position={[
                    Math.cos(j * Math.PI * 0.4) * 0.18,
                    0.65,
                    Math.sin(j * Math.PI * 0.4) * 0.18
                ]}>
                    <sphereGeometry args={[0.1, 6, 6]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            ))}
        </group>
    );
}

// Better birds - actual bird shapes
export function Birds() {
    const birdsRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (birdsRef.current) {
            birdsRef.current.children.forEach((bird, i) => {
                const time = state.clock.elapsedTime + i * 2.5;
                const radius = 20 + i * 12;
                bird.position.x = Math.cos(time * 0.15) * radius;
                bird.position.z = Math.sin(time * 0.15) * radius;
                bird.position.y = 15 + Math.sin(time * 1.5) * 2 + i * 3;
                bird.rotation.y = -time * 0.15 + Math.PI / 2;
                // Wing flapping
                const wing1 = bird.children[1] as THREE.Mesh;
                const wing2 = bird.children[2] as THREE.Mesh;
                if (wing1 && wing2) {
                    wing1.rotation.z = Math.sin(time * 8) * 0.5;
                    wing2.rotation.z = -Math.sin(time * 8) * 0.5;
                }
            });
        }
    });

    return (
        <group ref={birdsRef}>
            {Array.from({ length: 5 }).map((_, i) => (
                <group key={i} position={[0, 15, 0]}>
                    {/* Body */}
                    <mesh>
                        <capsuleGeometry args={[0.15, 0.4, 6, 8]} />
                        <meshStandardMaterial color="#37474F" />
                    </mesh>
                    {/* Left wing */}
                    <mesh position={[0.25, 0, 0]} rotation={[0, 0, 0.3]}>
                        <boxGeometry args={[0.5, 0.05, 0.25]} />
                        <meshStandardMaterial color="#455A64" />
                    </mesh>
                    {/* Right wing */}
                    <mesh position={[-0.25, 0, 0]} rotation={[0, 0, -0.3]}>
                        <boxGeometry args={[0.5, 0.05, 0.25]} />
                        <meshStandardMaterial color="#455A64" />
                    </mesh>
                    {/* Head */}
                    <mesh position={[0, 0, -0.3]}>
                        <sphereGeometry args={[0.12, 8, 8]} />
                        <meshStandardMaterial color="#37474F" />
                    </mesh>
                    {/* Beak */}
                    <mesh position={[0, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
                        <coneGeometry args={[0.04, 0.12, 4]} />
                        <meshStandardMaterial color="#FFC107" />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

// Ocean with better color
export function Ocean() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <circleGeometry args={[200, 64]} />
            <meshStandardMaterial color="#0288D1" transparent opacity={0.9} />
        </mesh>
    );
}

// Bigger, more visible sun with glow
export function Sun() {
    return (
        <group position={[80, 60, -80]}>
            {/* Sun core */}
            <mesh>
                <sphereGeometry args={[12, 32, 32]} />
                <meshBasicMaterial color="#FFEB3B" />
            </mesh>
            {/* Sun glow */}
            <mesh>
                <sphereGeometry args={[15, 32, 32]} />
                <meshBasicMaterial color="#FFF59D" transparent opacity={0.4} />
            </mesh>
            {/* Light */}
            <pointLight intensity={2} distance={300} color="#FFF8E1" />
        </group>
    );
}

// Island with better grass color
export function Island() {
    return (
        <group>
            {/* Main grass */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <circleGeometry args={[50, 64]} />
                <meshStandardMaterial color="#7CB342" />
            </mesh>
            {/* Beach ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <ringGeometry args={[48, 58, 64]} />
                <meshStandardMaterial color="#FFCC80" />
            </mesh>
        </group>
    );
}

// Heart decorations scattered around
export function HeartDecorations() {
    const hearts = Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 12 + Math.random() * 5;
        return [Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius] as [number, number, number];
    });

    return (
        <group>
            {hearts.map((pos, i) => (
                <mesh key={i} position={pos} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.8, 16]} />
                    <meshStandardMaterial color="#E91E63" transparent opacity={0.7} />
                </mesh>
            ))}
        </group>
    );
}

// Bigger, more visible clouds
export function Clouds() {
    const cloudsRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (cloudsRef.current) {
            cloudsRef.current.children.forEach((cloud, i) => {
                const time = state.clock.elapsedTime * 0.02 + i * 1.2;
                const radius = 60 + i * 20;
                cloud.position.x = Math.cos(time) * radius;
                cloud.position.z = Math.sin(time) * radius;
            });
        }
    });

    return (
        <group ref={cloudsRef}>
            {Array.from({ length: 8 }).map((_, i) => (
                <BigCloud key={i} position={[0, 30 + i * 5, 0]} scale={1 + Math.random() * 0.5} />
            ))}
        </group>
    );
}

function BigCloud({ position, scale }: { position: [number, number, number]; scale: number }) {
    return (
        <group position={position} scale={scale}>
            <mesh>
                <sphereGeometry args={[5, 12, 12]} />
                <meshStandardMaterial color="#FFFFFF" transparent opacity={0.95} />
            </mesh>
            <mesh position={[4, -0.5, 0]}>
                <sphereGeometry args={[4, 10, 10]} />
                <meshStandardMaterial color="#FFFFFF" transparent opacity={0.95} />
            </mesh>
            <mesh position={[-3.5, -0.3, 1]}>
                <sphereGeometry args={[3.5, 10, 10]} />
                <meshStandardMaterial color="#FFFFFF" transparent opacity={0.95} />
            </mesh>
            <mesh position={[1.5, 1.5, -1]}>
                <sphereGeometry args={[3, 10, 10]} />
                <meshStandardMaterial color="#FFFFFF" transparent opacity={0.95} />
            </mesh>
        </group>
    );
}
