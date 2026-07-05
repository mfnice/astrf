"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p
        className="font-display font-semibold text-[30vw] md:text-[18vw] leading-none text-transparent select-none"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.14)" }}
      >
        404
      </p>
      <h1 className="display text-3xl md:text-4xl -mt-4">{t("title")}</h1>
      <p className="text-muted mt-4 max-w-sm">{t("desc")}</p>
      <Link
        href="/"
        className="mt-8 px-7 py-3 rounded-full bg-accent text-black text-sm font-medium hover:opacity-85 transition-opacity"
      >
        {t("back")}
      </Link>
    </main>
  );
}
