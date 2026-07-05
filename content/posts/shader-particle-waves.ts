import type { Post } from "./types";

const post: Post = {
  slug: "shader-particle-waves",
  date: "2026-04-02",
  tags: ["Three.js", "GLSL", "Graphics"],
  readingTime: 9,
  cover: "/covers/shader-particle-waves.jpg",
  en: {
    title: "A field of 22,000 particles: notes on the hero shader",
    excerpt:
      "The homepage background is not a video and not a texture — it is twenty-two thousand points displaced by simplex noise in a vertex shader, running at a fraction of the cost of a spinning glTF model.",
    body: `The homepage background is not a video and not a texture — it is twenty-two thousand points displaced by simplex noise in a vertex shader, running at a fraction of the cost of a spinning glTF model.

## Why particles beat models here

My first version loaded a glTF product model and rotated it on scroll. It looked like every template. Worse, it cost megabytes over the wire and was hostage to the quality of the asset. A procedural particle field solves all three problems: it weighs a few kilobytes of code, it is abstract enough to never look dated, and every parameter — density, amplitude, color — is one uniform away.

## The recipe

The construction is three steps:

1. **A static grid.** Generate a flat plane of points once, on the CPU, into a \`BufferGeometry\`. Nothing about the grid ever changes again.
2. **Displacement in the vertex shader.** Two octaves of Ashima simplex noise, sampled with world position and time, push each point up or down. The GPU does this for every point, every frame, for free — vertex shaders are massively parallel.
3. **Soft round sprites in the fragment shader.** \`gl_PointCoord\` gives you the position inside each point sprite; a smoothstep on the distance from center turns squares into glowing dots. Additive blending makes overlaps bloom.

The elevation value is passed to the fragment stage as a varying, so wave crests can be tinted with the site's accent color while the valleys stay near the background — the scene reads as topography rather than confetti.

## The details that sell it

- **Distance fade.** Points fade with camera distance, which acts as free atmospheric fog and hides the hard edge of the grid.
- **Pointer parallax with lerp.** The group rotates a few degrees toward the cursor, eased with \`lerp(current, target, 0.04)\`. Immediate tracking feels mechanical; lag feels alive.
- **Clamped DPR.** Rendering at \`min(devicePixelRatio, 1.8)\` is indistinguishable on a 4K display and saves a third of the fragment work.

## What I would not do

Do not animate the geometry on the CPU. Updating a typed array of 22,000 positions per frame in JavaScript and re-uploading it is the classic mistake — it works in a demo and melts in production. The entire motion here lives in the shader; JavaScript only advances one \`uTime\` float per frame.`,
  },
  zh: {
    title: "两万两千个粒子的波场：首页 Shader 笔记",
    excerpt:
      "首页背景不是视频也不是贴图 —— 而是两万两千个点，在顶点着色器里被 simplex 噪声驱动起伏，成本却远低于一个旋转的 glTF 模型。",
    body: `首页背景不是视频也不是贴图 —— 而是两万两千个点，在顶点着色器里被 simplex 噪声驱动起伏，成本却远低于一个旋转的 glTF 模型。

## 为什么粒子比模型更合适

第一版首页加载了一个 glTF 产品模型并随滚动旋转。它看起来和所有模板一样。更糟的是，它要传输好几 MB，效果还完全被素材质量绑架。程序化粒子场同时解决了这三个问题：它只有几 KB 的代码，足够抽象所以永远不会过时，而且每个参数 —— 密度、振幅、颜色 —— 都只是一个 uniform。

## 配方

整个构建只有三步：

1. **一张静态网格。** 在 CPU 上一次性生成平面点阵，写入 \`BufferGeometry\`，之后网格本身永不改变。
2. **顶点着色器里做位移。** 用世界坐标和时间采样两个八度的 Ashima simplex 噪声，把每个点向上或向下推。GPU 每帧对每个点并行执行 —— 顶点着色器天生就是大规模并行的。
3. **片元着色器里画软圆点。** \`gl_PointCoord\` 给出点精灵内部坐标，对中心距离做一次 smoothstep，方块就变成了发光的圆点。加法混合让重叠处自然泛光。

高度值通过 varying 传到片元阶段，于是波峰可以染上网站的强调色，波谷则接近背景色 —— 整个场景读起来像地形，而不是彩纸屑。

## 决定质感的细节

- **距离淡出。** 粒子随相机距离渐隐，等于免费的大气雾效，还顺便藏住了网格的硬边。
- **带缓动的指针视差。** 粒子组朝光标方向旋转几度，用 \`lerp(current, target, 0.04)\` 缓动。即时跟随显得机械，滞后半拍才有生命感。
- **限制 DPR。** 以 \`min(devicePixelRatio, 1.8)\` 渲染，在 4K 屏上肉眼无差，却省下三分之一的片元开销。

## 反面教材

不要在 CPU 上驱动几何体。每帧用 JavaScript 更新两万多个位置再重新上传，是最经典的错误 —— demo 里能跑，上线就化了。这里所有的运动都发生在 shader 里，JavaScript 每帧只更新一个 \`uTime\` 浮点数。`,
  },
};

export default post;
