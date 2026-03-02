# 3D 产品展示页 - 代码架构说明

作品集级 3D 产品展示模板：React + R3F + Drei + GSAP + Postprocessing + Zustand。

## 技术栈

| 技术 | 用途 |
|------|------|
| **React Three Fiber (R3F)** | 声明式 Three.js 场景 |
| **Drei** | RoundedBox、Environment 等组件 |
| **GSAP** | 相机位移动画（正面/侧面/俯视切换） |
| **@react-three/postprocessing** | Bloom、Vignette 等后期 |
| **Zustand** | 全局状态：颜色、材质、相机预设、后期参数 |

## 目录结构

```
├── app/showcase/page.tsx       # 展示页入口
├── components/showcase/
│   ├── Scene.tsx               # Canvas + 灯光 + 环境 + 子组件
│   ├── ProductModel.tsx        # 产品几何 + 材质/颜色绑定 store
│   ├── CameraRig.tsx          # 相机控制：GSAP 动画 + orbit 用 useFrame
│   ├── Effects.tsx            # EffectComposer + Bloom + Vignette
│   ├── ProductUI.tsx          # 颜色/材质/视角/后期滑块 UI
│   └── index.ts
├── stores/productStore.ts     # Zustand：colorId, material, cameraPreset, bloom, vignette
├── lib/
│   ├── constants.ts           # COLOR_OPTIONS, CAMERA_PRESETS
│   └── gsapCamera.ts          # animateCameraToPreset, updateOrbitPosition
└── types/showcase.ts          # CameraPreset, MaterialPreset, ColorOption, ProductState
```

## 功能要点

- **材质/颜色切换**：`ProductModel` 从 store 读 `colorId`、`material`，用 `meshStandardMaterial` 的 metalness/roughness/emissive 区分标准/金属/哑光。
- **相机动画**：切换视角时 `CameraRig` 调用 `animateCameraToPreset`（GSAP）；「环绕」由 `useFrame` 中 `updateOrbitPosition` 驱动。
- **后期效果**：`Effects` 使用 `EffectComposer` + `Bloom` + `Vignette`，强度由 store 的滑块控制。
- **工程化**：类型集中在 `types/showcase.ts`，常量在 `lib/constants.ts`，相机逻辑在 `lib/gsapCamera.ts`，便于扩展新颜色、新视角或新效果。

## 如何扩展

1. **换模型**：在 `ProductModel` 中改用 `useGLTF` 加载 glb，遍历 `scene` 给 mesh 应用当前 store 的材质/颜色。
2. **新相机预设**：在 `lib/constants.ts` 的 `CAMERA_PRESETS` 增加一项，在 `types/showcase.ts` 的 `CameraPreset` 加上对应类型。
3. **新后期**：在 `Effects.tsx` 中增加 `ChromaticAberration` 等，并在 store 中增加对应 state 与 UI。

## 本地运行

```bash
npm run dev
# 打开 http://localhost:3000/showcase
```

导航栏已增加「3D 展示」入口。
