'use client';

import { Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useThemeStore } from "@stores";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getGlowColor, getGlowTexture } from "../models/glowTexture";

const TextWindow = () => {
  const data = useScroll();
  const windowRef = useRef<THREE.Group>(null);
  const textColor = useThemeStore((state) => state.theme.text);
  const isDarkTheme = useThemeStore((state) => state.theme.type === 'dark');
  const glowColor = getGlowColor(isDarkTheme);
  const glowTexture = useMemo(() => getGlowTexture(), []);

  useFrame(() => {
    const c = data.range(0.65, 0.15);

    if (windowRef.current) {
      windowRef.current.setRotationFromAxisAngle(new THREE.Vector3(0, -1, 0), 0.5 *Math.PI * c);
      windowRef.current.position.x =  -0.6 * c;
      windowRef.current.position.z = -0.6 * c;
    }
  });

  const fontProps = {
    font: "./soria-font.ttf",
  };

  return (
    <group position={[0, -0.3, 0]} ref={windowRef}>

      {/* Manual glow behind the tagline cluster */}
      <mesh position={[0, 0, -0.7]} scale={3.2}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTexture}
          color={glowColor}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false} />
      </mesh>

      <Text color={textColor} anchorX="left" anchorY="middle"
        fontSize={1.3}
        position={[0.12, 0, 0]}
        {...fontProps}
        scale={[1, -1, 1]}
        rotation={[0, 0,  -Math.PI / 2]}>
        UI DESIGNER
      </Text>

      <Text color={textColor} anchorX="right" anchorY="middle"
        {...fontProps}
        scale={[-1, -1, 1]}
        fontSize={1.3}
        position={[0.12, 0, -1.4]}
        rotation={[0, 0,  -Math.PI / 2]}>
        FRONTEND ENGINEER
      </Text>

      <group position={[-0.45, 0, -0.3]}>
        <Text color={textColor} anchorX="left" anchorY="middle"
          {...fontProps}
          scale={[1, -1, 1]}
          fontSize={0.8}
          rotation={[0, -Math.PI / 2,  -Math.PI / 2]}>
          BEGINNER. LEARNING.
        </Text>

        <Text color={textColor} anchorX="left" anchorY="middle"
          {...fontProps}
          scale={[1, -1, 1]}
          fontSize={0.8}
          position={[0, 0, -0.6]}
          rotation={[0, -Math.PI / 2,  -Math.PI / 2]}>
          ATHLETE. LEADER.
        </Text>
      </group>

      <group position={[0.45, 0, -0.3]}>
        <Text color={textColor} anchorX="right" anchorY="middle"
          {...fontProps}
          scale={[-1, -1, 1]}
          fontSize={0.8}
          rotation={[0, -Math.PI / 2,  -Math.PI / 2]}>
          CREATIVE. DRIVEN.
        </Text>
        <Text color={textColor} anchorX="right" anchorY="middle"
          {...fontProps}
          scale={[-1, -1, 1]}
          fontSize={0.8}
          position={[0, 0, -0.6]}
          rotation={[0, -Math.PI / 2,  -Math.PI / 2]}>
          HONOR STUDENT.
        </Text>
      </group>
    </group>
  );
}

export default TextWindow;