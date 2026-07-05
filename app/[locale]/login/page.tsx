"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { user, configured, signOut } = useAuth();
  const supabase = getSupabase();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function sendLink() {
    if (!supabase || !email.trim()) return;
    setStatus("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    setStatus(error ? "error" : "sent");
  }

  async function signInWithGithub() {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin },
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <p className="eyebrow mb-6">ASTRF</p>
        <h1 className="display text-5xl md:text-6xl">{t("title")}</h1>

        {!configured ? (
          <p className="mt-8 text-sm text-muted border border-dashed border-line rounded-xl p-5 leading-relaxed">
            {t("notConfigured")}
          </p>
        ) : user ? (
          <div className="mt-8">
            <p className="text-sm text-muted">
              {t("signedInAs")}{" "}
              <span className="text-fg">{user.email}</span>
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2.5 rounded-full bg-accent text-black text-sm font-medium hover:opacity-85 transition-opacity"
              >
                ←
              </button>
              <button
                onClick={() => signOut()}
                className="px-6 py-2.5 rounded-full border border-line-strong text-sm hover:border-accent hover:text-accent transition-colors"
              >
                {t("signOut")}
              </button>
            </div>
          </div>
        ) : status === "sent" ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-sm leading-relaxed border border-accent/30 bg-accent-dim rounded-xl p-5 text-fg"
          >
            {t("sent")}
          </motion.p>
        ) : (
          <div className="mt-8">
            <p className="text-muted text-sm leading-relaxed mb-8">
              {t("subtitle")}
            </p>

            <button
              onClick={signInWithGithub}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-full border border-line-strong text-sm hover:border-accent hover:text-accent transition-colors"
            >
              <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              {t("github")}
            </button>

            <div className="flex items-center gap-4 my-7">
              <span className="flex-1 h-px bg-line" />
              <span className="text-xs text-muted uppercase tracking-[0.2em]">
                {t("or")}
              </span>
              <span className="flex-1 h-px bg-line" />
            </div>

            <label className="block text-xs font-display tracking-[0.15em] uppercase text-muted mb-3">
              {t("emailLabel")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendLink()}
              placeholder={t("emailPlaceholder")}
              className="w-full bg-surface border border-line rounded-xl px-4 py-3.5 text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent/60 transition-colors"
            />
            {status === "error" && (
              <p className="text-xs text-red-400 mt-3">{t("error")}</p>
            )}
            <button
              onClick={sendLink}
              disabled={status === "sending" || !email.trim()}
              className="w-full mt-5 px-6 py-3.5 rounded-full bg-accent text-black text-sm font-medium disabled:opacity-40 hover:opacity-85 transition-opacity"
            >
              {status === "sending" ? t("submitting") : t("submit")}
            </button>
          </div>
        )}
      </motion.div>
    </main>
  );
}
