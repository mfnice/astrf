import type { Post } from "./types";

const post: Post = {
  slug: "modular-personal-site",
  date: "2026-05-18",
  tags: ["Architecture", "Next.js", "Design"],
  readingTime: 7,
  cover: "/covers/modular-personal-site.jpg",
  en: {
    title: "Designing a personal site that grows like a city",
    excerpt:
      "Most personal sites are built like sculptures — finished once, admired briefly, abandoned quietly. I wanted mine to work like a city: districts with clear boundaries, shared infrastructure, and empty lots reserved for whatever comes next.",
    body: `Most personal sites are built like sculptures — finished once, admired briefly, abandoned quietly. I wanted mine to work like a city: districts with clear boundaries, shared infrastructure, and empty lots reserved for whatever comes next.

## Modules over pages

The mental model here is not "a blog with extra pages" but a set of independent modules docked to a shared shell:

- **Writing** — bilingual essays stored as structured content, rendered through one typographic system.
- **3D Lab** — a React Three Fiber playground with its own scene graph, camera rigs and state store.
- **AI Q&A** — a retrieval-augmented assistant backed by Qdrant, exposed through streaming API routes.

Each module owns its routes, components and state. The shell provides what every module needs and nothing more: the design tokens, the internationalization layer, the auth context, smooth scrolling, and the header/footer chrome.

## The contract between shell and module

A module can be added, rebuilt or deleted without touching its neighbours. That only stays true if the contract is boring:

1. A module gets a route segment under \`app/[locale]/\`.
2. It may read the shared auth and locale contexts, never write them.
3. It styles itself with the shared tokens — no private color palettes.
4. Anything server-side lives in its own API routes.

Boring contracts are what make interesting modules possible. The moment two modules share a store, you have one module with a hidden seam.

## Why bilingual from day one

Retrofitting internationalization is miserable — every hardcoded string is a small landmine. Building on \`next-intl\` from the start costs almost nothing: routes carry the locale, dictionaries carry the words, and the content layer stores both languages side by side. Switching languages is a route change, not a state mutation, so links are shareable and search engines see both versions.

## What the empty lots are for

The point of this architecture is the part that doesn't exist yet. A photography module, a reading-notes module, a tiny tools module — each is a folder and a dictionary namespace away. Cities stay alive because they leave room to build. Websites should too.`,
  },
  zh: {
    title: "把个人网站设计成一座会生长的城市",
    excerpt:
      "大多数个人网站像雕塑：完成一次、被欣赏片刻、然后悄悄荒废。我希望我的网站像一座城市：分区边界清晰、基础设施共享，并且永远给未来留着空地。",
    body: `大多数个人网站像雕塑：完成一次、被欣赏片刻、然后悄悄荒废。我希望我的网站像一座城市：分区边界清晰、基础设施共享，并且永远给未来留着空地。

## 用模块思维替代页面思维

这里的心智模型不是"一个带几个页面的博客"，而是一组停靠在公共外壳上的独立模块：

- **写作** —— 以结构化数据存储的双语文章，统一的排版系统渲染。
- **3D 实验室** —— 基于 React Three Fiber 的实验场，拥有自己的场景图、相机运镜和状态存储。
- **AI 问答** —— 由 Qdrant 支撑的检索增强助手，通过流式 API 路由对外暴露。

每个模块拥有自己的路由、组件和状态。外壳只提供所有模块都需要的东西：设计令牌、国际化层、登录上下文、平滑滚动，以及页头页脚。

## 外壳与模块之间的契约

模块可以被新增、重写或删除，而不影响邻居 —— 前提是契约足够"无聊"：

1. 每个模块占据 \`app/[locale]/\` 下的一个路由段。
2. 它可以读取共享的登录与语言上下文，但绝不写入。
3. 它只使用共享设计令牌来定义样式 —— 不允许私有配色。
4. 所有服务端逻辑放在自己的 API 路由里。

无聊的契约才能孕育有趣的模块。一旦两个模块共享了一个 store，你其实只有一个藏着裂缝的大模块。

## 为什么第一天就做双语

事后补国际化非常痛苦 —— 每一个硬编码的字符串都是一颗小地雷。而从一开始就基于 \`next-intl\` 构建几乎没有成本：路由携带语言、词典携带文案、内容层并排存储两种语言。切换语言是一次路由跳转而非状态变更，所以链接可以分享，搜索引擎也能同时索引两个版本。

## 空地是留给什么的

这个架构真正的意义在于尚不存在的部分。摄影模块、读书笔记模块、小工具模块 —— 每一个都只差一个文件夹和一个词典命名空间。城市因为留有余地而保持生命力，网站也应如此。`,
  },
};

export default post;
