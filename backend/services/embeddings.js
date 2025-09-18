import { JinaEmbeddings } from "@langchain/community/embeddings/jina";
import dotenv from "dotenv";

dotenv.config();

const embeddings = new JinaEmbeddings({
  apiKey: process.env.JINA_API_KEY,
});

export const getEmbeddings = async (text) => {
  return await embeddings.embedQuery(text);
};
