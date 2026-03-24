import { qdrant, COLLECTION_NAME, ensureCollection } from "@/lib/qdrant";
import { getEmbedding } from "@/lib/embedding";
import OpenAI from "openai";

export const runtime = "nodejs";

const llm = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
    "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME || "rag-demo",
  },
});

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return new Response("question is required", { status: 400 });
    }

    // 1. 确保集合存在
    await ensureCollection();

    // 2. 问题 -> embedding
    const queryVector = await getEmbedding(question);

    // 3. 从 Qdrant 检索最相似的文档块
    const results = await qdrant.query(COLLECTION_NAME, {
      query: queryVector,
      limit: 5,
      with_payload: true,
    });

    // 4. 拼接上下文
    const contexts = results
      .map((r) => (r.payload as any)?.text || "")
      .filter(Boolean);

    const contextText = contexts.length > 0
      ? contexts.map((c, i) => `[文档片段 ${i + 1}]\n${c}`).join("\n\n")
      : "没有找到相关文档。";

    // 5. 发给 LLM，流式返回
    const stream = await llm.chat.completions.create({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        {
          role: "system",
          content: `你是一个严谨的中文助手。请根据以下参考文档回答用户问题。
如果文档中没有相关信息，请明确说明"根据已有文档无法回答"，不要编造。

参考文档：
${contextText}`,
        },
        { role: "user", content: question },
      ],
      stream: true,
    });

    const encoder = new TextEncoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            // 先输出检索到的来源信息
            const sourceMeta = `> 检索到 ${contexts.length} 个相关片段\n\n`;
            controller.enqueue(encoder.encode(sourceMeta));

            for await (const part of stream) {
              const delta = part.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            }
          } catch (e) {
            controller.enqueue(encoder.encode("\n[stream error]\n"));
          } finally {
            controller.close();
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      }
    );
  } catch (e: any) {
    console.error("RAG chat error:", e);
    return new Response(e.message, { status: 500 });
  }
}
