// services/vectorStore.js
import { connectDB } from "../config/db.js";
import { getEmbeddings } from "./embeddings.js";

const chroma = await connectDB();

// No-op embedder: Chroma ko default embedder load karne se roke
const noOpEmbeddingFunction = {
  embedDocuments: async () => {
    throw new Error("No embedder configured. Provide embeddings explicitly.");
  },
  embedQuery: async () => {
    throw new Error("No embedder configured. Provide embeddings explicitly.");
  },
};

export const queryVectorStore = async (query, k = 3) => {
  // 1) Jina se query embedding banao
  const embedding = await getEmbeddings(query);

  // 2) HAMESHA embeddingFunction pass karo (camelCase!)
  const collection = await chroma.getOrCreateCollection({
    name: "news-articles",
    embeddingFunction: noOpEmbeddingFunction,
  });

  // 3) Query with your own vectors
  const results = await collection.query({
    queryEmbeddings: [embedding],
    nResults: k,
  });

  // 4) Normalized output
  return results.documents[0].map((doc, i) => ({
    pageContent: doc,
    score: results.distances[0][i],
  }));
};
