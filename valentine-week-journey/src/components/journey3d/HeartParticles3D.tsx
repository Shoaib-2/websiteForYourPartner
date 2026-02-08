'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VALENTINE_COLORS } from '@/lib/theme';

interface HeartParticle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    scale: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    life: number;
}

interface HeartParticles3DProps {
    /** Position to emit hearts from */
    position?: [number, number, number];
    /** Number of hearts */
    count?: number;
    /** Whether particles are active */
    active?: boolean;
}

export function HeartParticles3D({
    position = [0, 0, 0],
    count = 15,
    active = true
}: HeartParticles3DProps) {
    const groupRef = useRef<THREE.Group>(null);

    // Create particles
    const particles = useMemo(() => {
        return Array.from({ length: count }).map(() => createParticle(position));
    }, [count, position]);

    const particlesRef = useRef<HeartParticle[]>(particles);

    useFrame((state, delta) => {
        if (!groupRef.current || !active) return;

        particlesRef.current.forEach((particle, i) => {
            // Update position
            particle.position.add(particle.velocity.clone().multiplyScalar(delta));

            // Add gentle sway
            particle.position.x += Math.sin(state.clock.elapsedTime * 2 + i) * 0.01;

            // Update rotation
            particle.rotation += particle.rotationSpeed * delta;

            // Update life
            particle.life -= delta * 0.3;
            particle.opacity = Math.max(0, particle.life);

            // Reset particle when dead
            if (particle.life <= 0) {
                resetParticle(particle, position);
            }

            // Update mesh
            const mesh = groupRef.current!.children[i] as THREE.Mesh;
            if (mesh) {
                mesh.position.copy(particle.position);
                mesh.rotation.z = particle.rotation;
                mesh.scale.setScalar(particle.scale * (0.5 + particle.opacity * 0.5));
                (mesh.material as THREE.MeshStandardMaterial).opacity = particle.opacity * 0.8;
            }
        });
    });

    return (
        <group ref={groupRef}>
            {particlesRef.current.map((particle, i) => (
                <mesh key={i} position={particle.position.toArray()}>
                    <HeartShape />
                    <meshStandardMaterial
                        color={i % 2 === 0 ? VALENTINE_COLORS.coral : VALENTINE_COLORS.roseGold}
                        transparent
                        opacity={0.8}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Heart shape geometry
function HeartShape() {
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        const x = 0, y = 0;
        s.moveTo(x, y + 0.25);
        s.bezierCurveTo(x, y + 0.25, x - 0.25, y, x - 0.25, y);
        s.bezierCurveTo(x - 0.55, y, x - 0.55, y + 0.35, x - 0.55, y + 0.35);
        s.bezierCurveTo(x - 0.55, y + 0.55, x - 0.35, y + 0.77, x, y + 1);
        s.bezierCurveTo(x + 0.35, y + 0.77, x + 0.55, y + 0.55, x + 0.55, y + 0.35);
        s.bezierCurveTo(x + 0.55, y + 0.35, x + 0.55, y, x + 0.25, y);
        s.bezierCurveTo(x + 0.1, y, x, y + 0.25, x, y + 0.25);
        return s;
    }, []);

    return <shapeGeometry args={[shape]} />;
}

function createParticle(position: [number, number, number]): HeartParticle {
    return {
        position: new THREE.Vector3(
            position[0] + (Math.random() - 0.5) * 8,
            position[1] + Math.random() * 2,
            position[2] + (Math.random() - 0.5) * 8
        ),
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            0.5 + Math.random() * 0.5,
            (Math.random() - 0.5) * 0.5
        ),
        scale: 0.2 + Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 2,
        opacity: 1,
        life: 0.5 + Math.random() * 1.5,
    };
}

function resetParticle(particle: HeartParticle, position: [number, number, number]) {
    particle.position.set(
        position[0] + (Math.random() - 0.5) * 8,
        position[1] + Math.random() * 2,
        position[2] + (Math.random() - 0.5) * 8
    );
    particle.velocity.set(
        (Math.random() - 0.5) * 0.5,
        0.5 + Math.random() * 0.5,
        (Math.random() - 0.5) * 0.5
    );
    particle.scale = 0.2 + Math.random() * 0.3;
    particle.rotation = Math.random() * Math.PI * 2;
    particle.rotationSpeed = (Math.random() - 0.5) * 2;
    particle.opacity = 1;
    particle.life = 0.5 + Math.random() * 1.5;
}
