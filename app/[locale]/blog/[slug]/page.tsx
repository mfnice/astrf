import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { posts, getPost } from "@/content/posts";
import Comments from "@/components/blog/Comments";

interface Props {
  params: { locale: string; slug: string };
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};
  const content = post[params.locale === "zh" ? "zh" : "en"];
  return { title: content.title, description: content.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  setRequestLocale(params.locale);

  const post = getPost(params.slug);
  if (!post) notFound();

  const locale = params.locale === "zh" ? "zh" : "en";
  const content = post[locale];
  const t = await getTranslations("blog");

  return (
    <main className="pt-36 min-h-screen">
      <article className="max-w-[760px] mx-auto px-6">
        <Link
          href="/blog"
          className="link-line text-xs font-display tracking-[0.15em] uppercase text-muted hover:text-fg transition-colors"
        >
          ← {t("back")}
        </Link>

        <header className="mt-10 mb-14">
          <h1 className="display text-4xl md:text-6xl text-balance">
            {content.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-8 text-xs text-muted font-display tracking-wider">
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-muted" />
            <span>{t("readingTime", { minutes: post.readingTime })}</span>
            <span className="w-1 h-1 rounded-full bg-muted" />
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-accent">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {post.cover && (
          <div className="mb-14 overflow-hidden rounded-2xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover}
              alt={content.title}
              className="w-full aspect-[3/2] object-cover"
            />
          </div>
        )}

        <div className="prose-custom">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content.body}
          </ReactMarkdown>
        </div>

        <div className="mt-20 pt-10 border-t border-line">
          <Comments postSlug={post.slug} />
        </div>
      </article>
    </main>
  );
}
