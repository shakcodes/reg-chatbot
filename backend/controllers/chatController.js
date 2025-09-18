import { queryVectorStore } from "../services/vectorStore.js";
import { generateLLMResponse } from "../services/llm.js";
import { connectRedis } from "../config/redis.js";
import crypto from "crypto";

let redisClient;
(async () => {
  redisClient = await connectRedis();
})();

// Helper: make short hash from question
function getSessionIdFromQuestion(question) {
  return "sess-" + crypto.createHash("md5").update(question).digest("hex").slice(0, 8);
}

export const chatWithBot = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ from protect middleware
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: "Question is required" });
    }

    // 1) Generate sessionId from question hash
    const sessionId = getSessionIdFromQuestion(question);

    // 2) Fetch context from Chroma
    const results = await queryVectorStore(question, 3);
    const context = results.map(r => r.pageContent).join("\n\n");

    // 3) LLM answer
    const answer = await generateLLMResponse(question, context);

    // 4) Fetch previous history (if any)
    const key = `chat:${userId}:${sessionId}`;
    const prevHistoryRaw = await redisClient.get(key);
    const prevHistory = prevHistoryRaw ? JSON.parse(prevHistoryRaw) : [];

    const newHistory = [
      ...prevHistory,
      { role: "user", content: question },
      { role: "bot", content: answer }
    ];

    // 5) Save chat history in Redis (expire in 24h)
    await redisClient.set(key, JSON.stringify(newHistory), { EX: 60 * 60 * 24 });

    // 6) Save session list (store first question as title)
    if (prevHistory.length === 0) {
      await redisClient.hSet(`user:${userId}:sessions`, sessionId, question);
    }

    // 7) Response
    res.json({ success: true, sessionId, answer, context, history: newHistory });
  } catch (e) {
    console.error("❌ chatWithBot:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};
