import { useThemeStore } from "@/app/stores";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const STRAND_COUNT = 140;
const RADIUS = 200;

// Deterministic pseudo-random (sine-hash) so the field is stable across
// re-renders without calling Math.random during render.
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const StarsContainer = () => {
  const groupRef = useRef<THREE.Group>(null);
  const isDarkTheme = useThemeStore((state) => state.theme.type === 'dark');

  const strands = useMemo(() => (
    Array.from({ length: STRAND_COUNT }, (_, index) => {
      const radius = RADIUS * Math.cbrt(seededRandom(index * 12.9898 + 1));
      const theta = seededRandom(index * 78.233 + 2) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(index * 37.719 + 3) - 1);
      const position: [number, number, number] = [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      ];
      const length = 3 + Math.floor(seededRandom(index * 45.164 + 4) * 4);
      const text = Array.from({ length }, (_, bit) => (
        seededRandom(index * 91.345 + bit * 3.71 + 5) > 0.5 ? '1' : '0'
      )).join('\n');

      return {
        position,
        text,
        fontSize: 0.8 + seededRandom(index * 63.982 + 6) * 1.4,
        opacity: 0.25 + seededRandom(index * 20.117 + 7) * 0.5,
      };
    })
  ), []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  const color = isDarkTheme ? '#7C9EFF' : '#3D4F99';

  return (
    <group ref={groupRef}>
      {strands.map((strand, i) => (
        <Text
          key={i}
          position={strand.position}
          fontSize={strand.fontSize}
          color={color}
          fillOpacity={strand.opacity}
          font="./Vercetti-Regular.woff"
          anchorX="center"
          anchorY="middle"
          lineHeight={1.4}>
          {strand.text}
        </Text>
      ))}
    </group>
  );
};

export default StarsContainer;
