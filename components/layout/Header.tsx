"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

const NAV_KEYS = [
  { key: "home", path: "/" },
  { key: "blog", path: "/blog" },
  { key: "showcase", path: "/showcase" },
  { key: "ask", path: "/ask" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, configured, signOut } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 路由变化时收起移动端菜单
  useEffect(() => setMenuOpen(false), [pathname]);

  const otherLocale = locale === "zh" ? "en" : "zh";
  const switchLocale = () => router.replace(pathname, { locale: otherLocale });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-bg/70 backdrop-blur-xl border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight"
        >
          ASTRF<span className="text-accent">.</span>
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_KEYS.map(({ key, path }) => {
            const active =
              path === "/" ? pathname === "/" : pathname.startsWith(path);
            return (
              <Link
                key={key}
                href={path}
                className={`link-line text-sm transition-colors ${
                  active ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <button
            onClick={switchLocale}
            className="text-xs font-display tracking-[0.15em] text-muted hover:text-accent transition-colors uppercase"
            aria-label="Switch language"
          >
            {locale === "zh" ? "EN" : "中文"}
          </button>

          {configured &&
            (user ? (
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full bg-accent-dim border border-accent/40 text-accent text-xs flex items-center justify-center font-display uppercase"
                  title={user.email ?? ""}
                >
                  {(user.email ?? "?").charAt(0)}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-muted hover:text-fg transition-colors"
                >
                  {t("signOut")}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs px-4 py-1.5 rounded-full border border-line-strong hover:border-accent hover:text-accent transition-colors"
              >
                {t("signIn")}
              </Link>
            ))}
        </div>

        {/* 移动端菜单按钮 */}
        <button
          className="md:hidden text-sm text-muted"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? t("close") : t("menu")}
        </button>
      </div>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-bg/95 backdrop-blur-xl border-b border-line"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {NAV_KEYS.map(({ key, path }) => (
                <Link
                  key={key}
                  href={path}
                  className="font-display text-2xl tracking-tight"
                >
                  {t(key)}
                </Link>
              ))}
              <div className="flex items-center gap-6 pt-4 border-t border-line">
                <button
                  onClick={switchLocale}
                  className="text-sm text-muted uppercase tracking-[0.15em]"
                >
                  {locale === "zh" ? "English" : "中文"}
                </button>
                {configured &&
                  (user ? (
                    <button
                      onClick={() => signOut()}
                      className="text-sm text-muted"
                    >
                      {t("signOut")}
                    </button>
                  ) : (
                    <Link href="/login" className="text-sm text-accent">
                      {t("signIn")}
                    </Link>
                  ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
