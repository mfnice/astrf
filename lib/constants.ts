/** 展示页常量：颜色选项、相机预设等 */

import type { ColorOption } from '@/types/showcase';

export const COLOR_OPTIONS: ColorOption[] = [
  { id: 'slate', name: '石板灰', value: '#64748b' },
  { id: 'emerald', name: '翡翠绿', value: '#059669', emissive: '#022c22' },
  { id: 'rose', name: '玫瑰金', value: '#be123c', emissive: '#4c0519' },
  { id: 'amber', name: '琥珀', value: '#d97706', emissive: '#451a03' },
  { id: 'cyan', name: '青蓝', value: '#0891b2', emissive: '#083344' },
  { id: 'violet', name: '紫罗兰', value: '#7c3aed', emissive: '#2e1065' },
];

/** 相机预设：位置 [x,y,z] 与朝向 */
export const CAMERA_PRESETS = {
  front: { position: [0, 0, 4] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number] },
  side:  { position: [3.2, 0, 2] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number] },
  top:   { position: [0, 3.5, 1.5] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number] },
  orbit: { position: [2.8, 1.2, 2.8] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number] },
} as const;
