import { NextResponse } from "next/server";
import { qdrant, COLLECTION_NAME, ensureCollection } from "@/lib/qdrant";
import { getEmbeddings } from "@/lib/embedding";

export const runtime = "nodejs";

// 文本分块：按段落拆分，每块不超过 maxLen 字符，overlap 重叠
function splitText(text: string, maxLen = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + maxLen, text.length);
    chunks.push(text.slice(start, end));
    start += maxLen - overlap;
  }
  return chunks;
}

export async function POST(req: Request) {
  try {
    const { text, source } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    // 1. 确保集合存在
    await ensureCollection();

    // 2. 分块
    const chunks = splitText(text);

    // 3. 批量生成 embedding
    const embeddings = await getEmbeddings(chunks);

    // 4. 写入 Qdrant
    const points = chunks.map((chunk, i) => ({
      id: crypto.randomUUID(),
      vector: embeddings[i],
      payload: {
        text: chunk,
        source: source || "unknown",
        created_at: new Date().toISOString(),
      },
    }));

    await qdrant.upsert(COLLECTION_NAME, { points });

    return NextResponse.json({
      success: true,
      chunks_count: chunks.length,
      message: `成功入库 ${chunks.length} 个文本块`,
    });
  } catch (e) {
    console.error("Ingest error:", e);
    const message = e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
