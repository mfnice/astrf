import {
  qdrant,
  COLLECTION_NAME,
  ensureCollection,
  type DocumentPayload,
} from "@/lib/qdrant";
import { getEmbedding } from "@/lib/embedding";
import OpenAI from "openai";

export const runtime = "nodejs";

const MODEL = "anthropic/claude-sonnet-5";
const MAX_HISTORY = 8;

/**
 * 响应协议：第一行是 JSON 元数据（retrieved/sources/degraded），
 * 换行之后才是正文流。前端 ask/page.tsx 的 parseStream 与此对应。
 */
function metaLine(meta: Record<string, unknown>): string {
  return JSON.stringify(meta) + "\n";
}

const TEXT_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-cache",
};

interface HistoryTurn {
  role: "user" | "assistant";
  content: string;
}

function getLLM() {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
    defaultHeaders: {
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
      "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME || "astrf-site-ghost",
    },
  });
}

function systemPrompt(isZh: boolean, contextText: string): string {
  if (isZh) {
    return `你是这个个人博客的常驻数字分身「Site Ghost」，读过站内所有文章。规则：
1. 只根据下面的参考片段回答；片段里没有的信息就直说「站里还没写过这个」，不要编造。
2. 用中文回答，简洁、友好、有一点点俏皮，但不油腻；面向博客访客。
3. 用到某个片段时，自然地提一句来源标签，例如「在《来源》里提到过」。
4. 与博客无关的通用问题可以简短回答，但要说明这超出了站内内容。

参考片段：
${contextText}`;
  }
  return `You are "Site Ghost", the resident digital twin of this personal blog. You have read every post. Rules:
1. Answer only from the reference snippets below; if they don't cover it, say plainly "the blog hasn't written about this yet" — never fabricate.
2. Answer in English, concise, friendly, slightly playful; you're talking to blog visitors.
3. When you draw on a snippet, mention its source label naturally, e.g. "as mentioned in <source>".
4. General questions unrelated to the blog get a brief answer plus a note that it's beyond the site's content.

Reference snippets:
${contextText}`;
}

export async function POST(req: Request) {
  let body: {
    question?: unknown;
    history?: unknown;
    locale?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return new Response("invalid body", { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return new Response("question is required", { status: 400 });
  }
  const isZh = body.locale !== "en";
  const history: HistoryTurn[] = Array.isArray(body.history)
    ? (body.history as HistoryTurn[])
        .filter(
          (t) =>
            t &&
            (t.role === "user" || t.role === "assistant") &&
            typeof t.content === "string" &&
            t.content.trim() !== ""
        )
        .slice(-MAX_HISTORY)
    : [];

  // 站长还没配置 AI 服务：返回 200 + 结构化降级文案，让分身自己解释，而不是 500
  if (!process.env.OPENROUTER_API_KEY) {
    const msg = isZh
      ? "我的记忆库还没接通电源——站长还没配置 AI 服务。等他把线接好，我就能回答关于这个博客的一切了。"
      : "My memory bank isn't plugged in yet — the owner hasn't configured the AI service. Once wired up, I can answer anything about this blog.";
    return new Response(
      metaLine({ retrieved: 0, sources: [], degraded: true }) + msg,
      { headers: TEXT_HEADERS }
    );
  }

  // 检索。Qdrant 不可用不致命：降级为无上下文回答（分身会说明知识库为空）
  let contexts: { text: string; source: string }[] = [];
  try {
    await ensureCollection();
    const queryVector = await getEmbedding(question);
    const results = await qdrant.query(COLLECTION_NAME, {
      query: queryVector,
      limit: 5,
      with_payload: true,
    });
    contexts = results.points
      .map((r) => r.payload as Partial<DocumentPayload> | null)
      .filter((p): p is DocumentPayload => Boolean(p?.text))
      .map((p) => ({ text: p.text, source: p.source || "unknown" }));
  } catch (e) {
    console.error("RAG retrieval failed, answering without context:", e);
  }

  const sources = [...new Set(contexts.map((c) => c.source))];
  const contextText =
    contexts.length > 0
      ? contexts
          .map((c, i) => `[片段 ${i + 1} · 来源: ${c.source}]\n${c.text}`)
          .join("\n\n")
      : isZh
        ? "（知识库为空或暂不可用）"
        : "(knowledge base is empty or unavailable)";

  try {
    const stream = await getLLM().chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt(isZh, contextText) },
        ...history,
        { role: "user", content: question },
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            controller.enqueue(
              encoder.encode(metaLine({ retrieved: contexts.length, sources }))
            );
            for await (const part of stream) {
              const delta = part.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            }
          } catch (e) {
            console.error("RAG stream error:", e);
            controller.enqueue(encoder.encode("\n[stream error]"));
          } finally {
            controller.close();
          }
        },
      }),
      { headers: TEXT_HEADERS }
    );
  } catch (e) {
    // LLM 调用失败（密钥无效/网络等）：同样走结构化降级，不给访客看 500
    console.error("RAG chat error:", e);
    const msg = isZh
      ? "我这会儿连不上大脑（AI 服务调用失败）。稍后再试一次？"
      : "I can't reach my brain right now (the AI call failed). Try again in a bit?";
    return new Response(
      metaLine({ retrieved: contexts.length, sources, degraded: true }) + msg,
      { headers: TEXT_HEADERS }
    );
  }
}
