'use client';

import { isMobile as isMobileDevice } from 'react-device-detect';
import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;

const subscribe = (callback: () => void) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

// Viewport width first, device sniffing as a fallback (covers e.g. a phone
// reporting an unusual viewport). Reactive to resize, unlike a one-shot
// device check, so narrowing/widening the window actually adapts the layout.
const getSnapshot = () => window.innerWidth < MOBILE_BREAKPOINT || isMobileDevice;
const getServerSnapshot = () => isMobileDevice;

export const useIsMobile = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
