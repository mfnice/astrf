'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const blogContent: Record<number, { title: string; content: string[] }> = {
  1: {
    title: 'Next.js 14 App Router 深度解析',
    content: [
      'Next.js 14 引入了全新的 App Router，这是对传统 Pages Router 的重大升级。App Router 基于 React Server Components，提供了更强大的数据获取和渲染能力。',
      '在 App Router 中，路由是基于文件系统的，但规则更加灵活。你可以使用 `layout.tsx` 创建共享布局，使用 `loading.tsx` 定义加载状态，使用 `error.tsx` 处理错误。',
      'Server Components 是 App Router 的核心特性之一。它们默认在服务器端渲染，可以访问数据库、文件系统等服务器资源，而不会将代码发送到客户端。这大大减少了客户端 bundle 的大小。',
      '数据获取也变得简单。你可以在 Server Components 中直接使用 `async/await`，Next.js 会自动处理请求去重和缓存。',
      'Client Components 通过 `"use client"` 指令标记，用于需要交互性的组件。它们可以访问浏览器 API，使用 hooks，处理用户交互。',
    ],
  },
  2: {
    title: 'Three.js 与 React Three Fiber 实战指南',
    content: [
      'Three.js 是一个强大的 3D 图形库，但直接在 React 中使用 Three.js 需要手动管理生命周期和更新。React Three Fiber 解决了这个问题，它提供了声明式的 Three.js API。',
      '使用 React Three Fiber，你可以像写 React 组件一样创建 3D 场景。每个 Three.js 对象都对应一个 React 组件，状态管理和更新都自动处理。',
      '模型加载是 3D 应用的核心功能。React Three Fiber 配合 `@react-three/drei` 可以轻松加载 GLTF、FBX 等格式的模型。`useGLTF` hook 提供了简单的模型加载接口。',
      '光照设置对 3D 场景至关重要。你可以使用 `ambientLight`、`directionalLight`、`pointLight` 等组件创建各种光照效果。`Environment` 组件可以快速添加环境贴图。',
      '动画控制可以通过 `useFrame` hook 实现。这个 hook 在每一帧都会调用，你可以在其中更新对象的位置、旋转、缩放等属性，创建流畅的动画效果。',
    ],
  },
  3: {
    title: 'Framer Motion 动画库完全指南',
    content: [
      'Framer Motion 是 React 生态中最强大的动画库之一。它提供了声明式的 API，让创建复杂的动画变得简单直观。',
      '`motion` 组件是 Framer Motion 的基础。你可以将任何 HTML 元素或 React 组件转换为 `motion` 组件，然后添加动画属性。',
      '`initial`、`animate`、`exit` 属性定义了组件的动画状态。Framer Motion 会自动在这些状态之间进行插值，创建流畅的过渡效果。',
      '`whileHover`、`whileTap` 等属性可以响应交互事件。`layout` 属性可以实现布局动画，当元素位置改变时自动动画化。',
      '`variants` 可以定义复杂的动画状态，并在多个组件之间共享。这对于创建协调的动画序列非常有用。',
    ],
  },
};

export default function BlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const postId = Number(params.id);
  const post = blogContent[postId];

  if (!post) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400">文章未找到</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            返回博客列表
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {post.title}
          </h1>

          <div className="prose prose-invert max-w-none">
            {post.content.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-lg text-gray-300 leading-relaxed mb-6"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

