"use client";

import dynamic from "next/dynamic";
/* eslint-disable @next/next/no-img-element -- SVG 封面无需 next/image 优化 */
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { posts } from "@/content/posts";
import { SHOWREEL_SRC, SHOWREEL_POSTER } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";
import SplitLines from "@/components/ui/SplitLines";
import SceneBackdrop from "@/components/home/SceneBackdrop";

const ScrollScene = dynamic(() => import("@/components/three/ScrollScene"), {
  ssr: false,
});

export default function Home() {
  const t = useTranslations();
  const locale = useLocale() as "en" | "zh";
  const featured = posts.slice(0, 3);

  const modules = [
    {
      title: t("home.module3dTitle"),
      desc: t("home.module3dDesc"),
      href: "/showcase",
      index: "01",
    },
    {
      title: t("home.moduleRagTitle"),
      desc: t("home.moduleRagDesc"),
      href: "/ask",
      index: "02",
    },
    {
      title: t("home.moduleBlogTitle"),
      desc: t("home.moduleBlogDesc"),
      href: "/blog",
      index: "03",
    },
  ] as const;

  return (
    <main className="relative">
      {/* 全页固定背景：随滚动变换的风景场景（在 3D 层之下） */}
      <SceneBackdrop />
      {/* 全页固定 3D 层：粒子波场 + 随滚动飞行的模型 */}
      <ScrollScene />

      <div className="relative z-10">
        {/* ---------- Hero ---------- */}
        <section className="relative min-h-screen flex flex-col justify-center">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full pt-24">
            <motion.p
              className="eyebrow mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {t("hero.eyebrow")}
            </motion.p>

            <h1 className="display text-[13vw] md:text-[7.5vw] max-w-[12em]">
              <SplitLines
                lines={[t("hero.titleLine1"), t("hero.titleLine2")]}
                delay={0.3}
              />
            </h1>

            <motion.p
              className="mt-8 max-w-xl text-muted text-base md:text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/blog"
                className="px-7 py-3 rounded-full bg-accent text-black text-sm font-medium hover:opacity-85 transition-opacity"
              >
                {t("hero.ctaBlog")}
              </Link>
              <Link
                href="/ask"
                className="px-7 py-3 rounded-full border border-line-strong text-sm hover:border-accent hover:text-accent transition-colors backdrop-blur-sm"
              >
                {t("hero.ctaAsk")}
              </Link>
            </motion.div>
          </div>

          {/* 滚动提示 */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
          >
            <span className="text-[0.65rem] tracking-[0.25em] uppercase font-display">
              {t("hero.scroll")}
            </span>
            <motion.span
              className="block w-px h-8 bg-gradient-to-b from-muted to-transparent"
              animate={{ scaleY: [1, 0.4, 1], originY: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
          </motion.div>
        </section>

        {/* ---------- 跑马灯 ---------- */}
        <section className="border-y border-line py-5 overflow-hidden bg-bg/40 backdrop-blur-sm">
          <div className="marquee-track font-display text-sm tracking-[0.2em] uppercase text-muted whitespace-nowrap">
            <span>{t("marquee").repeat(4)}</span>
            <span aria-hidden>{t("marquee").repeat(4)}</span>
          </div>
        </section>

        {/* ---------- 精选文章 ---------- */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-28">
          <Reveal>
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="eyebrow mb-4">{t("home.writingEyebrow")}</p>
                <h2 className="display text-4xl md:text-6xl">
                  {t("home.writingTitle")}
                </h2>
              </div>
              <Link
                href="/blog"
                className="link-line hidden md:block text-sm text-muted hover:text-fg transition-colors"
              >
                {t("home.writingAll")} →
              </Link>
            </div>
          </Reveal>

          <div className="mt-10">
            {featured.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.08}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid grid-cols-12 gap-4 md:gap-6 items-center py-7 border-t border-line hover:border-line-strong transition-colors"
                >
                  <span className="col-span-2 md:col-span-1 font-display text-sm text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {post.cover && (
                    <span className="hidden md:block col-span-2 overflow-hidden rounded-lg border border-line">
                      <img
                        src={post.cover}
                        alt=""
                        className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-700 ease-out-expo"
                      />
                    </span>
                  )}
                  <div className="col-span-10 md:col-span-6">
                    <h3 className="font-display text-xl md:text-3xl tracking-tight group-hover:text-accent transition-colors duration-300">
                      {post[locale].title}
                    </h3>
                    <p className="text-muted text-sm mt-3 max-w-2xl leading-relaxed line-clamp-2">
                      {post[locale].excerpt}
                    </p>
                  </div>
                  <span className="hidden md:block col-span-3 text-right text-xs text-muted font-display tracking-wider">
                    {post.date} · {post.tags[0]}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Link
            href="/blog"
            className="link-line md:hidden inline-block mt-6 text-sm text-muted"
          >
            {t("home.writingAll")} →
          </Link>
        </section>

        {/* ---------- Showreel（放入视频文件并配置 lib/site.ts 后显示） ---------- */}
        {SHOWREEL_SRC && (
          <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-28">
            <Reveal>
              <p className="eyebrow mb-4">{t("home.showreelEyebrow")}</p>
              <h2 className="display text-4xl md:text-6xl mb-10">
                {t("home.showreelTitle")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-2xl border border-line">
                <video
                  src={SHOWREEL_SRC}
                  poster={SHOWREEL_POSTER ?? undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full aspect-video object-cover"
                />
              </div>
            </Reveal>
          </section>
        )}

        {/* ---------- 模块 ---------- */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-28">
          <Reveal>
            <p className="eyebrow mb-4">{t("home.modulesEyebrow")}</p>
            <h2 className="display text-4xl md:text-6xl">
              {t("home.modulesTitle")}
            </h2>
            <p className="text-muted mt-5 max-w-lg leading-relaxed">
              {t("home.modulesSubtitle")}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
            {modules.map((m, i) => (
              <Reveal key={m.index} delay={i * 0.08}>
                <Link
                  href={m.href}
                  className="group block h-full rounded-2xl border border-line bg-surface/80 backdrop-blur-md p-8 md:p-10 hover:border-accent/50 hover:bg-surface-2 transition-all duration-500"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-display text-xs text-muted tracking-[0.2em]">
                      {m.index}
                    </span>
                    <span className="text-muted group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                      ↗
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl tracking-tight mt-16 group-hover:text-accent transition-colors duration-300">
                    {m.title}
                  </h3>
                  <p className="text-muted text-sm mt-4 leading-relaxed">
                    {m.desc}
                  </p>
                </Link>
              </Reveal>
            ))}

            {/* 预留的下一个模块 */}
            <Reveal delay={0.24}>
              <div className="h-full rounded-2xl border border-dashed border-line p-8 md:p-10 flex flex-col justify-between min-h-[260px] backdrop-blur-sm">
                <span className="font-display text-xs text-muted tracking-[0.2em]">
                  04
                </span>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl tracking-tight text-muted">
                    {t("home.moduleNextTitle")}
                  </h3>
                  <p className="text-muted/60 text-sm mt-4 leading-relaxed">
                    {t("home.moduleNextDesc")}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </main>
  );
}
