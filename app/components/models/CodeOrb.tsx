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

// Lightweight wireframe + text centerpiece used in place of the heavy
// artwork GLB models — a couple of primitives instead of a shadow-casting
// multi-mesh model with a large texture.
const CodeOrb = ({ position, scale, color, symbol }: CodeOrbProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group position={position} scale={scale} ref={groupRef}>
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
