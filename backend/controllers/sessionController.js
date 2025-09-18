import { connectRedis } from "../config/redis.js";

let redisClient;
(async () => {
  redisClient = await connectRedis();
})();

const redisKey = (userId, sessionId) => `chat:${userId}:${sessionId}`;

export const getSession = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ from protect middleware
    const { sessionId } = req.params;
    const key = redisKey(userId, sessionId);

    const historyRaw = await redisClient.get(key);
    const history = historyRaw ? JSON.parse(historyRaw) : [];

    res.json({ sessionId, history });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch session history" });
  }
};

export const clearSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { sessionId } = req.params;
    const key = redisKey(userId, sessionId);

    await redisClient.del(key);
    res.json({ message: "Session cleared", sessionId });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear session" });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await redisClient.hGetAll(`user:${userId}:sessions`);
    // sessions object: { "sess-123abc": "What is Gaza?", "sess-987xyz": "Tell me about India?" }

    res.json({ userId, sessions });
  } catch (err) {
    console.error("❌ getAllSessions:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};
