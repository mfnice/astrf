import OpenAI from "openai";

export const runtime = "nodejs"; // 确保用 Node runtime（更稳）

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
    "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME || "openrouter-demo",
  },
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const stream = await client.chat.completions.create({
    model: "anthropic/claude-3.5-sonnet",
    messages: [
      { role: "system", content: "你是一个严谨、简洁的中文助手。" },
      { role: "user", content: message },
    ],
    stream: true,
  });

  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
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
}