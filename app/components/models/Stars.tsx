import { useThemeStore } from "@/app/stores";
import { Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const DIGIT_COUNT = 400;
const RADIUS = 200;

// Deterministic pseudo-random (sine-hash) so the field is stable across
// re-renders without calling Math.random during render.
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

interface Digit {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  isOne: boolean;
}

const StarsContainer = () => {
  const groupRef = useRef<THREE.Group>(null);
  const isDarkTheme = useThemeStore((state) => state.theme.type === 'dark');
  const color = isDarkTheme ? '#7C9EFF' : '#3D4F99';

  const digits = useMemo(() => (
    Array.from({ length: DIGIT_COUNT }, (_, index): Digit => {
      const radius = RADIUS * Math.cbrt(seededRandom(index * 12.9898 + 1));
      const theta = seededRandom(index * 78.233 + 2) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(index * 37.719 + 3) - 1);
      return {
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
        ],
        rotation: [
          seededRandom(index * 20.117 + 4) * Math.PI,
          seededRandom(index * 55.291 + 5) * Math.PI,
          0,
        ],
        scale: 0.5 + seededRandom(index * 63.982 + 6) * 0.9,
        isOne: seededRandom(index * 91.345 + 7) > 0.5,
      };
    })
  ), []);

  const ones = useMemo(() => digits.filter((d) => d.isOne), [digits]);
  const zeros = useMemo(() => digits.filter((d) => !d.isOne), [digits]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Two instanced draw calls total, regardless of digit count. */}
      <Instances limit={Math.max(ones.length, 1)} range={ones.length}>
        <boxGeometry args={[0.16, 1, 0.05]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
        {ones.map((digit, i) => (
          <Instance key={i} position={digit.position} rotation={digit.rotation} scale={digit.scale} />
        ))}
      </Instances>
      <Instances limit={Math.max(zeros.length, 1)} range={zeros.length}>
        <torusGeometry args={[0.4, 0.13, 8, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
        {zeros.map((digit, i) => (
          <Instance key={i} position={digit.position} rotation={digit.rotation} scale={digit.scale} />
        ))}
      </Instances>
    </group>
  );
};

export default StarsContainer;
