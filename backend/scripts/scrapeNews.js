import axios from "axios";
import * as cheerio from "cheerio";

const scrapeNews = async () => {
  const url = "https://www.theguardian.com/world/rss";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const articles = [];
  $("h3 a").each((i, el) => {
    const title = $(el).text();
    const link = "https://edition.cnn.com" + $(el).attr("href");
    articles.push({ title, link });
  });

  console.log(articles.slice(0, 5));
};

scrapeNews();
