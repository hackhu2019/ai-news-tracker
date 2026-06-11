let allNews = [];
let currentCategory = 'all';
let searchQuery = '';

async function loadNews() {
  try {
    const response = await fetch('data/news.json');
    allNews = await response.json();
    document.getElementById('loading').style.display = 'none';
    renderNews();
  } catch (error) {
    console.error('Failed to load news:', error);
    document.getElementById('loading').textContent = '加载失败，请刷新重试';
  }
}

function filterNews() {
  let filtered = allNews;

  // 分类筛选
  if (currentCategory !== 'all') {
    filtered = filtered.filter(item => item.category === currentCategory);
  }

  // 搜索筛选
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query)
    );
  }

  return filtered;
}

function renderNews() {
  const filtered = filterNews();
  const newsList = document.getElementById('news-list');
  const noResults = document.getElementById('no-results');

  if (filtered.length === 0) {
    newsList.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }

  newsList.style.display = 'block';
  noResults.style.display = 'none';

  const html = filtered.map(item => {
    const date = new Date(item.pubDate);
    const dateStr = date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <article class="news-item">
        <div class="news-header">
          <span class="category category-${item.category.replace(/\s+/g, '-')}">${item.category}</span>
          <span class="date">${dateStr}</span>
        </div>
        <h2 class="news-title">
          <a href="${item.link}" target="_blank" rel="noopener">${item.title}</a>
        </h2>
        ${item.summary ? `<p class="summary">${item.summary}</p>` : ''}
        <div class="source">来源: ${item.source}</div>
      </article>
    `;
  }).join('');

  newsList.innerHTML = html;
}

// 分类筛选
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelector('.filter-btn.active')?.classList.remove('active');
    e.target.classList.add('active');
    currentCategory = e.target.dataset.category;
    renderNews();
  });
});

// 搜索功能
const searchInput = document.getElementById('search-input');
let searchTimeout;

searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchQuery = e.target.value.trim();
    renderNews();
  }, 300);
});

// 初始化
loadNews();
