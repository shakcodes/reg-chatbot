import { createClient } from "redis";

const client = createClient();
client.on("error", (err) => console.error("Redis error:", err));
await client.connect();

export async function saveMessage(sessionId, role, content) {
  const key = `chat:${sessionId}`;
  const message = JSON.stringify({ role, content, ts: Date.now() });
  await client.rPush(key, message);
}

export async function getHistory(sessionId) {
  const key = `chat:${sessionId}`;
  const messages = await client.lRange(key, 0, -1);
  return messages.map((msg) => JSON.parse(msg));
}

export async function clearHistory(sessionId) {
  const key = `chat:${sessionId}`;
  await client.del(key);
}
