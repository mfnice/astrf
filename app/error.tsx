'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 上报错误（生产环境可接入 Sentry 等监控）
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          出错了
        </h1>
        <p className="text-gray-400 mb-8">
          页面渲染时发生错误，请稍后重试。
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
        >
          重试
        </button>
      </div>
    </main>
  );
}
