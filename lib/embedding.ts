import OpenAI from "openai";

function getClient() {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
  });
}

export async function getEmbedding(text: string): Promise<number[]> {
  const res = await getClient().embeddings.create({
    model: "openai/text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const res = await getClient().embeddings.create({
    model: "openai/text-embedding-3-small",
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}
