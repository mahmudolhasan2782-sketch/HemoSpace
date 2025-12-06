import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

const SolarSystem = () => {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[5, 2, -10]} scale={0.5}>
            {/* Sun */}
            <Sphere args={[2, 32, 32]}>
                <meshStandardMaterial emissive="#ffaa00" emissiveIntensity={2} color="#ffaa00" />
            </Sphere>
            {/* Planet 1 */}
            <group rotation={[0, 0, 0.5]}>
                <mesh position={[4, 0, 0]}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            </group>
             {/* Planet 2 */}
             <group rotation={[0.2, 0, -0.2]}>
                <mesh position={[-6, 1, 0]}>
                    <sphereGeometry args={[0.8, 32, 32]} />
                    <meshStandardMaterial color="red" />
                </mesh>
            </group>
        </group>
    )
}

const BlackHole = () => {
    const mesh = useRef<THREE.Mesh>(null!);
    
    useFrame((state, delta) => {
        mesh.current.rotation.z += delta * 0.5;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
             <group position={[-6, 4, -15]}>
                {/* Event Horizon */}
                <mesh ref={mesh} rotation={[Math.PI/2, 0, 0]}>
                    <ringGeometry args={[3, 5, 64]} />
                    <meshBasicMaterial color="#bd00ff" side={THREE.DoubleSide} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
                </mesh>
                {/* Core */}
                <mesh>
                    <sphereGeometry args={[2.5, 32, 32]} />
                    <meshBasicMaterial color="#000000" />
                </mesh>
                {/* Accretion Disk Glow */}
                <pointLight color="#bd00ff" intensity={5} distance={20} />
             </group>
        </Float>
    )
}

const Satellite = () => {
    const ref = useRef<THREE.Group>(null!);
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * 0.3;
        ref.current.position.x = Math.sin(t) * 8;
        ref.current.position.z = Math.cos(t) * 8 - 5;
        ref.current.rotation.y += 0.01;
        ref.current.rotation.z += 0.01;
    });

    return (
        <group ref={ref}>
            <mesh>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="silver" metalness={1} roughness={0.2} />
            </mesh>
            <mesh position={[0.8, 0, 0]}>
                <boxGeometry args={[1, 0.1, 0.4]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[-0.8, 0, 0]}>
                <boxGeometry args={[1, 0.1, 0.4]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
            </mesh>
        </group>
    )
}

const FooterBackground: React.FC = () => {
  return (
    <>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <SolarSystem />
        <BlackHole />
        <Satellite />
    </>
  );
};

export default FooterBackground;