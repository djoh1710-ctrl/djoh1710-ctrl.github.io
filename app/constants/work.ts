import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: 'DESIGN',
    title: 'Frontend Design & UI/UX',
    subtitle: 'Clean, user-first interfaces built with care',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: 'BRAND',
    title: 'Logo & Brand Design',
    subtitle: 'Custom logos and visual identity',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-3, -1, -6),
    year: 'ATHLETICS',
    title: 'Athlete Recruiting Portfolios',
    subtitle: 'Immersive recruiting portfolios for athletes',
    position: 'left',
  },
  {
    point: new THREE.Vector3(0, -1, -10),
    year: 'HONORS',
    title: 'Honors Student',
    subtitle: '4.1 GPA • National Honor Society',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1, 1, -12),
    year: new Date().toLocaleDateString('default', { year: 'numeric' }),
    title: 'Living...',
    subtitle: '↓ still learning',
    position: 'right',
  }
]