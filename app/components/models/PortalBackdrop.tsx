import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface PortalBackdropProps {
  src: string;
}

// A large inverted sphere textured with a background image, so a portal's
// interior always has visible content regardless of exactly where the
// camera sits inside it — much cheaper than a modeled scene too.
const PortalBackdrop = ({ src }: PortalBackdropProps) => {
  const texture = useTexture(src);

  return (
    <mesh>
      <sphereGeometry args={[180, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

export default PortalBackdrop;
