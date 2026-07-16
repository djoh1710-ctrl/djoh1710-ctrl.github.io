import { useThemeStore } from "@/app/stores";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getGlowColor, getGlowTexture } from "./glowTexture";

const SYMBOLS = ['{ }', '</>', '=>', ';', '( )', '[ ]'];
const SYMBOL_COUNT = 40;

// Fill colors keep their two-tone variety in both themes — these are the
// solid shape/text colors, not the glow.
const BLUE = '#7C9EFF';
const AMBER = '#F2A65A';

// Deterministic pseudo-random (sine-hash) so values are stable across
// re-renders without calling Math.random during render.
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const CloudContainer = () => {
  const groupRef = useRef<THREE.Group>(null);
  const isDarkTheme = useThemeStore((state) => state.theme.type === 'dark');
  const glowTexture = useMemo(() => getGlowTexture(), []);
  const glowColor = getGlowColor(isDarkTheme);

  const symbols = useMemo(() => (
    Array.from({ length: SYMBOL_COUNT }, (_, i) => {
      // Biased (sqrt) toward larger values, so more symbols land toward
      // the bottom of the range — reads as a tunnel floor/walls receding
      // into the distance instead of an even scatter.
      const yBias = Math.sqrt(seededRandom(i * 78.233 + 2));
      const position: [number, number, number] = [
        -16 + seededRandom(i * 12.9898 + 1) * 32,
        4 - yBias * 34,
        -12 + seededRandom(i * 37.719 + 3) * 32,
      ];
      return {
        position,
        text: SYMBOLS[i % SYMBOLS.length],
        fontSize: 2.5 + seededRandom(i * 45.164 + 4) * 2.5,
        color: i % 2 === 0 ? BLUE : AMBER,
        phase: seededRandom(i * 91.345 + 5) * Math.PI * 2,
        spinSpeed: 0.15 + seededRandom(i * 71.883 + 6) * 0.25,
      };
    })
  ), []);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const symbol = symbols[i];
      const t = clock.elapsedTime * 0.3 + symbol.phase;
      child.position.y = symbol.position[1] + Math.sin(t) * 0.6;
      child.rotation.y += delta * symbol.spinSpeed;
      child.rotation.z = Math.sin(t * 0.5) * 0.05;
    });
  });

  return (
    <group position={[0, -5, 0]} ref={groupRef}>
      {symbols.map((symbol, i) => (
        <group key={i} position={symbol.position}>
          {/* Manual additive glow — identical in both themes */}
          <mesh scale={symbol.fontSize * 2.4}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={glowTexture}
              color={glowColor}
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              fog={false} />
          </mesh>
          {/* Real 3D shape behind the glyph, not just flat text */}
          <mesh>
            <octahedronGeometry args={[symbol.fontSize * 0.55, 0]} />
            <meshBasicMaterial color={symbol.color} wireframe transparent opacity={0.85} />
          </mesh>
          <Text
            fontSize={symbol.fontSize}
            color={symbol.color}
            fillOpacity={0.95}
            font="./soria-font.ttf"
            anchorX="center"
            anchorY="middle">
            {symbol.text}
          </Text>
        </group>
      ))}
    </group>
  );
};

export default CloudContainer;
