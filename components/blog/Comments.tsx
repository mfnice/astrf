"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";

interface CommentRow {
  id: string;
  post_slug: string;
  user_id: string;
  author_email: string;
  content: string;
  created_at: string;
}

/** 邮箱前缀作为展示名 */
function displayName(email: string) {
  return email.split("@")[0];
}

export default function Comments({ postSlug }: { postSlug: string }) {
  const t = useTranslations("comments");
  const { user, configured } = useAuth();
  const supabase = getSupabase();

  const [comments, setComments] = useState<CommentRow[]>([]);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_slug", postSlug)
      .order("created_at", { ascending: true });
    setComments(data ?? []);
  }, [supabase, postSlug]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit() {
    if (!supabase || !user || !draft.trim()) return;
    setSubmitting(true);
    setError(false);
    const { error: err } = await supabase.from("comments").insert({
      post_slug: postSlug,
      user_id: user.id,
      author_email: user.email ?? "",
      content: draft.trim(),
    });
    if (err) {
      setError(true);
    } else {
      setDraft("");
      await load();
    }
    setSubmitting(false);
  }

  async function remove(id: string) {
    if (!supabase) return;
    await supabase.from("comments").delete().eq("id", id);
    await load();
  }

  return (
    <section>
      <h2 className="font-display text-2xl tracking-tight mb-8">
        {t("title")}
        {comments.length > 0 && (
          <span className="text-accent text-base ml-2">
            {comments.length}
          </span>
        )}
      </h2>

      {!configured ? (
        <p className="text-sm text-muted border border-dashed border-line rounded-xl p-5 leading-relaxed">
          {t("notConfigured")}
        </p>
      ) : (
        <>
          {/* 评论列表 */}
          <div className="space-y-6 mb-10">
            {comments.length === 0 && (
              <p className="text-sm text-muted">{t("empty")}</p>
            )}
            <AnimatePresence initial={false}>
              {comments.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-4"
                >
                  <span className="shrink-0 w-9 h-9 rounded-full bg-accent-dim border border-accent/30 text-accent text-sm flex items-center justify-center font-display uppercase">
                    {c.author_email.charAt(0)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-medium">
                        {displayName(c.author_email)}
                      </span>
                      <span className="text-xs text-muted">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                      {user?.id === c.user_id && (
                        <button
                          onClick={() => remove(c.id)}
                          className="text-xs text-muted hover:text-red-400 transition-colors ml-auto"
                        >
                          {t("delete")}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-fg/85 mt-1.5 leading-relaxed whitespace-pre-wrap break-words">
                      {c.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 输入区 */}
          {user ? (
            <div>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t("placeholder")}
                rows={3}
                maxLength={2000}
                className="w-full bg-surface border border-line rounded-xl p-4 text-sm leading-relaxed placeholder:text-muted/60 focus:outline-none focus:border-accent/60 transition-colors resize-y"
              />
              <div className="flex items-center justify-between mt-3">
                {error && (
                  <span className="text-xs text-red-400">{t("error")}</span>
                )}
                <button
                  onClick={submit}
                  disabled={submitting || !draft.trim()}
                  className="ml-auto px-6 py-2.5 rounded-full bg-accent text-black text-sm font-medium disabled:opacity-40 hover:opacity-85 transition-opacity"
                >
                  {submitting ? t("submitting") : t("submit")}
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-line rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-muted">{t("signInPrompt")}</p>
              <Link
                href="/login"
                className="px-5 py-2 rounded-full border border-line-strong text-sm hover:border-accent hover:text-accent transition-colors shrink-0"
              >
                {t("signInCta")}
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
