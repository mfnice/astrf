'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: 'Next.js 14 App Router 深度解析',
    excerpt: '探索 Next.js 14 中全新的 App Router 架构，了解它如何改变我们构建 React 应用的方式。从路由系统到数据获取，从服务器组件到客户端组件，我们将深入探讨这些新特性。',
    date: '2024-03-15',
    category: '前端框架',
    readTime: '8 分钟',
    tags: ['Next.js', 'React', 'App Router'],
  },
  {
    id: 2,
    title: 'Three.js 与 React Three Fiber 实战指南',
    excerpt: '学习如何在 React 应用中集成 Three.js，使用 React Three Fiber 创建交互式 3D 场景。我们将从基础概念开始，逐步构建复杂的 3D 应用，包括模型加载、光照设置和动画控制。',
    date: '2024-03-10',
    category: '3D 图形',
    readTime: '12 分钟',
    tags: ['Three.js', 'React Three Fiber', '3D'],
  },
  {
    id: 3,
    title: 'Framer Motion 动画库完全指南',
    excerpt: '掌握 Framer Motion 这个强大的 React 动画库。从简单的淡入淡出效果到复杂的页面过渡，从手势控制到布局动画，我们将通过实际案例学习如何创建流畅自然的用户界面动画。',
    date: '2024-03-05',
    category: '动画设计',
    readTime: '10 分钟',
    tags: ['Framer Motion', '动画', 'UX'],
  },
  {
    id: 4,
    title: 'TypeScript 在大型项目中的最佳实践',
    excerpt: '分享在大型前端项目中使用 TypeScript 的经验和最佳实践。包括类型设计、泛型使用、工具类型、以及如何平衡类型安全性和开发效率。',
    date: '2024-02-28',
    category: '编程语言',
    readTime: '15 分钟',
    tags: ['TypeScript', '最佳实践', '类型系统'],
  },
  {
    id: 5,
    title: 'Tailwind CSS 高级技巧与自定义',
    excerpt: '深入探索 Tailwind CSS 的高级功能，包括自定义主题、插件开发、JIT 模式优化，以及如何构建可复用的组件系统。',
    date: '2024-02-20',
    category: 'CSS 框架',
    readTime: '9 分钟',
    tags: ['Tailwind CSS', '样式系统', '设计系统'],
  },
  {
    id: 6,
    title: '现代前端性能优化策略',
    excerpt: '从代码分割到懒加载，从图片优化到缓存策略，全面介绍现代前端应用的性能优化方法。包括实际案例和性能指标分析。',
    date: '2024-02-15',
    category: '性能优化',
    readTime: '11 分钟',
    tags: ['性能优化', 'Web Vitals', '最佳实践'],
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            技术博客
          </h1>
          <p className="text-xl text-gray-400">
            分享前端开发、3D 图形、动画设计等领域的知识与经验
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="mb-4">
                <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500 ml-3">
                  {post.date} · {post.readTime}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold mb-3 text-white hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-400 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <Link
                href={`/blog/${post.id}`}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm inline-flex items-center gap-2 group"
              >
                阅读更多
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}

