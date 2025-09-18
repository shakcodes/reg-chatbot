import Parser from "rss-parser";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { getEmbeddings } from "../services/embeddings.js";

dotenv.config();

const parser = new Parser();

const runIngestion = async () => {
  try {
    // 1. Connect to Chroma
    const chroma = await connectDB();

    const collection = await chroma.getOrCreateCollection({
      name: "news-articles",
      embedding_function: null, // disable default
    });

    // 2. Fetch ~50 news articles from RSS
    console.log("📡 Fetching RSS feed...");
    const feed = await parser.parseURL("https://rss.cnn.com/rss/edition.rss");

    // 3. Limit to 50 articles
    const articles = feed.items.slice(0, 50);

    console.log(`📰 Found ${articles.length} articles`);

    // 4. Insert each article with embeddings
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const text = `${article.title}\n\n${article.contentSnippet || ""}`;

      // Generate embedding
      const embedding = await getEmbeddings(text);

      // Add to collection
      await collection.add({
        ids: [`article-${i}`],
        documents: [text],
        embeddings: [embedding],
      });

      console.log(`✅ Ingested: ${article.title}`);
    }

    console.log("🎉 Ingestion complete!");

  } catch (err) {
    console.error("❌ Ingestion error:", err);
  }
};

runIngestion();
