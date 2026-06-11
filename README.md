# AI News Tracker

🤖 基于 GitHub Actions 的轻量化 AI 动态追踪服务，自动抓取 Claude、ChatGPT、Gemini 等一流模型的最新动态。

## 特性

- ✅ 自动化抓取：GitHub Actions 每 6 小时自动运行
- ✅ 零服务器成本：完全基于 GitHub 免费服务
- ✅ 静态网页展示：部署在 GitHub Pages
- ✅ 多源聚合：Anthropic、OpenAI、DeepMind、Meta AI
- ✅ 智能去重：基于内容 ID 自动去重
- ✅ 分类筛选：按模型分类查看
- ✅ 搜索功能：关键词搜索标题和内容

## 快速开始

### 1. 克隆仓库

```bash
git clone <your-repo-url>
cd ai-news-tracker
```

### 2. 安装依赖

```bash
npm install
```

### 3. 本地测试

```bash
# 测试抓取功能
npm run fetch

# 预览页面
npm run preview
```

### 4. 部署到 GitHub

```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub
git remote add origin <your-repo-url>
git push -u origin main
```

### 5. 配置 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 `main` 分支
3. 目录选择 `/docs`
4. 保存后等待构建完成

### 6. 触发首次抓取

1. 进入 Actions tab
2. 选择 "Fetch AI News"
3. 点击 "Run workflow" 手动触发

几分钟后访问 `https://<username>.github.io/<repo-name>` 查看效果。

## 添加新的信息源

编辑 `src/fetcher.js`，在 `SOURCES` 数组中添加：

```javascript
{
  name: '源名称',
  url: 'RSS feed URL',
  category: '分类名称'
}
```

## 目录结构

```
.
├── .github/workflows/   # GitHub Actions 配置
├── src/                 # 抓取脚本
│   └── fetcher.js
├── data/                # 数据存储
│   └── news.json
├── docs/                # 静态网页
│   ├── index.html
│   ├── app.js
│   └── style.css
└── README.md
```

## 技术栈

- **抓取**: Node.js + rss-parser
- **调度**: GitHub Actions
- **前端**: 原生 HTML/CSS/JavaScript
- **部署**: GitHub Pages

## License

MIT
