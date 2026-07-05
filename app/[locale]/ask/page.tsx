"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import SplitLines from "@/components/ui/SplitLines";

interface Turn {
  role: "user" | "assistant";
  content: string;
  /** 检索到的片段数（来自流式响应首行元数据） */
  retrieved?: number;
  /** 命中的来源标签 */
  sources?: string[];
}

interface StreamMeta {
  retrieved?: number;
  sources?: string[];
  degraded?: boolean;
}

/**
 * 响应协议（对应 api/rag/chat）：首行是 JSON 元数据，换行后为正文流。
 * meta 行没到齐时先等待；首行不是 JSON 就当纯文本处理（向后兼容）。
 */
function parseStream(raw: string): { meta: StreamMeta | null; body: string } {
  const nl = raw.indexOf("\n");
  if (nl === -1) {
    if (raw.startsWith("{")) return { meta: null, body: "" };
    return { meta: null, body: raw };
  }
  const first = raw.slice(0, nl);
  if (first.startsWith("{")) {
    try {
      return { meta: JSON.parse(first) as StreamMeta, body: raw.slice(nl + 1) };
    } catch {
      /* 首行不是合法 JSON，按纯文本处理 */
    }
  }
  return { meta: null, body: raw };
}

export default function AskPage() {
  const t = useTranslations("ask");
  const locale = useLocale();

  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // 入库是站长内部工具：URL 带 #admin 才显示
  const [admin, setAdmin] = useState(false);
  const [ingestOpen, setIngestOpen] = useState(false);
  const [docText, setDocText] = useState("");
  const [source, setSource] = useState("");
  const [ingesting, setIngesting] = useState(false);
  const [ingestMsg, setIngestMsg] = useState("");

  useEffect(() => {
    const check = () => setAdmin(window.location.hash === "#admin");
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  function scrollToEnd() {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }

  function stop() {
    abortRef.current?.abort();
  }

  async function ask(preset?: string) {
    const q = (preset ?? question).trim();
    if (!q || asking) return;
    setAsking(true);
    setQuestion("");

    // 多轮记忆：把已有对话（剥掉元数据后的正文）发给后端
    const history = turns
      .filter((tn) => tn.content.trim() !== "")
      .map((tn) => ({ role: tn.role, content: tn.content }));

    setTurns((prev) => [
      ...prev,
      { role: "user", content: q },
      { role: "assistant", content: "" },
    ]);
    scrollToEnd();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history, locale }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let raw = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        const { meta, body } = parseStream(raw);
        setTurns((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: body,
            retrieved: meta?.retrieved,
            sources: meta?.sources,
          };
          return next;
        });
        scrollToEnd();
      }
    } catch (e) {
      const aborted = e instanceof DOMException && e.name === "AbortError";
      if (!aborted) {
        const msg = e instanceof Error ? e.message : String(e);
        setTurns((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: `⚠ ${msg}` };
          return next;
        });
      }
      // 手动停止：保留已生成的部分，不追加错误
    }
    abortRef.current = null;
    setAsking(false);
  }

  async function ingest() {
    if (!docText.trim() || ingesting) return;
    setIngesting(true);
    setIngestMsg("");
    try {
      const res = await fetch("/api/rag/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: docText, source: source || "manual" }),
      });
      const data = await res.json();
      if (data.success) {
        setIngestMsg(t("ingestSuccess", { count: data.chunks_count }));
        setDocText("");
      } else {
        setIngestMsg(t("ingestError", { error: data.error ?? "unknown" }));
      }
    } catch (e) {
      setIngestMsg(
        t("ingestError", { error: e instanceof Error ? e.message : String(e) })
      );
    }
    setIngesting(false);
  }

  const chips = [t("chip1"), t("chip2"), t("chip3"), t("chip4")];

  return (
    <main className="max-w-[1100px] mx-auto px-6 pt-36 pb-20 min-h-screen">
      <p className="eyebrow mb-6">{t("eyebrow")}</p>
      <h1 className="display text-4xl md:text-7xl">
        <SplitLines lines={[t("title")]} />
      </h1>
      <Reveal delay={0.3}>
        <p className="text-muted mt-5 max-w-xl leading-relaxed text-sm md:text-base">
          {t("subtitle")}
        </p>
      </Reveal>

      <div className="mt-14 flex flex-col gap-12 lg:flex-row">
        {/* 左栏：分身本体 —— 会注视的光球 + 身份卡 + 建议问题 */}
        <Reveal delay={0.4} className="lg:w-[300px] shrink-0">
          <div className="lg:sticky lg:top-32 flex flex-col items-start">
            <div
              role="img"
              aria-label={t("orbAlt")}
              className={`orb dream-glow h-28 w-28 md:h-36 md:w-36 ${
                asking ? "orb--thinking" : ""
              }`}
            />
            <p className="font-display mt-7 text-xs tracking-[0.3em] text-fg">
              {t("identityName")}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              {t("identityDesc")}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => ask(c)}
                  disabled={asking}
                  className="rounded-full border border-line px-3.5 py-2 text-left text-xs text-fg/80 transition-colors hover:border-accent/60 hover:text-accent disabled:opacity-40"
                >
                  {c}
                </button>
              ))}
            </div>

            {turns.length > 0 && !asking && (
              <button
                onClick={() => setTurns([])}
                className="link-line mt-8 text-xs text-muted transition-colors hover:text-fg"
              >
                {t("clear")}
              </button>
            )}
          </div>
        </Reveal>

        {/* 右栏：对话 */}
        <Reveal delay={0.5} className="flex min-w-0 flex-1 flex-col">
          <div
            ref={listRef}
            className="min-h-[360px] flex-1 space-y-7 overflow-y-auto rounded-3xl border border-line bg-surface p-6 md:p-8 max-h-[58vh]"
          >
            {turns.length === 0 && (
              <p className="flex h-full min-h-[300px] items-center justify-center text-sm text-muted/70">
                {t("emptyState")}
              </p>
            )}
            {turns.map((turn, i) => {
              if (turn.role === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-accent/25 bg-accent-dim px-4 py-3 text-sm leading-relaxed">
                      {turn.content}
                    </div>
                  </div>
                );
              }
              const isStreamingThis = asking && i === turns.length - 1;
              const showBadge =
                typeof turn.retrieved === "number" && turn.retrieved > 0;
              return (
                <div key={i} className="flex gap-3.5">
                  <span
                    className={`orb mt-1 h-6 w-6 shrink-0 ${
                      isStreamingThis ? "orb--thinking" : ""
                    }`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    {showBadge && (
                      <p className="mb-2 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] tracking-wide text-muted">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                          {t("retrieved", { count: turn.retrieved })}
                        </span>
                        {turn.sources?.map((s) => (
                          <span
                            key={s}
                            className="max-w-[160px] truncate rounded-full bg-surface-2 px-2.5 py-1 text-[11px] text-muted"
                            title={s}
                          >
                            {s}
                          </span>
                        ))}
                      </p>
                    )}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-fg/90">
                      {turn.content ||
                        (isStreamingThis ? (
                          <span className="inline-flex items-center gap-1 text-muted">
                            <motion.span
                              className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
                              animate={{ opacity: [0.2, 1, 0.2] }}
                              transition={{ repeat: Infinity, duration: 1.2 }}
                            />
                            {t("thinking")}
                          </span>
                        ) : null)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex gap-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder={t("placeholder")}
              className="flex-1 rounded-full border border-line bg-surface px-5 py-3.5 text-sm transition-colors placeholder:text-muted/60 focus:border-accent/60 focus:outline-none"
            />
            {asking ? (
              <button
                onClick={stop}
                className="rounded-full border border-line-strong px-7 py-3.5 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
              >
                {t("stop")}
              </button>
            ) : (
              <button
                onClick={() => ask()}
                disabled={!question.trim()}
                className="dream-glow rounded-full px-7 py-3.5 text-sm font-medium text-white transition-opacity disabled:opacity-40 hover:opacity-90"
                style={{ background: "var(--pop-gradient)" }}
              >
                {t("send")}
              </button>
            )}
          </div>

          {/* 入库面板：站长内部工具，URL 加 #admin 才出现 */}
          {admin && (
            <div className="mt-12">
              <button
                onClick={() => setIngestOpen((v) => !v)}
                className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-fg"
              >
                <span
                  className={`inline-block transition-transform duration-300 ${
                    ingestOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
                <span className="font-display tracking-wide">
                  {t("ingestTitle")}
                </span>
              </button>

              <AnimatePresence>
                {ingestOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 rounded-2xl border border-line bg-surface p-6">
                      <p className="mb-4 text-xs text-muted">
                        {t("ingestSubtitle")}
                      </p>
                      <input
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder={t("sourcePlaceholder")}
                        className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm transition-colors placeholder:text-muted/60 focus:border-accent/60 focus:outline-none"
                      />
                      <textarea
                        value={docText}
                        onChange={(e) => setDocText(e.target.value)}
                        placeholder={t("textPlaceholder")}
                        rows={6}
                        className="mt-3 w-full resize-y rounded-xl border border-line bg-bg px-4 py-3 text-sm transition-colors placeholder:text-muted/60 focus:border-accent/60 focus:outline-none"
                      />
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-muted">{ingestMsg}</span>
                        <button
                          onClick={ingest}
                          disabled={ingesting || !docText.trim()}
                          className="rounded-full border border-line-strong px-6 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                        >
                          {ingesting ? t("ingesting") : t("ingest")}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </Reveal>
      </div>
    </main>
  );
}
