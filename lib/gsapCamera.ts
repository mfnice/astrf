'use client';

import gsap from 'gsap';
import type { Vector3 } from 'three';
import type { CameraPreset } from '@/types/showcase';
import { CAMERA_PRESETS } from './constants';

const DURATION = 1.2;
const EASE = 'power3.inOut';

/** 可被 GSAP 动画的对象（Vector3 或 { x, y, z }） */
type Vector3Like = Vector3 | { x: number; y: number; z: number };

/**
 * 用 GSAP 将相机从当前位移动画到预设
 * position / target 为 Three.js Vector3 或带 x,y,z 的对象
 */
export function animateCameraToPreset(
  position: Vector3Like,
  target: Vector3Like,
  preset: CameraPreset,
  onComplete?: () => void
) {
  const to = CAMERA_PRESETS[preset];
  gsap.to(position, {
    x: to.position[0],
    y: to.position[1],
    z: to.position[2],
    duration: DURATION,
    ease: EASE,
  });
  gsap.to(target, {
    x: to.lookAt[0],
    y: to.lookAt[1],
    z: to.lookAt[2],
    duration: DURATION,
    ease: EASE,
    onComplete,
  });
}

/** 在 useFrame 里用时间驱动 orbit 的 position */
export function updateOrbitPosition(
  position: Vector3,
  radius: number,
  height: number,
  time: number
) {
  position.x = Math.cos(time) * radius;
  position.z = Math.sin(time) * radius;
  position.y = height;
}
