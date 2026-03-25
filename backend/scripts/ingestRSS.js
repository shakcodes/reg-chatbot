import dotenv from "dotenv";
import Parser from "rss-parser";
import { connectDB } from "../config/db.js";
import { getEmbeddings } from "../services/embeddings.js";

dotenv.config();

const RSS_URL = "http://feeds.bbci.co.uk/news/rss.xml"; // apna RSS feed link

// No-op embedder to bypass Chroma default embedder
const noOpEmbeddingFunction = {
  embedDocuments: async () => {
    throw new Error("Embeddings must be provided explicitly.");
  },
  embedQuery: async () => {
    throw new Error("Embeddings must be provided explicitly.");
  },
};

const run = async () => {
  const parser = new Parser();
  const feed = await parser.parseURL(RSS_URL);

  console.log(`Fetched ${feed.items.length} articles from RSS`);

  const chroma = await connectDB();
  const collection = await chroma.getOrCreateCollection({
    name: "news-articles",
    embeddingFunction: noOpEmbeddingFunction, // force manual embeddings
  });

  let i = 0;
  for (const item of feed.items.slice(0, 10)) { // sirf 10 articles for testing
    const text = `${item.title} - ${item.contentSnippet || item.content || ""}`;
    const embedding = await getEmbeddings(text);

    await collection.add({
      ids: [`rss-${i}`],
      documents: [text],
      embeddings: [embedding],
      metadatas: [{ link: item.link }],
    });

    console.log(`Ingested: ${item.title}`);
    i++;
  }

  console.log("RSS ingestion complete!");
};

run().catch((e) => {
  console.error("Ingestion error:", e);
  process.exit(1);
});
