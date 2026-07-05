'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useProductStore } from '@/stores/productStore';
import { COLOR_OPTIONS } from '@/lib/constants';
import type { MaterialPreset } from '@/types/showcase';

/** 模型路径：将你的 .glb 文件放在 public/models/ 下即可，例如 public/models/product.glb */
const MODEL_URL = '/models/shoe.glb';

/** 模型归一化后的目标尺寸（最长边，世界单位），换任何模型都无需调相机 */
const TARGET_SIZE = 2.0;

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

  // 克隆并归一化：居中 + 缩放到 TARGET_SIZE，任意模型即插即用
  const { clonedScene, normalizedScale } = useMemo(() => {
    const clone = scene.clone();
    // 初始朝向：侧面对镜头（鞋类展示的标准角度）
    clone.rotation.y = -Math.PI / 2;
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return { clonedScene: clone, normalizedScale: TARGET_SIZE / maxDim };
  }, [scene]);

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

  // 待机自转 + 滚动驱动：滚动进度映射为大回转/俯仰/下沉，往上滑模型会实时响应
  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;

    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    const t = state.clock.elapsedTime;

    const targetRotY = t * 0.15 + p * Math.PI * 2.5;
    const targetRotX = Math.sin(p * Math.PI) * 0.35;
    const targetPosY = 0.45 - p * 0.55 + Math.sin(t * 0.8) * 0.05;

    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRotY, 0.08);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetRotX, 0.08);
    g.position.y = THREE.MathUtils.lerp(g.position.y, targetPosY, 0.08);
  });

  return (
    <group ref={groupRef} position={[0, 0.45, 0]} scale={normalizedScale}>
      <primitive object={clonedScene} />
    </group>
  );
}
