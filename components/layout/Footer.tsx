"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="relative z-10 border-t border-line mt-32 overflow-hidden bg-bg/60 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <p className="font-display text-lg font-semibold">
              ASTRF<span className="text-accent">.</span>
            </p>
            <p className="text-muted text-sm mt-3 max-w-sm leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5">{t("nav")}</p>
            <ul className="space-y-3 text-sm text-muted">
              {(
                [
                  ["home", "/"],
                  ["blog", "/blog"],
                  ["showcase", "/showcase"],
                  ["ask", "/ask"],
                ] as const
              ).map(([key, path]) => (
                <li key={key}>
                  <Link href={path} className="hover:text-fg transition-colors">
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5">{t("connect")}</p>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <a
                  href="mailto:nicedemf@gmail.com"
                  className="hover:text-fg transition-colors"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-fg transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 超大水印字 */}
        <p
          aria-hidden
          className="font-display font-semibold text-[22vw] leading-none tracking-tighter text-transparent select-none mt-16 -mb-[9vw]"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.06)" }}
        >
          ASTRF
        </p>

        <div className="flex flex-col md:flex-row justify-between gap-2 pt-8 border-t border-line text-xs text-muted">
          <span>
            © {new Date().getFullYear()} ASTRF — {t("rights")}
          </span>
          <span>{t("builtWith")}</span>
        </div>
      </div>
    </footer>
  );
}
