"use client";

import { useTranslations } from "next-intl";
import { ShowcaseScene, ProductUI } from "@/components/showcase";

/** 三幕滚动文案：滚动本身驱动模型旋转，文字只负责旁白 */
const ACTS = [1, 2, 3] as const;

export default function ShowcasePage() {
  const t = useTranslations("showcase");

  return (
    <>
      <ShowcaseScene />
      <ProductUI />
      <div className="fixed top-24 left-0 right-0 z-10 text-center pointer-events-none">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-white/90 drop-shadow-lg tracking-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-white/60 mt-1">{t("subtitle")}</p>
      </div>

      {/* 滚动叙事层：三幕全屏文案，滚动进度同时驱动 3D 模型的回转/俯仰 */}
      <div className="relative z-10 pointer-events-none">
        {ACTS.map((n, i) => (
          <section
            key={n}
            className={`flex h-screen items-center px-6 md:px-20 ${
              i % 2 === 1 ? "justify-end" : ""
            }`}
          >
            <div className="max-w-md">
              <p className="eyebrow mb-4">{t(`act${n}Eyebrow`)}</p>
              <h2 className="display pop-text text-4xl md:text-6xl">
                {t(`act${n}Title`)}
              </h2>
              <p className="text-muted mt-5 leading-relaxed text-sm md:text-base">
                {t(`act${n}Body`)}
              </p>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
