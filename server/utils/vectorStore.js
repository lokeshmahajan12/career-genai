export const cosineSim = (a = [], b = []) => {
  const dot = a.reduce((s, v, i) => s + v * (b[i] || 0), 0);
  const na = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const nb = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return na && nb ? dot / (na * nb) : 0;
};

export const topK = (queryEmbedding, docs, k = 5) =>
  docs
    .map((d) => ({ ...d, score: cosineSim(queryEmbedding, d.embedding || d.memoryEmbedding || []) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
