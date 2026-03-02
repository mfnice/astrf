'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useProductStore } from '@/stores/productStore';
import { COLOR_OPTIONS } from '@/lib/constants';
import type { MaterialPreset } from '@/types/showcase';

/** 模型路径：将你的 .glb 文件放在 public/models/ 下即可，例如 public/models/product.glb */
const MODEL_URL = '/models/911-transformed.glb';

/** 根据 preset 创建材质参数（R3F 接受 color/emissive 为 hex 字符串或 number） */
function getMaterialProps(
  preset: MaterialPreset,
  colorHex: string,
  emissiveHex?: string
): { metalness: number; roughness: number; color: string; emissive: string; emissiveIntensity: number } {
  const emissive = emissiveHex ?? '#000000';
  switch (preset) {
    case 'metallic':
      return { metalness: 0.9, roughness: 0.15, color: colorHex, emissive, emissiveIntensity: 0.08 };
    case 'matte':
      return { metalness: 0.05, roughness: 0.85, color: colorHex, emissive: '#000000', emissiveIntensity: 0 };
    default:
      return { metalness: 0.35, roughness: 0.4, color: colorHex, emissive, emissiveIntensity: 0.05 };
  }
}

export function ProductModel() {
  const groupRef = useRef<THREE.Group>(null);
  const colorId = useProductStore((s) => s.colorId);
  const material = useProductStore((s) => s.material);

  const { scene } = useGLTF(MODEL_URL);

  const colorOption = useMemo(() => COLOR_OPTIONS.find((c) => c.id === colorId) ?? COLOR_OPTIONS[0], [colorId]);

  const matProps = useMemo(
    () => getMaterialProps(material, colorOption.value, colorOption.emissive),
    [material, colorOption.value, colorOption.emissive]
  );

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.material) {
        const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.color.set(matProps.color);
          mat.emissive.set(matProps.emissive);
          mat.emissiveIntensity = matProps.emissiveIntensity;
          mat.metalness = matProps.metalness;
          mat.roughness = matProps.roughness;
          mat.toneMapped = false;
        }
      }
    });
  }, [clonedScene, matProps]);

  // 微旋转，增强展示感
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.2}>
      <primitive object={clonedScene} />
    </group>
  );
}
