import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
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

// Generates a starfield
const StarField = (props: any) => {
  const ref = useRef<THREE.Points>(null!);
  
  const sphere = useMemo(() => {
    const float32Array = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 2 + Math.random() * 3; // Wider radius

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        float32Array[i * 3] = x;
        float32Array[i * 3 + 1] = y;
        float32Array[i * 3 + 2] = z;
    }
    return float32Array;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

// Generates a fluid-like particle wave responsive to mouse
const FluidWave = () => {
  const ref = useRef<THREE.Points>(null!);
  const count = 3000;
  
  const [positions, originals, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originals = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color1 = new THREE.Color("#00ffff");
    const color2 = new THREE.Color("#bd00ff");
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 5;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      originals[i * 3] = x;
      originals[i * 3 + 1] = y;
      originals[i * 3 + 2] = z;

      // Mix colors
      const mixed = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }
    return [positions, originals, colors];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { x: mouseX, y: mouseY } = state.pointer; 
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ox = originals[i3];
      const oy = originals[i3+1];
      const oz = originals[i3+2];
      
      // Calculate distance to mouse pointer in 3D space (projected)
      // Mouse is -1 to 1. World is roughly -7 to 7.
      const dist = Math.sqrt(Math.pow(mouseX * 7 - ox, 2) + Math.pow(mouseY * 7 - oy, 2));
      
      // Repel force
      const force = Math.max(0, 2 - dist) * 1.5; 
      
      // Fluid Ripple + Mouse Repel
      positions[i3] = ox + Math.cos(time + oy) * 0.1 + (mouseX * 7 - ox) * force * 0.1;
      positions[i3 + 1] = oy + Math.sin(time + ox) * 0.1 + (mouseY * 7 - oy) * force * 0.1;
      positions[i3 + 2] = oz + Math.sin(dist * 5 - time * 2) * 0.5 + force;
    }
    
    if (ref.current) {
        ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        vertexColors
        transparent
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

interface SceneProps {
  mode: 'header' | 'footer';
}

const ThreeScene: React.FC<SceneProps> = ({ mode }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
         <ambientLight intensity={0.5} />
         <FluidWave />
         <StarField />
      </Canvas>
    </div>
  );
};

export default ThreeScene;