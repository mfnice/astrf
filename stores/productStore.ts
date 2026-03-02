'use client';

import { create } from 'zustand';
import type { CameraPreset, MaterialPreset, ProductState } from '@/types/showcase';

/** 产品展示全局状态 */
interface ProductStore extends ProductState {
  setColorId: (id: string) => void;
  setMaterial: (m: MaterialPreset) => void;
  setCameraPreset: (p: CameraPreset) => void;
  setBloomIntensity: (v: number) => void;
  setVignetteOffset: (v: number) => void;
}

const initialState: ProductState = {
  colorId: 'slate',
  material: 'standard',
  cameraPreset: 'front',
  bloomIntensity: 0.4,
  vignetteOffset: 0.4,
};

export const useProductStore = create<ProductStore>((set) => ({
  ...initialState,
  setColorId: (colorId) => set({ colorId }),
  setMaterial: (material) => set({ material }),
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),
  setBloomIntensity: (bloomIntensity) => set({ bloomIntensity }),
  setVignetteOffset: (vignetteOffset) => set({ vignetteOffset }),
}));
