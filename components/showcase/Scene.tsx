'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { ProductModel } from './ProductModel';
import { CameraRig } from './CameraRig';
import { Effects } from './Effects';
import { CAMERA_PRESETS } from '@/lib/constants';

const initialPos = CAMERA_PRESETS.front.position;

export function ShowcaseScene() {
  return (
    <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
      <Canvas
        camera={{
          position: initialPos,
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0a0a']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <pointLight position={[-4, 4, -2]} intensity={0.5} />
        <Suspense fallback={null}>
          <ProductModel />
          <Environment preset="studio" />
        </Suspense>
        <CameraRig />
        <Effects />
      </Canvas>
    </div>
  );
}
