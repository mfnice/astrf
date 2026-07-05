"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { posts } from "@/content/posts";
import Reveal from "@/components/ui/Reveal";
import SplitLines from "@/components/ui/SplitLines";

export default function BlogPage() {
  const t = useTranslations("blog");
  const locale = useLocale() as "en" | "zh";

  return (
    <main className="max-w-[1400px] mx-auto px-6 md:px-10 pt-36 min-h-screen">
      <p className="eyebrow mb-6">{t("eyebrow")}</p>
      <h1 className="display text-5xl md:text-8xl">
        <SplitLines lines={[t("title")]} />
      </h1>
      <Reveal delay={0.3}>
        <p className="text-muted mt-6 max-w-xl leading-relaxed">
          {t("subtitle")}
        </p>
      </Reveal>

      <div className="mt-20">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={Math.min(i * 0.06, 0.3)}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-12 gap-4 py-10 border-t border-line hover:border-line-strong transition-colors"
            >
              <div className="col-span-12 md:col-span-2 flex md:flex-col gap-3 md:gap-2 text-xs text-muted font-display tracking-wider">
                <span>{post.date}</span>
                <span>{t("readingTime", { minutes: post.readingTime })}</span>
              </div>
              {post.cover && (
                <div className="col-span-12 md:col-span-3 overflow-hidden rounded-xl border border-line self-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.cover}
                    alt=""
                    className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-700 ease-out-expo"
                  />
                </div>
              )}
              <div className={post.cover ? "col-span-12 md:col-span-5" : "col-span-12 md:col-span-7"}>
                <h2 className="font-display text-2xl md:text-4xl tracking-tight group-hover:text-accent transition-colors duration-300">
                  {post[locale].title}
                </h2>
                <p className="text-muted text-sm mt-4 max-w-2xl leading-relaxed">
                  {post[locale].excerpt}
                </p>
                <div className="flex gap-2 mt-5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.65rem] font-display tracking-wider uppercase px-3 py-1 rounded-full border border-line text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hidden md:flex col-span-2 justify-end items-start">
                <span className="text-muted group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 text-lg">
                  ↗
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
