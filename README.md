<div align="center">

# AOG Notes

**一个现代化、快速、美观的 Markdown 笔记框架，基于 Next.js 构建**

[在线演示](https://your-demo-url.com) | [文档](https://your-docs-url.com) | [问题反馈](https://github.com/your-username/aog-notes/issues)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## ✨ 特性

- **零配置启动** - 克隆项目，添加 Markdown 文件，即可拥有专业笔记网站
- **极致性能** - 基于 Next.js 静态生成，首屏加载极快
- **全文搜索** - 内置 BM25 搜索引擎，支持中文分词
- **深色模式** - 支持浅色/深色/跟随系统三种模式
- **响应式设计** - 完美适配桌面端和移动端
- **SEO 友好** - 自动生成 sitemap 和结构化数据
- **RSS 订阅** - 自动生成 RSS feed
- **标签系统** - 支持文章标签分类
- **阅读时间** - 自动估算文章阅读时间
- **评论系统** - 支持 Giscus、Utterances、Disqus
- **PWA 支持** - 可安装到桌面，支持离线访问
- **国际化** - 支持中文/英文切换

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/your-username/aog-notes.git

# 进入目录
cd aog-notes

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 📝 添加笔记

在 `data/` 目录下创建 Markdown 文件：

```
data/
├── 01-快速开始/
│   ├── 01-介绍.md
│   └── 02-安装.md
└── 02-使用指南/
    └── 01-写作指南.md
```

数字前缀控制排序，显示时会自动去除。

### Frontmatter 支持

```yaml
---
title: 文章标题
tags:
  - JavaScript
  - React
date: 2024-12-19
---

# 正文内容
```

## ⚙️ 配置

编辑 `site.config.ts` 自定义网站：

```typescript
const siteConfig = {
  name: '我的笔记',
  title: '我的笔记 | 知识库',
  description: '个人技术笔记与知识分享',
  url: 'https://notes.example.com',
  themeColor: '#16b777',
  
  features: {
    search: true,      // 全文搜索
    favorites: true,   // 收藏功能
    darkMode: true,    // 深色模式
    rss: true,         // RSS 订阅
    readingTime: true, // 阅读时间
    tags: true,        // 标签系统
    pwa: true,         // PWA 支持
  },
  
  // 评论系统（可选）
  comments: {
    enabled: true,
    provider: 'giscus',
    giscus: {
      repo: 'your-username/your-repo',
      repoId: 'R_xxxxx',
      category: 'Announcements',
      categoryId: 'DIC_xxxxx',
    },
  },
}
```

## 🌐 部署

### Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/aog-notes)

### Docker

```bash
docker build -t aog-notes .
docker run -p 3000:3000 aog-notes
```

### 静态导出

```bash
npm run build
# 输出在 `out/` 目录
```

## 🛠 技术栈

| 技术 | 说明 |
|------|------|
| [Next.js 16](https://nextjs.org/) | React 全栈框架 |
| [Tailwind CSS 4](https://tailwindcss.com/) | 原子化 CSS |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [React Markdown](https://github.com/remarkjs/react-markdown) | Markdown 渲染 |
| [Prism](https://prismjs.com/) | 代码高亮 |

## 📁 项目结构

```
aog-notes/
├── data/                 # Markdown 笔记目录
├── public/               # 静态资源
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React 组件
│   ├── lib/              # 工具函数
│   └── types/            # 类型定义
├── site.config.ts        # 网站配置
└── package.json
```

## 🤝 贡献

欢迎贡献代码！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

<div align="center">

**如果这个项目对你有帮助，请给个 Star ⭐**

Made with ❤️

</div>
