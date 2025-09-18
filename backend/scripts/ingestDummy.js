import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { getEmbeddings } from "../services/embeddings.js";

dotenv.config();

// 👇 no-op embedder: default embedder ko disable kar deta hai
const noOpEmbeddingFunction = {
  embedDocuments: async () => {
    throw new Error("No embedder configured. Provide embeddings explicitly.");
  },
  embedQuery: async () => {
    throw new Error("No embedder configured. Provide embeddings explicitly.");
  },
};

const docs = [
  { id: "1", text: "Retrieval-Augmented Generation (RAG) combines search over external knowledge with LLMs to improve factuality." },
  { id: "2", text: "LangChain is a framework to build LLM apps with chains, agents, memory, and vector stores." },
  { id: "3", text: "Gemini 1.5 Flash is a fast, cost-efficient Google model suitable for chat and RAG." },
  { id: "4", text: "Chroma is an open-source vector database that stores embeddings and metadata." },
  { id: "5", text: "Jina embeddings provide sentence-level vectors suitable for semantic search." },
];

const run = async () => {
  const chroma = await connectDB();

  // ❗️Use `embeddingFunction` (camelCase), not embedding_function
  const collection = await chroma.getOrCreateCollection({
    name: "news-articles",
    embeddingFunction: noOpEmbeddingFunction,
  });

  for (const d of docs) {
    const emb = await getEmbeddings(d.text);
    await collection.add({
      ids: [d.id],
      documents: [d.text],
      embeddings: [emb], // 👈 hum khud embeddings de rahe hain
    });
    console.log("✅ Ingested:", d.id);
  }

  console.log("🎉 Dummy ingestion complete");
};

run().catch((e) => {
  console.error("❌ Ingestion error:", e);
  process.exit(1);
});
