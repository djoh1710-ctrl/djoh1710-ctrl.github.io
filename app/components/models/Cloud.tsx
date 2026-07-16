import { useThemeStore } from "@/app/stores";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const SYMBOLS = ['{ }', '</>', '=>', ';', '( )', '[ ]'];

const POSITIONS: [number, number, number][] = [
  [-11, 3, -4],
  [9, 4, 6],
  [-6, -12, 14],
  [12, -8, 4],
  [-14, -18, 20],
  [4, -22, 16],
  [14, -14, -8],
  [-3, 6, -10],
  [-9, -5, 18],
  [7, -18, -6],
  [-16, -10, 8],
  [2, 8, -12],
  [16, 1, 12],
  [-4, -16, -2],
];

// Deterministic pseudo-random (sine-hash) so values are stable across
// re-renders without calling Math.random during render.
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const CloudContainer = () => {
  const groupRef = useRef<THREE.Group>(null);
  const isDarkTheme = useThemeStore((state) => state.theme.type === 'dark');

  const symbols = useMemo(() => (
    POSITIONS.map((position, i) => ({
      position,
      text: SYMBOLS[i % SYMBOLS.length],
      fontSize: 3 + seededRandom(i * 12.9898 + 1) * 2.5,
      isBlue: i % 2 === 0,
      phase: seededRandom(i * 78.233 + 2) * Math.PI * 2,
    }))
  ), []);

  const blueColor = isDarkTheme ? '#7C9EFF' : '#3D4F99';
  const amberColor = isDarkTheme ? '#F2A65A' : '#95591A';

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const t = clock.elapsedTime * 0.3 + symbols[i].phase;
      child.position.y = POSITIONS[i][1] + Math.sin(t) * 0.6;
      child.rotation.z = Math.sin(t * 0.5) * 0.05;
    });
  });

  return (
    <group position={[0, -5, 0]} ref={groupRef}>
      {symbols.map((symbol, i) => (
        <Text
          key={i}
          position={symbol.position}
          fontSize={symbol.fontSize}
          color={symbol.isBlue ? blueColor : amberColor}
          fillOpacity={isDarkTheme ? 0.75 : 0.7}
          font="./soria-font.ttf"
          anchorX="center"
          anchorY="middle">
          {symbol.text}
        </Text>
      ))}
    </group>
  );
};

export default CloudContainer;
