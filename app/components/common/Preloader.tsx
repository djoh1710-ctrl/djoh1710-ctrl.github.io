'use client'

import { useTexture } from '@react-three/drei'
import { useEffect, useState } from 'react'
import WindowModel from '../models/WindowModel'

// List of models to preload.
const MODELS = [WindowModel];

// Portal background images — preloaded so the first click into either
// portal doesn't hitch while the texture loads mid-transition.
useTexture.preload('/backgrounds/work-bg.jpg');
useTexture.preload('/backgrounds/projects-bg.jpg');

const Preloader = () => {
  const [visible, setVisible] = useState(true);

  // Hacky way to preload the models by setting them on to the scene and
  // removing them after a timeout as the base canvas is shown after a delay.
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 0);
  }, []);

  return (<>
    {MODELS.map((Component, index) => (
      <Component key={index} visible={visible}/>
    ))}
  </>)
}

export default Preloader;
