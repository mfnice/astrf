'use client';

import ModelScene from '@/components/ModelScene';
import { motion } from 'framer-motion';

export default function Home() {

  const sections = [
    {
      title: '欢迎来到 ASTRF',
      subtitle: '一个融合了现代前端技术的个人展示项目',
      content: '这个项目展示了 Next.js、Three.js、React Three Fiber 和 Framer Motion 的强大组合。',
    },
    {
      title: 'Three.js 3D 体验',
      subtitle: '实时交互的 3D 模型',
      content: '通过滚动页面，你可以看到 3D 模型实时响应你的操作，旋转、缩放，带来沉浸式的视觉体验。',
    },
    {
      title: '现代前端技术栈',
      subtitle: 'Next.js 14 + TypeScript + Tailwind CSS',
      content: '采用最新的 Next.js App Router，TypeScript 提供类型安全，Tailwind CSS 实现快速样式开发。',
    },
    {
      title: '流畅的动画效果',
      subtitle: 'Framer Motion 驱动的动画',
      content: '所有交互都经过精心设计，使用 Framer Motion 实现流畅自然的动画过渡效果。',
    },
  ];

  return (
    <main className="relative">
      <ModelScene />
      
      <div className="relative z-10 pt-24">
        {sections.map((section, index) => (
          <motion.section
            key={index}
            className="min-h-screen flex items-center justify-center px-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {section.title}
              </motion.h1>
              <motion.h2
                className="text-2xl md:text-3xl text-gray-400 mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {section.subtitle}
              </motion.h2>
              <motion.p
                className="text-lg md:text-xl text-gray-300 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {section.content}
              </motion.p>
            </div>
          </motion.section>
        ))}
      </div>
    </main>
  );
}

