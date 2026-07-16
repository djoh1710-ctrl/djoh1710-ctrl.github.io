import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: 'HONORS',
    title: 'National Honor Society',
    subtitle: '4.1 GPA • Honors Student',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: 'ATHLETICS',
    title: 'Varsity Multi-Sport Athlete',
    subtitle: 'Basketball • Gymnastics • Cheer • Track & Field',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-3, -1, -6),
    year: 'WORK',
    title: 'Family Sports Business',
    subtitle: 'Athlete Development Assistant',
    position: 'left',
  },
  {
    point: new THREE.Vector3(0, -1, -10),
    year: 'VOLUNTEER',
    title: 'Tutor & Community Service',
    subtitle: 'Academic tutoring • Community labor projects',
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