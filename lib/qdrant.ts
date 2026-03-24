import { QdrantClient } from "@qdrant/js-client-rest";

export const COLLECTION_NAME = "documents";
const VECTOR_SIZE = 1536; // text-embedding-3-small 的输出维度

export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:6333",
  apiKey: process.env.QDRANT_API_KEY,
});

export async function ensureCollection() {
  const { exists } = await qdrant.collectionExists(COLLECTION_NAME);
  if (!exists) {
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: { size: VECTOR_SIZE, distance: "Cosine" },
    });
  }
}
