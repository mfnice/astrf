/** 3D 产品展示页 - 共享类型 */

export type CameraPreset = 'front' | 'side' | 'top' | 'orbit';

export type MaterialPreset = 'standard' | 'metallic' | 'matte';

export interface ColorOption {
  id: string;
  name: string;
  value: string; // hex
  emissive?: string; // 可选发光色
}

export interface ProductState {
  /** 当前选中的颜色 id */
  colorId: string;
  /** 当前材质预设 */
  material: MaterialPreset;
  /** 相机预设（驱动 GSAP 动画） */
  cameraPreset: CameraPreset;
  /** 后期：Bloom 强度 0-1 */
  bloomIntensity: number;
  /** 后期：暗角强度 0-1 */
  vignetteOffset: number;
}
