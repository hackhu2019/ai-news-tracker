import Parser from 'rss-parser';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const parser = new Parser({
  timeout: 20000,
  headers: {
    'User-Agent': 'AI-News-Tracker/1.0'
  }
});

const SOURCES = [
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'ChatGPT'
  },
  {
    name: 'Google DeepMind Blog',
    url: 'https://deepmind.google/blog/rss.xml',
    category: 'Gemini'
  },
  {
    name: 'TechCrunch - Anthropic',
    url: 'https://techcrunch.com/tag/anthropic/feed/',
    category: 'Claude'
  },
  {
    name: 'TechCrunch - xAI',
    url: 'https://techcrunch.com/tag/xai/feed/',
    category: 'Grok'
  },
  {
    name: 'TechCrunch - Mistral AI',
    url: 'https://techcrunch.com/tag/mistral-ai/feed/',
    category: 'Mistral'
  },
  {
    name: 'TechCrunch - DeepSeek',
    url: 'https://techcrunch.com/tag/deepseek/feed/',
    category: 'China AI'
  },
  {
    name: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    category: 'Open Source'
  }
];

async function fetchAllNews() {
  const allNews = [];

  for (const source of SOURCES) {
    try {
      console.log(`Fetching ${source.name}...`);
      const feed = await parser.parseURL(source.url);

      feed.items.forEach(item => {
        allNews.push({
          id: item.guid || item.link,
          title: item.title,
          link: item.link,
          pubDate: item.pubDate || item.isoDate,
          source: source.name,
          category: source.category,
          summary: item.contentSnippet?.slice(0, 200) || ''
        });
      });

      console.log(`✓ ${source.name}: ${feed.items.length} items`);
    } catch (error) {
      console.error(`✗ Failed to fetch ${source.name}:`, error.message);
    }
  }

  return allNews;
}

async function main() {
  console.log('Starting to fetch AI news...\n');

  const newItems = await fetchAllNews();

  // 读取现有数据
  let existing = [];
  const dataPath = join(__dirname, '../data/news.json');

  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    existing = JSON.parse(data);
    console.log(`\nLoaded ${existing.length} existing items`);
  } catch (error) {
    console.log('\nNo existing data found, initializing...');
  }

  // 去重（基于ID）
  const existingIds = new Set(existing.map(item => item.id));
  const toAdd = newItems.filter(item => !existingIds.has(item.id));

  console.log(`Found ${toAdd.length} new items`);

  // 合并并按时间排序
  const merged = [...toAdd, ...existing]
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, 200); // 只保留最近200条

  await fs.writeFile(dataPath, JSON.stringify(merged, null, 2));

  console.log(`\n✓ Saved ${merged.length} total items to data/news.json`);

  if (toAdd.length > 0) {
    console.log('\nNew items:');
    toAdd.slice(0, 5).forEach(item => {
      console.log(`  - [${item.category}] ${item.title}`);
    });
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
