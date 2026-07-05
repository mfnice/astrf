"use client";

import { useEffect, useRef } from "react";
import { SCROLL_SCENES } from "@/lib/site";

/**
 * 首页场景背景层：随滚动进度在几幕风景之间交叉淡化。
 * 直接操作 DOM opacity（rAF 节流），避免每次滚动触发 React 渲染。
 */
export default function SceneBackdrop() {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;

      SCROLL_SCENES.forEach((scene, i) => {
        const el = layerRefs.current[i];
        if (!el) return;
        const [start, end] = scene.range;
        // 两端各用 0.08 的进度做淡入/淡出坡道
        const ramp = 0.08;
        const fadeIn =
          i === 0 ? 1 : Math.min(1, Math.max(0, (p - start) / ramp));
        const fadeOut =
          i === SCROLL_SCENES.length - 1
            ? 1
            : Math.min(1, Math.max(0, (end - p) / ramp));
        el.style.opacity = String(Math.min(fadeIn, fadeOut));
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      {SCROLL_SCENES.map((scene, i) => (
        <div
          key={scene.src}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          className="absolute inset-0 transition-opacity duration-300"
          style={{ opacity: i === 0 ? 1 : 0, background: scene.fallback }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={scene.src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.5) saturate(0.95)" }}
            onError={(e) => {
              // 图片缺失时隐藏，露出 fallback 渐变
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ))}

      {/* 压暗叠层：保证前景文字对比度，并向页面底色渐变 */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/40 to-bg/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-transparent to-bg" />
    </div>
  );
}
