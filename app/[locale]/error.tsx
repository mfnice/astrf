"use client";

import { useEffect } from "react";

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
        <p className="eyebrow justify-center flex mb-6">Error</p>
        <h1 className="display text-4xl mb-4">Something broke</h1>
        <p className="text-muted mb-8 text-sm leading-relaxed">
          页面渲染时发生错误，请稍后重试。/ The page failed to render — please
          try again.
        </p>
        <button
          onClick={reset}
          className="px-7 py-3 rounded-full bg-accent text-black text-sm font-medium hover:opacity-85 transition-opacity"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
