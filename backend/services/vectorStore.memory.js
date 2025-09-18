import { getEmbeddings } from "./embeddings.js";

// simple in-memory store
const store = []; // [{ id, text, embedding }]

// cosine similarity
const cosSim = (a, b) => {
  let dot=0, na=0, nb=0;
  for (let i=0;i<a.length;i++){ dot+=a[i]*b[i]; na+=a[i]*a[i]; nb+=b[i]*b[i]; }
  return dot / (Math.sqrt(na)*Math.sqrt(nb) || 1);
};

export const addDocumentsMem = async (docs) => {
  for (const { id, text } of docs) {
    const emb = await getEmbeddings(text);
    store.push({ id, text, embedding: emb });
  }
  return store.length;
};

export const queryVectorStoreMem = async (query, k=3) => {
  const qEmb = await getEmbeddings(query);
  const ranked = store
    .map((r) => ({ doc: r.text, score: 1 - cosSim(qEmb, r.embedding) })) // lower = better distance
    .sort((a,b) => a.score - b.score)
    .slice(0,k)
    .map((r) => ({ pageContent: r.doc, score: r.score }));
  return ranked;
};
