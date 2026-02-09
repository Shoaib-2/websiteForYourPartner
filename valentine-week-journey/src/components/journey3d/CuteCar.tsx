'use client';

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three-stdlib';
import * as THREE from 'three';
import { CAR_COLORS, CAR_PHYSICS } from '@/lib/constants';

interface CarControls {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    brake: boolean;
}

export interface CuteCarRef {
    // Reserved for future functionality
}

interface CuteCarProps {
    mobileControls?: CarControls;
    startPosition?: [number, number, number];
    isMobile?: boolean;
}

export const CuteCar = forwardRef<CuteCarRef, CuteCarProps>(function CuteCar({ mobileControls, startPosition = [0, 0.4, 28], isMobile = false }, ref) {
    const carRef = useRef<THREE.Group>(null);
    const { camera, controls } = useThree();

    const [keyboardControls, setKeyboardControls] = useState<CarControls>({
        forward: false,
        backward: false,
        left: false,
        right: false,
        brake: false,
    });

    // Merge keyboard and mobile controls
    const controlsState: CarControls = {
        forward: keyboardControls.forward || (mobileControls?.forward ?? false),
        backward: keyboardControls.backward || (mobileControls?.backward ?? false),
        left: keyboardControls.left || (mobileControls?.left ?? false),
        right: keyboardControls.right || (mobileControls?.right ?? false),
        brake: keyboardControls.brake || (mobileControls?.brake ?? false),
    };

    // Car physics state
    const speed = useRef(0);
    const rotation = useRef(0);
    const wheelSpin = useRef(0);

    // Camera state
    const isDriving = useRef(false);
    const stopTimer = useRef(0);

    // Expose methods to parent (reserved for future functionality)
    useImperativeHandle(ref, () => ({}));

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    setKeyboardControls(c => ({ ...c, forward: true }));
                    break;
                case 's':
                case 'arrowdown':
                    setKeyboardControls(c => ({ ...c, backward: true }));
                    break;
                case 'a':
                case 'arrowleft':
                    setKeyboardControls(c => ({ ...c, left: true }));
                    break;
                case 'd':
                case 'arrowright':
                    setKeyboardControls(c => ({ ...c, right: true }));
                    break;
                case ' ':
                    setKeyboardControls(c => ({ ...c, brake: true }));
                    break;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    setKeyboardControls(c => ({ ...c, forward: false }));
                    break;
                case 's':
                case 'arrowdown':
                    setKeyboardControls(c => ({ ...c, backward: false }));
                    break;
                case 'a':
                case 'arrowleft':
                    setKeyboardControls(c => ({ ...c, left: false }));
                    break;
                case 'd':
                case 'arrowright':
                    setKeyboardControls(c => ({ ...c, right: false }));
                    break;
                case ' ':
                    setKeyboardControls(c => ({ ...c, brake: false }));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        if (!carRef.current) return;
        const frameFactor = Math.min(delta * 60, 2.5);

        // Physics from centralized constants
        const { acceleration, maxSpeed, reverseMaxSpeed, friction, brakePower, turnRate } = CAR_PHYSICS;
        const speedScale = isMobile ? 5.0 : 5.0;
        const accelScale = isMobile ? 4.4 : 4.2;
        const turnScale = isMobile ? 1.35 : 1.35;
        const accel = acceleration * accelScale;
        const maxSpeedScaled = maxSpeed * speedScale;
        const reverseMax = reverseMaxSpeed * speedScale;
        const turnRateScaled = turnRate * turnScale;

        // Accelerate
        if (controlsState.forward) speed.current = Math.min(speed.current + accel * frameFactor, maxSpeedScaled);
        if (controlsState.backward) speed.current = Math.max(speed.current - accel * frameFactor, -reverseMax);
        if (controlsState.brake) speed.current *= Math.pow(brakePower, frameFactor);

        // Friction
        if (!controlsState.forward && !controlsState.backward && !controlsState.brake) {
            speed.current *= Math.pow(friction, frameFactor);
        }
        if (Math.abs(speed.current) < 0.001) speed.current = 0;

        // Steering
        if (Math.abs(speed.current) > 0.05) {
            const turnFactor = Math.min(Math.abs(speed.current) / maxSpeedScaled, 1);
            const turnAssist = isMobile ? 0.25 : 0.3;
            const effectiveTurn = turnRateScaled * (turnAssist + (1 - turnAssist) * turnFactor);
            if (controlsState.left) rotation.current += effectiveTurn * (speed.current > 0 ? 1 : -1) * frameFactor;
            if (controlsState.right) rotation.current -= effectiveTurn * (speed.current > 0 ? 1 : -1) * frameFactor;
        }

        // Move car
        carRef.current.position.x -= Math.sin(rotation.current) * speed.current * frameFactor;
        carRef.current.position.z -= Math.cos(rotation.current) * speed.current * frameFactor;
        carRef.current.rotation.y = rotation.current;

        // Body roll
        const targetRoll = (controlsState.left ? 0.08 : controlsState.right ? -0.08 : 0) * Math.abs(speed.current) / maxSpeedScaled;
        carRef.current.rotation.z = THREE.MathUtils.lerp(carRef.current.rotation.z, targetRoll, 0.1);

        // Keep on island (radius ~48)
        const dist = Math.sqrt(carRef.current.position.x ** 2 + carRef.current.position.z ** 2);
        if (dist > 46) {
            speed.current *= -0.3;
            carRef.current.position.x *= 46 / dist;
            carRef.current.position.z *= 46 / dist;
        }

        // Wheel spin & suspension
        wheelSpin.current += speed.current * 4 * frameFactor;
        carRef.current.position.y = 0.4 + Math.abs(Math.sin(wheelSpin.current * 0.5)) * 0.02;

        // === CAMERA LOGIC ===
        // Determine if driving (moving or inputting)
        const isInputting = controlsState.forward || controlsState.backward || controlsState.left || controlsState.right;
        const isMoving = Math.abs(speed.current) > 0.01;

        if (isInputting || isMoving) {
            isDriving.current = true;
            stopTimer.current = 0;

            // Calculate chase position
            const camDist = 12 + Math.abs(speed.current) * 20;
            const camHeight = 6 + Math.abs(speed.current) * 5;

            // Ideal position behind car
            const targetX = carRef.current.position.x + Math.sin(rotation.current) * camDist;
            const targetZ = carRef.current.position.z + Math.cos(rotation.current) * camDist;
            const targetY = camHeight;

            // Smoothly move camera to chase position
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
            camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);

            // Update OrbitControls target to look at car
            if (controls) {
                const orb = controls as unknown as OrbitControls;
                orb.target.lerp(carRef.current.position, 0.1);
                orb.update(); // Update controls
            }
        } else {
            // Not driving
            if (isDriving.current) {
                stopTimer.current += delta;
                // Transition period: continue slight follow but allow OrbitControls to take over more fully
                // effectively, we just stop forcing camera position but keep updating target to recenter
                if (stopTimer.current > 1.0) {
                    isDriving.current = false; // Completely free
                }
            }

            // Even when stopped, keep target centered on car so rotation works around it
            if (controls) {
                const orb = controls as unknown as OrbitControls;
                orb.target.lerp(carRef.current.position, 0.1);
                orb.update();
            }
        }
    });

    return (
        <group ref={carRef} position={startPosition}>
            {/* Modern sports car design */}
            {/* Body */}
            <mesh castShadow position={[0, 0.25, 0]}>
                <boxGeometry args={[1.6, 0.35, 3.2]} />
                <meshStandardMaterial color={CAR_COLORS.body} metalness={0.7} roughness={0.2} />
            </mesh>
            <mesh castShadow position={[0, 0.55, 0.2]}>
                <boxGeometry args={[1.4, 0.35, 1.8]} />
                <meshStandardMaterial color={CAR_COLORS.bodyAccent} metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh castShadow position={[0, 0.85, 0.15]}>
                <boxGeometry args={[1.2, 0.15, 1.3]} />
                <meshStandardMaterial color={CAR_COLORS.roof} metalness={0.7} roughness={0.2} />
            </mesh>
            {/* Hood */}
            <mesh castShadow position={[0, 0.35, -1.1]} rotation={[0.15, 0, 0]}>
                <boxGeometry args={[1.5, 0.1, 1]} />
                <meshStandardMaterial color={CAR_COLORS.body} metalness={0.7} roughness={0.2} />
            </mesh>
            {/* Spoiler */}
            <mesh castShadow position={[0, 0.45, 1.3]}>
                <boxGeometry args={[1.5, 0.25, 0.6]} />
                <meshStandardMaterial color={CAR_COLORS.roof} metalness={0.7} roughness={0.2} />
            </mesh>
            {/* Windows */}
            <mesh position={[0, 0.65, -0.55]} rotation={[0.5, 0, 0]}>
                <boxGeometry args={[1.25, 0.5, 0.05]} />
                <meshStandardMaterial color={CAR_COLORS.windows} transparent opacity={0.6} metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.68, 0.85]} rotation={[-0.4, 0, 0]}>
                <boxGeometry args={[1.15, 0.4, 0.05]} />
                <meshStandardMaterial color={CAR_COLORS.windows} transparent opacity={0.6} metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Wheels */}
            <ModernWheel position={[0.75, 0.12, -0.9]} spin={wheelSpin.current} />
            <ModernWheel position={[-0.75, 0.12, -0.9]} spin={wheelSpin.current} />
            <ModernWheel position={[0.75, 0.12, 0.9]} spin={wheelSpin.current} />
            <ModernWheel position={[-0.75, 0.12, 0.9]} spin={wheelSpin.current} />
            {/* Lights */}
            <mesh position={[0.5, 0.3, -1.58]}>
                <boxGeometry args={[0.35, 0.12, 0.05]} />
                <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1} />
            </mesh>
            <mesh position={[-0.5, 0.3, -1.58]}>
                <boxGeometry args={[0.35, 0.12, 0.05]} />
                <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1} />
            </mesh>
            <mesh position={[0.55, 0.4, 1.58]}>
                <boxGeometry args={[0.4, 0.08, 0.05]} />
                <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[-0.55, 0.4, 1.58]}>
                <boxGeometry args={[0.4, 0.08, 0.05]} />
                <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.8} />
            </mesh>
            {/* Grill */}
            <mesh position={[0, 0.2, -1.58]}>
                <boxGeometry args={[0.8, 0.15, 0.05]} />
                <meshStandardMaterial color="#212121" />
            </mesh>
        </group>
    );
});

function ModernWheel({ position, spin }: { position: [number, number, number]; spin: number }) {
    const wheelRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (wheelRef.current) {
            wheelRef.current.rotation.x = spin;
        }
    });

    return (
        <group ref={wheelRef} position={position}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.32, 0.32, 0.22, 16]} />
                <meshStandardMaterial color={CAR_COLORS.wheels} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.2, 0.2, 0.24, 8]} />
                <meshStandardMaterial color={CAR_COLORS.wheelRims} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
                <meshStandardMaterial color={CAR_COLORS.wheelAccent} metalness={0.9} roughness={0.1} />
            </mesh>
        </group>
    );
}
