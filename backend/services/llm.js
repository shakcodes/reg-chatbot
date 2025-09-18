import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔹 Simple call: sirf query bhejna
export const askGemini = async (query) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(query);
  return result.response.text();
};

// 🔹 Advanced call: context + question (RAG pipeline ke liye)
export const generateLLMResponse = async (question, context) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a helpful assistant.
Context:
${context}

Question: ${question}
Answer:`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
