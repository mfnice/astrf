"use client";

import { useState } from "react";

export default function RAGPage() {
  // 文档入库
  const [docText, setDocText] = useState("");
  const [source, setSource] = useState("");
  const [ingesting, setIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState("");

  // RAG 问答
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  async function handleIngest() {
    if (!docText.trim()) return;
    setIngesting(true);
    setIngestResult("");
    try {
      const res = await fetch("/api/rag/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: docText, source: source || "手动输入" }),
      });
      const data = await res.json();
      if (data.success) {
        setIngestResult(`入库成功：${data.chunks_count} 个文本块`);
        setDocText("");
      } else {
        setIngestResult(`入库失败：${data.error}`);
      }
    } catch (e) {
      setIngestResult(`请求失败：${e instanceof Error ? e.message : String(e)}`);
    }
    setIngesting(false);
  }

  async function handleAsk() {
    if (!question.trim()) return;
    setAsking(true);
    setAnswer("");
    try {
      const res = await fetch("/api/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.body) {
        setAnswer("No response body");
        setAsking(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setAnswer((prev) => prev + decoder.decode(value));
      }
    } catch (e) {
      setAnswer(`请求失败：${e instanceof Error ? e.message : String(e)}`);
    }
    setAsking(false);
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>RAG 演示</h1>
      <p style={{ color: "#666", marginTop: 8 }}>
        Qdrant + OpenRouter Embedding + Claude
      </p>

      {/* 文档入库区域 */}
      <section
        style={{
          marginTop: 32,
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>1. 文档入库</h2>
        <p style={{ color: "#888", fontSize: 14, marginTop: 4 }}>
          粘贴文本内容，系统会自动分块、生成向量、存入 Qdrant
        </p>
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="文档来源（可选，如：公司手册）"
          style={{
            width: "100%",
            padding: 10,
            marginTop: 12,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        />
        <textarea
          value={docText}
          onChange={(e) => setDocText(e.target.value)}
          placeholder="在这里粘贴文档内容..."
          rows={8}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 8,
            border: "1px solid #ccc",
            borderRadius: 4,
            resize: "vertical",
          }}
        />
        <button
          onClick={handleIngest}
          disabled={ingesting || !docText.trim()}
          style={{
            marginTop: 10,
            padding: "10px 20px",
            background: ingesting ? "#ccc" : "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: ingesting ? "not-allowed" : "pointer",
          }}
        >
          {ingesting ? "入库中..." : "入库"}
        </button>
        {ingestResult && (
          <p style={{ marginTop: 10, color: ingestResult.includes("成功") ? "green" : "red" }}>
            {ingestResult}
          </p>
        )}
      </section>

      {/* RAG 问答区域 */}
      <section
        style={{
          marginTop: 24,
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>2. 知识库问答</h2>
        <p style={{ color: "#888", fontSize: 14, marginTop: 4 }}>
          基于已入库的文档进行问答，LLM 只会根据文档内容回答
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !asking && handleAsk()}
            placeholder="输入你的问题..."
            style={{
              flex: 1,
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
          <button
            onClick={handleAsk}
            disabled={asking || !question.trim()}
            style={{
              padding: "10px 20px",
              background: asking ? "#ccc" : "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: asking ? "not-allowed" : "pointer",
            }}
          >
            {asking ? "检索中..." : "提问"}
          </button>
        </div>
        {answer && (
          <pre
            style={{
              marginTop: 16,
              padding: 16,
              background: "#f6f6f6",
              borderRadius: 4,
              whiteSpace: "pre-wrap",
              color: "black",
              lineHeight: 1.6,
            }}
          >
            {answer}
          </pre>
        )}
      </section>
    </main>
  );
}
