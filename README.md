<div align="center">

# AOG Notes

**一个现代化、快速、美观的 Markdown 笔记框架，基于 Next.js 构建**

[在线演示](https://your-demo-url.com) | [文档](https://your-docs-url.com) | [问题反馈](https://github.com/7788dev/aog-notes/issues)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## 特性

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

## 文档

详细使用文档请查看 [data/](./data) 目录：

- [介绍](./data/01-快速开始/01-介绍.md) - 项目简介与特性
- [安装](./data/01-快速开始/02-安装.md) - 环境搭建与安装步骤
- [配置](./data/01-快速开始/03-配置.md) - 完整配置说明
- [写作指南](./data/02-使用指南/01-写作指南.md) - Markdown 写作规范
- [部署指南](./data/03-部署/01-部署指南.md) - 各平台部署教程

## 部署

### Vercel（推荐）

1. Fork 本仓库到你的 GitHub 账号
2. 修改 `site.config.ts` 配置文件（网站名称、URL 等）
3. 登录 [Vercel](https://vercel.com)，点击 "New Project"
4. 导入你 Fork 的仓库
5. 点击 "Deploy" 即可

### GitHub Pages

1. Fork 本仓库
2. 进入仓库 Settings > Pages
3. Source 选择 "GitHub Actions"
4. 在 `.github/workflows/` 目录创建部署工作流（见下方示例）
5. 推送代码后自动部署

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

注意：使用 GitHub Pages 需要在 `next.config.ts` 中配置 `output: 'export'`。

### 静态导出

```bash
npm run build
# 输出在 `out/` 目录，可部署到任意静态托管服务
```

## 技术栈

| 技术 | 说明 |
|------|------|
| [Next.js 16](https://nextjs.org/) | React 全栈框架 |
| [Tailwind CSS 4](https://tailwindcss.com/) | 原子化 CSS |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [React Markdown](https://github.com/remarkjs/react-markdown) | Markdown 渲染 |
| [Prism](https://prismjs.com/) | 代码高亮 |

## 项目结构

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

## 贡献

欢迎贡献代码！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

<div align="center">

**如果这个项目对你有帮助，请给个 Star**

Made with love

</div>
