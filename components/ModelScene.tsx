'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// 模型 URL - 可以替换为你自己的模型链接
// 推荐资源：
// 1. Khronos Group: https://github.com/KhronosGroup/glTF-Sample-Models
// 2. Sketchfab: https://sketchfab.com/ (搜索免费模型)
// 3. Poly Haven: https://polyhaven.com/models
// 4. Three.js 示例: https://threejs.org/examples/models/
const MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb';

// 3D 模型组件
function Model() {
  const meshRef = useRef<THREE.Group>(null);
  const scrollY = useRef(0);

  // 使用 useGLTF 加载模型，如果失败会自动抛出错误
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      // 根据滚动位置旋转模型
      meshRef.current.rotation.y = scrollY.current * 0.01;
      meshRef.current.rotation.x = Math.sin(scrollY.current * 0.005) * 0.3;
      // 根据滚动位置缩放
      const scale = 1 + Math.sin(scrollY.current * 0.01) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={meshRef}  position={[0, -1, 0]}
    scale={[2, 2, 2]}>  <primitive 
 
    object={scene} 
   
  /></group>
  
  );
}

// 加载器组件
function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      <Suspense fallback={null}>
        <Model />
        <Environment preset="sunset" />
      </Suspense>
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// 主场景组件
export default function ModelScene() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}

