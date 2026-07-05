# ASTRF

集 Three.js、RAG 问答与中英双语写作于一体的个人网站 —— 模块化设计，方便持续加装新能力。

## 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | Next.js 14 (App Router) + TypeScript |
| 国际化 | next-intl（`/zh` `/en` 路由级双语） |
| 视觉 | Tailwind CSS + 设计令牌（墨黑 + 酸性荧光绿 `#C8F051`） |
| 动效 | Framer Motion + Lenis 平滑滚动 + GSAP（3D 实验室运镜） |
| 3D | Three.js / React Three Fiber，首页为自写 GLSL 粒子波场 |
| 登录 | Supabase 邮箱魔法链接（无密码） |
| 评论 | Supabase Postgres + RLS |
| RAG | Qdrant 向量库 + OpenRouter Embedding + Claude 流式回答 |

## 模块

- **首页** `/[locale]` —— shader 粒子 Hero、精选文章、模块网格
- **写作** `/[locale]/blog` —— 双语文章（`content/posts/`，每篇一个文件，Markdown 正文），文章页含评论区
- **3D 实验室** `/[locale]/showcase` —— R3F 产品展示（颜色/材质/相机/后期）
- **AI 问答** `/[locale]/ask` —— 知识库对话 + 文档入库
- **登录** `/[locale]/login` —— 邮箱魔法链接

新增模块 = `app/[locale]/<name>/` 一个路由段 + `messages/*.json` 一个命名空间，互不干扰。

## 本地开发

```bash
npm install --legacy-peer-deps
cp .env.example .env.local   # 按需填写
npm run dev
```

不配置任何环境变量也可以运行：登录/评论会显示配置提示，RAG 页面需要 Qdrant 与 OpenRouter 才能工作。

### 启用登录与评论（Supabase）

1. 在 [supabase.com](https://supabase.com) 创建免费项目
2. `Settings → API` 中复制 URL 和 anon key 填入 `.env.local`
3. 在 `SQL Editor` 中执行一次 `supabase/schema.sql`（建评论表 + RLS 策略）
4. `Authentication → URL Configuration` 中把站点地址加入 Redirect URLs

### 启用 RAG

1. 启动 Qdrant：`docker run -p 6333:6333 qdrant/qdrant`
2. 在 `.env.local` 填入 `OPENROUTER_API_KEY`

## 添加文章

在 `content/posts/` 新建一个文件（参考现有文章），提供 `en` / `zh` 两份标题、摘要与 Markdown 正文，然后在 `content/posts/index.ts` 中注册即可 —— 列表、详情、SSG 路径全部自动生成。

## 视觉素材

- **文章封面**：`public/covers/*.jpg`，由即梦（dreamina CLI）生成；替换同名文件或修改 `content/posts/` 中的 `cover` 字段即可。
- **首页滚动场景**：`public/scenes/autumn-{morning,dusk,night}.jpg` 三幕背景，随滚动交叉淡化；场景配置在 `lib/site.ts` 的 `SCROLL_SCENES`（图片缺失时自动回退渐变）。
- **首页 3D 模型**：`public/models/robot.glb` —— "RobotExpressive"（CC0，three.js 官方示例，仅 450KB，自带动画）。滚动路径在 `components/three/ScrollScene.tsx` 的 `WAYPOINTS`。
- **3D 实验室模型**：`public/models/shoe.glb` —— Khronos glTF 官方示例 "MaterialsVariantsShoe"（CC-BY 4.0, © Shopify）。`ProductModel.tsx` 会自动居中并归一化尺寸，换任何 glb 都即插即用。
- `public/draco/` 保留了本地化的 Draco 解码器，加载 Draco 压缩模型时用 `useGLTF(url, "/draco/")`。

## 构建生产版本

```bash
npm run build
npm start
```

## 许可证

MIT
