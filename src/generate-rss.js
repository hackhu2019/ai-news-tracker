import fs from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateRSS() {
  const dataPath = join(__dirname, '../data/news.json');
  const news = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

  const latestNews = news.slice(0, 50);
  const lastBuildDate = latestNews[0]?.pubDate || new Date().toUTCString();

  const items = latestNews.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid>${item.id}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <category>${item.category}</category>
      <description><![CDATA[${item.summary}]]></description>
      <source url="${item.link}">${item.source}</source>
    </item>`).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI 动态追踪</title>
    <link>https://hackhu2019.github.io/ai-news-tracker/</link>
    <description>聚合 Claude、ChatGPT、Gemini 等一流 AI 模型的最新动态</description>
    <language>zh-cn</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="https://hackhu2019.github.io/ai-news-tracker/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  const outputPath = join(__dirname, '../docs/feed.xml');
  await fs.writeFile(outputPath, rss);

  console.log(`✓ Generated RSS feed with ${latestNews.length} items`);
}

generateRSS().catch(error => {
  console.error('Failed to generate RSS:', error);
  process.exit(1);
});
