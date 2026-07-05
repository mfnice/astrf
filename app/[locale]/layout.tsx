import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "@/components/providers/AuthProvider";
import LenisProvider from "@/components/providers/LenisProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isZh = params.locale === "zh";
  return {
    title: {
      default: "ASTRF — Web · 3D · AI",
      template: "%s · ASTRF",
    },
    description: isZh
      ? "一个集成 Three.js、RAG 问答与双语写作的个人网站。"
      : "A personal site fusing Three.js, retrieval-augmented AI and bilingual writing.",
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${grotesk.variable}`}>
      <body className="grain">
        <NextIntlClientProvider>
          <AuthProvider>
            <LenisProvider>
              <Header />
              {children}
              <Footer />
            </LenisProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
