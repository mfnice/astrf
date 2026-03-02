'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useProductStore } from '@/stores/productStore';
import { animateCameraToPreset, updateOrbitPosition } from '@/lib/gsapCamera';
import { CAMERA_PRESETS } from '@/lib/constants';

const ORBIT_RADIUS = 3.5;
const ORBIT_HEIGHT = 1.2;
const ORBIT_SPEED = 0.15;

export function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const prevPreset = useRef<string | null>(null);
  const orbitTime = useRef(0);
  const cameraPreset = useProductStore((s) => s.cameraPreset);

  useEffect(() => {
    const t = target.current;
    if (prevPreset.current === cameraPreset) return;
    prevPreset.current = cameraPreset;

    if (cameraPreset === 'orbit') {
      const o = CAMERA_PRESETS.orbit;
      camera.position.set(o.position[0], o.position[1], o.position[2]);
      t.set(0, 0, 0);
      orbitTime.current = 0;
    } else {
      animateCameraToPreset(camera.position, t, cameraPreset);
    }
  }, [cameraPreset, camera]);

  useFrame((_, delta) => {
    const pos = camera.position;
    const t = target.current;

    if (cameraPreset === 'orbit') {
      orbitTime.current += delta * ORBIT_SPEED;
      updateOrbitPosition(pos, ORBIT_RADIUS, ORBIT_HEIGHT, orbitTime.current);
    } else {
      // 非 orbit 时 GSAP 会驱动 position，这里只同步 target
      t.set(0, 0, 0);
    }
    camera.lookAt(t);
  });

  return null;
}
