import type { Post } from "./types";

const post: Post = {
  slug: "rag-under-the-hood",
  date: "2026-03-10",
  tags: ["AI", "RAG", "Qdrant"],
  readingTime: 8,
  cover: "/covers/rag-under-the-hood.jpg",
  en: {
    title: "The honest anatomy of a small RAG system",
    excerpt:
      "The Q&A module on this site is deliberately small: chunk, embed, store, retrieve, answer. Understanding those five verbs well beats bolting on a framework you don't understand at all.",
    body: `The Q&A module on this site is deliberately small: chunk, embed, store, retrieve, answer. Understanding those five verbs well beats bolting on a framework you don't understand at all.

## The pipeline in one paragraph

Text pasted into the ingest form is split into overlapping chunks, each chunk is turned into a vector by an embedding model, and the vectors land in a Qdrant collection with the original text as payload. At question time the query takes the same trip — embedded once, matched against the collection by cosine similarity — and the top chunks are pasted into the system prompt of a streaming LLM call. That's the whole system.

## Chunking is a product decision, not a preprocessing step

Chunk too small and retrieval returns fragments with no context; too large and one hit floods the prompt with noise. Overlap matters more than people admit — a sentence that straddles a boundary should exist whole in at least one chunk. For personal-scale corpora, a few hundred tokens per chunk with 10–15% overlap is the boring answer that works.

## Retrieval quality is felt, not measured, at this scale

Serious systems run evaluation suites. A personal knowledge base has a cheaper tool: ask questions you know the answer to and read what came back. Two failure smells appear immediately:

- The right chunk exists but ranks below unrelated ones — your embedding model or your chunking is at fault.
- The model answers fluently about things not in the context — your prompt fails to fence it in.

The second one is the dangerous one. The system prompt here explicitly instructs the model to say "the documents don't cover this" instead of improvising. An assistant that admits ignorance is a feature, not an apology.

## Streaming is not decoration

The answer streams token by token to the browser through a plain \`ReadableStream\` — no library. Perceived latency is the entire user experience of a Q&A box: the difference between a three-second blank stare and text that starts flowing in 300 ms is the difference between "broken" and "alive", even when total time is identical.

## Where it grows next

Because the module owns its API routes, upgrades are local: hybrid search with keyword filters, re-ranking retrieved chunks before prompting, or ingesting the blog itself so the assistant can answer questions about these very posts. None of that requires touching the rest of the site.`,
  },
  zh: {
    title: "一个小型 RAG 系统的诚实解剖",
    excerpt:
      "站内问答模块刻意保持小巧：分块、嵌入、存储、检索、回答。把这五个动词真正吃透，胜过套一个你根本不理解的框架。",
    body: `站内问答模块刻意保持小巧：分块、嵌入、存储、检索、回答。把这五个动词真正吃透，胜过套一个你根本不理解的框架。

## 一段话讲完整个流水线

粘贴进入库表单的文本被切成有重叠的块，每个块经嵌入模型变成向量，连同原文一起存入 Qdrant 的 collection。提问时，问题走同样的路 —— 嵌入一次，按余弦相似度在 collection 中匹配 —— 得分最高的几个块被拼进流式 LLM 调用的 system prompt。整个系统就是这样。

## 分块是产品决策，不是预处理步骤

块太小，检索回来的是没有上下文的碎片；块太大，一次命中就让 prompt 灌满噪音。重叠的重要性被普遍低估 —— 一句横跨边界的话，至少应该完整地存在于某一个块里。对个人规模的语料，每块几百 token、重叠 10–15%，是那个"无聊但有效"的答案。

## 在这个规模上，检索质量靠体感而非指标

严肃的系统会跑评估套件。个人知识库有更便宜的工具：问几个你知道答案的问题，读一读检索回来的东西。两种坏味道会立刻现形：

- 正确的块存在，却排在无关内容后面 —— 问题出在嵌入模型或分块方式。
- 模型对上下文里没有的内容侃侃而谈 —— 你的 prompt 没有把它圈住。

第二种才是危险的。这里的 system prompt 明确要求模型在文档没有覆盖时直接说"根据已有文档无法回答"，而不是即兴发挥。会承认无知的助手是功能，不是道歉。

## 流式输出不是装饰

回答通过原生 \`ReadableStream\` 逐 token 流向浏览器，没有用任何库。感知延迟就是问答框的全部体验：三秒白屏与 300 毫秒后开始流出文字，即使总耗时完全相同，也是"坏了"与"活着"的区别。

## 它下一步长向哪里

因为模块拥有自己的 API 路由，升级都是局部的：带关键词过滤的混合检索、对召回块做重排序，或者把博客本身入库 —— 让助手能回答关于这些文章的问题。这一切都不需要动网站的其他部分。`,
  },
};

export default post;
