'use client';

import { useProductStore } from '@/stores/productStore';
import { COLOR_OPTIONS } from '@/lib/constants';
import type { CameraPreset, MaterialPreset } from '@/types/showcase';

const CAMERA_LABELS: Record<CameraPreset, string> = {
  front: '正面',
  side: '侧面',
  top: '俯视',
  orbit: '环绕',
};

const MATERIAL_LABELS: Record<MaterialPreset, string> = {
  standard: '标准',
  metallic: '金属',
  matte: '哑光',
};

export function ProductUI() {
  const colorId = useProductStore((s) => s.colorId);
  const setColorId = useProductStore((s) => s.setColorId);
  const material = useProductStore((s) => s.material);
  const setMaterial = useProductStore((s) => s.setMaterial);
  const cameraPreset = useProductStore((s) => s.cameraPreset);
  const setCameraPreset = useProductStore((s) => s.setCameraPreset);
  const bloomIntensity = useProductStore((s) => s.bloomIntensity);
  const setBloomIntensity = useProductStore((s) => s.setBloomIntensity);
  const vignetteOffset = useProductStore((s) => s.vignetteOffset);
  const setVignetteOffset = useProductStore((s) => s.setVignetteOffset);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
      <div className="pointer-events-auto max-w-6xl mx-auto px-4 pb-6 pt-4">
        <div className="bg-black/70 backdrop-blur-md rounded-2xl border border-white/10 p-4 space-y-4 shadow-xl">
          {/* 颜色 */}
          <div>
            <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">颜色</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorId(c.id)}
                  className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: c.value,
                    borderColor: colorId === c.id ? '#fff' : 'transparent',
                    boxShadow: colorId === c.id ? `0 0 0 2px ${c.value}` : undefined,
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* 材质 */}
          <div>
            <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">材质</p>
            <div className="flex gap-2">
              {(Object.keys(MATERIAL_LABELS) as MaterialPreset[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMaterial(m)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    material === m
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {MATERIAL_LABELS[m]}
                </button>
              ))}
            </div>
          </div>

          {/* 相机 */}
          <div>
            <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">视角</p>
            <div className="flex gap-2">
              {(Object.keys(CAMERA_LABELS) as CameraPreset[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setCameraPreset(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    cameraPreset === p
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {CAMERA_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* 后期：Bloom / 暗角 */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
            <div>
              <p className="text-xs font-medium text-white/60 mb-1">Bloom</p>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={bloomIntensity}
                onChange={(e) => setBloomIntensity(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-white/20 accent-white"
              />
            </div>
            <div>
              <p className="text-xs font-medium text-white/60 mb-1">暗角</p>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={vignetteOffset}
                onChange={(e) => setVignetteOffset(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-white/20 accent-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
