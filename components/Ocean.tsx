import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      sphereGeometry: any;
      boxGeometry: any;
      cylinderGeometry: any;
      planeGeometry: any;
      coneGeometry: any;
      ringGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      shaderMaterial: any;
    }
  }
}

const WaterShaderMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColorPrimary: { value: new THREE.Color('#001eff') },
        uColorSecondary: { value: new THREE.Color('#00ffff') }
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vElevation;
      uniform float uTime;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        float elevation = sin(pos.x * 2.0 + uTime) * 0.3;
        elevation += sin(pos.y * 1.5 + uTime * 0.8) * 0.3;
        elevation -= cos(pos.x * 5.0 + uTime * 2.0) * 0.1; // Small ripples
        
        pos.z += elevation;
        vElevation = elevation;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vElevation;
      uniform vec3 uColorPrimary;
      uniform vec3 uColorSecondary;
      
      void main() {
        float mixStrength = (vElevation + 0.5) * 0.8;
        vec3 color = mix(uColorPrimary, uColorSecondary, mixStrength);
        gl_FragColor = vec4(color, 0.9);
      }
    `
};

// A simple procedural creature shape
const SeaCreature = ({ position, scale, speed, color, type }: any) => {
    const group = useRef<THREE.Group>(null!);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed;
        if (!group.current) return;
        
        // Swimming motion
        group.current.position.x = position[0] + Math.sin(t) * 5;
        // Jump if Dolphin
        if (type === 'dolphin') {
             group.current.position.y = position[1] + Math.max(-2, Math.sin(t * 2) * 2);
             group.current.rotation.z = -Math.cos(t * 2) * 0.5;
        } else {
             // Whale just floats
             group.current.position.y = position[1] + Math.sin(t * 0.5) * 0.5;
        }
    });

    return (
        <group ref={group} position={position} scale={scale}>
            {/* Body */}
            <mesh scale={[1, 0.4, 0.4]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
            </mesh>
            {/* Tail */}
            <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.5, 0.5, 0.1]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Fin */}
            <mesh position={[0.2, 0.4, 0]} rotation={[0, 0, -0.5]}>
                <coneGeometry args={[0.2, 0.6, 4]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    )
}

const Lighthouse = () => {
    const lightRef = useRef<THREE.SpotLight>(null!);
    useFrame(({ clock }) => {
        if (lightRef.current) {
            lightRef.current.target.position.x = Math.sin(clock.getElapsedTime() * 2) * 15;
            lightRef.current.target.position.z = Math.cos(clock.getElapsedTime() * 2) * 5;
            lightRef.current.target.updateMatrixWorld();
        }
    });

    return (
        <group position={[10, 0, -10]}>
             <mesh position={[0, 3, 0]}>
                 <cylinderGeometry args={[0.4, 0.8, 6]} />
                 <meshStandardMaterial color="#222" />
             </mesh>
             <mesh position={[0, 6, 0]}>
                 <cylinderGeometry args={[0.5, 0.5, 1]} />
                 <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.5} />
             </mesh>
             <spotLight ref={lightRef} position={[0, 6, 0]} angle={0.3} penumbra={0.2} intensity={20} color="#ffffaa" castShadow distance={30} />
        </group>
    )
}

const Ocean = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null!);
    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
        }
    });

    return (
        <group position={[0, -4, 0]}>
            {/* The Ocean Surface */}
            <mesh rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -1, 0]}>
                <planeGeometry args={[40, 20, 128, 128]} />
                <shaderMaterial ref={materialRef} args={[WaterShaderMaterial]} transparent />
            </mesh>
            
            {/* Dolphins */}
            <SeaCreature type="dolphin" position={[0, -2, 2]} scale={[0.5, 0.5, 0.5]} speed={1} color="cyan" />
            <SeaCreature type="dolphin" position={[-3, -2, 1]} scale={[0.5, 0.5, 0.5]} speed={1.2} color="cyan" />
            
            {/* Whale (Deep background) */}
            <SeaCreature type="whale" position={[0, -4, -5]} scale={[2, 2, 2]} speed={0.3} color="#000088" />
            
            <Lighthouse />
        </group>
    );
};

export default Ocean;