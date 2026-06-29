import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-gray-400 mb-8">抱歉，找不到你访问的页面。</p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </main>
  );
}
