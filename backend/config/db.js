// config/db.js
import { ChromaClient } from "chromadb";

export const connectDB = async () => {
  const client = new ChromaClient({
    host: "127.0.0.1",
    port: 8000,
    ssl: false,
  });

  // Optional: heartbeat check (fail fast)
  try {
    const hb = await client.heartbeat();
    console.log("✅ Chroma heartbeat:", hb);
  } catch (e) {
    console.error("❌ Could not reach Chroma at 127.0.0.1:8000");
    throw e;
  }

  console.log("✅ Connected to Chroma Vector Store");
  return client;
};
