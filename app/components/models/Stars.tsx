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

// A 2-cell "0" / "1" sprite atlas, generated once on the client. Using
// real glyphs (instead of abstract bar/ring shapes) so the field actually
// reads as binary code, while still batching into just two instanced draw
// calls total regardless of digit count.
const useGlyphTexture = () => useMemo(() => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 128, 64);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 44px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('0', 32, 34);
    ctx.fillText('1', 96, 34);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}, []);

// Remaps a unit plane's UVs onto one half of the 2-cell atlas.
const useGlyphGeometry = (uOffset: number) => useMemo(() => {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setX(i, uOffset + uv.getX(i) * 0.5);
  }
  uv.needsUpdate = true;
  return geometry;
}, [uOffset]);

const StarsContainer = () => {
  const groupRef = useRef<THREE.Group>(null);
  const isDarkTheme = useThemeStore((state) => state.theme.type === 'dark');
  const color = isDarkTheme ? '#7C9EFF' : '#3D4F99';

  const texture = useGlyphTexture();
  const zeroGeometry = useGlyphGeometry(0);
  const oneGeometry = useGlyphGeometry(0.5);

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
        scale: 1.4 + seededRandom(index * 63.982 + 6) * 2,
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
      <Instances geometry={oneGeometry} limit={Math.max(ones.length, 1)} range={ones.length}>
        <meshBasicMaterial map={texture} color={color} transparent alphaTest={0.1} depthWrite={false} />
        {ones.map((digit, i) => (
          <Instance key={i} position={digit.position} rotation={digit.rotation} scale={digit.scale} />
        ))}
      </Instances>
      <Instances geometry={zeroGeometry} limit={Math.max(zeros.length, 1)} range={zeros.length}>
        <meshBasicMaterial map={texture} color={color} transparent alphaTest={0.1} depthWrite={false} />
        {zeros.map((digit, i) => (
          <Instance key={i} position={digit.position} rotation={digit.rotation} scale={digit.scale} />
        ))}
      </Instances>
    </group>
  );
};

export default StarsContainer;
