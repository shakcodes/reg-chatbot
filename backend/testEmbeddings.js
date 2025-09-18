import { getEmbeddings } from "./services/embeddings.js";

const run = async () => {
  const vector = await getEmbeddings("Hello world!");
  console.log("🔹 Embedding vector length:", vector.length);
};

run();
