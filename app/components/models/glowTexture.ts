import * as THREE from "three";

let cached: THREE.Texture | null = null;

// A soft radial-gradient sprite, generated once and shared by every
// glowing element (CodeOrb, the binary field, cloud symbols). Manual,
// additive-blended "fake glow" instead of a post-processing bloom pass —
// cheaper, has no interaction with the portal camera system, and looks
// identical in both themes since it doesn't depend on a luminance
// threshold at all.
export const getGlowTexture = () => {
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.35)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }

  cached = new THREE.CanvasTexture(canvas);
  return cached;
};
