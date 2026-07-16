'use client';

import { Text } from "@react-three/drei";

import { useProgress } from "@react-three/drei";
import { useThemeStore } from "@stores";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import CloudContainer from "../models/Cloud";
import { getGlowColor, getGlowTexture } from "../models/glowTexture";
import StarsContainer from "../models/Stars";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";

const Hero = () => {
  const titleRef = useRef<THREE.Mesh>(null);
  const { progress } = useProgress();
  const textColor = useThemeStore((state) => state.theme.text);
  const isDarkTheme = useThemeStore((state) => state.theme.type === 'dark');
  const isMobile = useIsMobile();
  const glowColor = getGlowColor(isDarkTheme);
  const glowTexture = useMemo(() => getGlowTexture(), []);

  useEffect(() => {
    if (progress === 100 && titleRef.current) {
      gsap.fromTo(titleRef.current.position, {
        y: -10,
        duration: 1,
        // delay: 1.5,
      }, {
        y: 0,
        duration: 3
      });
    }
  }, [progress]);

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: 1.2,
  };

  return (
    <>
      <Text position={[0, 2, -10]} color={textColor} {...fontProps} ref={titleRef}>Hi, I am Danica Johnson.</Text>
      {/* Manual glow behind the title, same theme-aware color used everywhere else */}
      <mesh position={[0, 2, -10.1]} scale={isMobile ? 4 : 7}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTexture}
          color={glowColor}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false} />
      </mesh>
      <StarsContainer />
      <CloudContainer/>
      <group position={[0, -25, 5.69]}>
        <pointLight castShadow color="#B4C7FF" position={[1, 1, -2.5]} intensity={60} distance={10}/>
        {/* Manual glow standing in for the point light's glow, since real
            bloom was removed */}
        <mesh position={[1, 1, -2.5]} scale={2.5}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={glowTexture}
            color={glowColor}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false} />
        </mesh>
        <WindowModel receiveShadow/>
        <TextWindow/>
      </group>
    </>
  );
};

export default Hero;
