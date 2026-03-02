'use client';

import { ShowcaseScene, ProductUI } from '@/components/showcase';

export default function ShowcasePage() {
  return (
    <>
      <ShowcaseScene />
      <ProductUI />
      <div className="fixed top-24 left-0 right-0 z-10 text-center pointer-events-none">
        <h1 className="text-2xl md:text-3xl font-semibold text-white/90 drop-shadow-lg">
          3D 产品展示
        </h1>
        <p className="text-sm text-white/60 mt-1">切换颜色、材质与视角 · 调节后期效果</p>
      </div>
    </>
  );
}
