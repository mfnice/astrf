"use client";

import { useState } from "react";

export default function claudeDemo() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;

    setLoading(true);
    setAnswer("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    if (!res.body) {
      setAnswer("No response body");
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      setAnswer((prev) => prev + decoder.decode(value));
    }

    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Claude via OpenRouter</h1>

      <div style={{ marginTop: 16 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入问题，比如：用三点解释RAG"
          rows={4}
          style={{ width: "100%", padding: 12 }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{ marginTop: 12, padding: "10px 14px" }}
        >
          {loading ? "生成中..." : "发送"}
        </button>
      </div>

      <pre
        style={{
          marginTop: 20,
          padding: 12,
          background: "#f6f6f6",
          whiteSpace: "pre-wrap",
          color: "black",
        }}
      >
        {answer}
      </pre>
    </main>
  );
}