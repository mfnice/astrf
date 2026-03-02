'use client';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useProductStore } from '@/stores/productStore';

export function Effects() {
  const bloomIntensity = useProductStore((s) => s.bloomIntensity);
  const vignetteOffset = useProductStore((s) => s.vignetteOffset);

  return (
    <EffectComposer multisampling={0} enabled>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.025}
        mipmapBlur
      />
      <Vignette
        offset={vignetteOffset}
        darkness={0.6}
        eskil={false}
      />
    </EffectComposer>
  );
}
