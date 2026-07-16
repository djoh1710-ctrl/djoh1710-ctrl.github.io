import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface CodeOrbProps {
  position?: THREE.Vector3;
  scale?: THREE.Vector3 | number;
  color: string;
  symbol: string;
}

// Lightweight layered centerpiece used in place of the heavy artwork GLB
// models — a handful of cheap primitives (additive glow halo, translucent
// core, wireframe shell, text) instead of a shadow-casting multi-mesh model
// with a large texture.
const CodeOrb = ({ position, scale, color, symbol }: CodeOrbProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x += delta * 0.05;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.1;
      coreRef.current.rotation.z += delta * 0.06;
    }
  });

  return (
    <group position={position} scale={scale} ref={groupRef}>
      {/* Soft additive glow halo */}
      <mesh>
        <sphereGeometry args={[2.3, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false} />
      </mesh>
      {/* Translucent glowing core, counter-rotating for depth */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} depthWrite={false} />
      </mesh>
      {/* Crisp wireframe shell */}
      <mesh>
        <icosahedronGeometry args={[1.6, 0]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>
      <Text fontSize={0.9} color={color} font="./soria-font.ttf" anchorX="center" anchorY="middle">
        {symbol}
      </Text>
    </group>
  );
};

export default CodeOrb;
