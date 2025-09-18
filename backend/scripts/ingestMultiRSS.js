import dotenv from "dotenv";
import Parser from "rss-parser";
import { connectDB } from "../config/db.js";
import { getEmbeddings } from "../services/embeddings.js";

dotenv.config();
const parser = new Parser();

// ✅ Multi-feed list (Global + Indian)
const FEEDS = [
  { name: "BBC", url: "http://feeds.bbci.co.uk/news/world/rss.xml" },
  { name: "Guardian", url: "https://www.theguardian.com/world/rss" },
  { name: "Reuters", url: "http://feeds.reuters.com/reuters/topNews" },
  { name: "AlJazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
  { name: "NYTimes", url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml" },
  { name: "NDTV", url: "https://feeds.feedburner.com/ndtvnews-top-stories" },
  { name: "HindustanTimes", url: "https://www.hindustantimes.com/feeds/rss/latest-news/rssfeed.xml" },
  { name: "TheHindu", url: "https://www.thehindu.com/news/national/feeder/default.rss" },
  { name: "IndianExpress", url: "https://indianexpress.com/feed/" },
  { name: "TOI", url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms" },
];

const run = async () => {
  const chroma = await connectDB();

  // ⚡ Disable default embedder
  const collection = await chroma.getOrCreateCollection({
    name: "news-articles",
    embeddingFunction: {
      embedDocuments: async () => {
        throw new Error("Embedding disabled, provide manually.");
      },
      embedQuery: async () => {
        throw new Error("Embedding disabled, provide manually.");
      },
    },
  });

  for (const feed of FEEDS) {
    try {
      console.log(`🌐 Fetching from ${feed.name}...`);
      const parsed = await parser.parseURL(feed.url);
      console.log(`✅ ${feed.name}: ${parsed.items.length} articles found`);

      let i = 0;
      for (const item of parsed.items.slice(0, 10)) { // sirf pehle 10 lete hain
        const text = `${item.title} - ${item.contentSnippet || item.content || ""}`;
        const embedding = await getEmbeddings(text);

        await collection.add({
          ids: [`${feed.name}-${i}`],
          documents: [text],
          embeddings: [embedding],
          metadatas: [{ link: item.link, source: feed.name }],
        });

        console.log(`✅ Ingested (${feed.name}): ${item.title}`);
        i++;
      }
    } catch (err) {
      console.error(`❌ Error fetching ${feed.name}:`, err.message);
    }
  }

  console.log("🎉 Multi-source RSS ingestion complete!");
};

run().catch((e) => {
  console.error("❌ Ingestion error:", e);
  process.exit(1);
});
