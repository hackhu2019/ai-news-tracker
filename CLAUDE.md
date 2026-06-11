# AI News Tracker

基于 GitHub Actions 的轻量化 AI 动态追踪服务，自动抓取 Claude、ChatGPT 等一流模型的更新动态，部署在 GitHub Pages。

## 项目结构

```
.
├── .github/workflows/    # GitHub Actions 定时任务
├── src/                  # 抓取脚本
├── data/                 # 数据存储（JSON）
├── docs/                 # GitHub Pages 静态页面
├── CLAUDE.md            # 本文件
└── README.md
```

## 目录约定

### `/src`
- `fetcher.js`: 核心抓取逻辑，负责从多个 RSS 源获取数据
- 所有源配置写在 `SOURCES` 常量中
- 添加新的信息源只需在 `SOURCES` 数组中添加配置

### `/data`
- `news.json`: 唯一数据文件，存储所有新闻条目
- 格式: `[{ id, title, link, pubDate, source, category, summary }]`
- 只保留最近 200 条记录
- 由 GitHub Actions 自动更新，**禁止手动编辑**

### `/docs`
- GitHub Pages 根目录
- `index.html`: 主页面
- `app.js`: 前端逻辑（加载数据、筛选、渲染）
- `style.css`: 样式文件
- 所有静态资源放这里

## 开发规范

### 添加新的信息源
1. 在 `src/fetcher.js` 的 `SOURCES` 数组添加配置
2. 必须包含: `name`, `url`, `category`
3. 本地测试: `node src/fetcher.js`
4. 确认 `data/news.json` 正确更新后提交

### 修改抓取逻辑
- 去重逻辑基于 `id` 字段（优先使用 `guid`，降级到 `link`）
- 时间排序: 新的在前
- 只保留最近 200 条，超出自动截断

### 前端修改
- 样式修改只在 `docs/style.css`
- 交互逻辑只在 `docs/app.js`
- 不要在 HTML 中写内联样式或脚本

### GitHub Actions
- 默认每 6 小时运行一次
- 可在 Actions tab 手动触发
- 失败不会阻塞，下次运行继续

## 部署流程

### 首次部署
1. 推送到 GitHub
2. Settings → Pages → Source 选择 `main` 分支的 `/docs` 目录
3. Actions tab → "Fetch AI News" → Run workflow 手动触发首次抓取
4. 等待 GitHub Pages 构建完成（约 1-2 分钟）

### 日常维护
- GitHub Actions 自动运行，无需干预
- 有新数据时自动 commit 到 `data/news.json`

## 验证命令

```bash
# 本地测试抓取
node src/fetcher.js

# 检查数据格式
cat data/news.json | head -n 50

# 本地预览页面（需要 HTTP 服务器）
npx serve docs
```

## 红线

- 不要手动编辑 `data/news.json`
- 不要修改 GitHub Actions 的 git 配置
- 添加新依赖前先评估是否必要（保持轻量）
