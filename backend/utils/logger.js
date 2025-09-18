export const log = (msg, level = "info") => {
  const timestamp = new Date().toISOString();
  console.log(`[${level.toUpperCase()}] ${timestamp}: ${msg}`);
};
