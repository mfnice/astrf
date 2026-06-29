'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#ededed',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', padding: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            应用发生严重错误
          </h1>
          <p style={{ color: '#999', marginBottom: 24 }}>
            请刷新页面或稍后重试。
          </p>
          <button
            onClick={reset}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              border: 'none',
              background: '#fff',
              color: '#000',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
