/**
 * AOG Notes 配置文件
 * 修改此文件来自定义你的笔记网站
 */

import type { SiteConfig } from './src/types/config'

const siteConfig: SiteConfig = {
  // ========== 基本信息 ==========
  name: 'AOG Notes',
  title: 'AOG Notes | Markdown 笔记框架',
  description: '一个简洁优雅的 Markdown 笔记框架，支持全文搜索、收藏、深色模式等功能。',
  url: 'https://your-domain.com',
  version: 'v1.0.0',

  // ========== 品牌 ==========
  logo: { text: 'AOG Notes' },
  themeColor: '#16b777',

  // ========== SEO 配置 ==========
  seo: {
    enabled: true,
    keywords: ['笔记', '知识管理', '学习笔记', 'Markdown', '个人博客', 'Next.js'],
    author: 'AOG Notes',
    robots: 'index, follow',
    // googleVerification: 'your-google-verification-code',
    // baiduVerification: 'your-baidu-verification-code',
  },

  // ========== 功能开关 ==========
  features: {
    search: true,
    favorites: true,
    darkMode: true,
    toc: false,
    codeLineNumbers: false,
    articleNav: true,
    breadcrumb: true,
    rss: true,           // RSS 订阅
    readingTime: true,   // 阅读时间估算
    tags: true,          // 标签系统
    pwa: true,           // PWA 支持
  },

  // ========== 评论系统 ==========
  // comments: {
  //   enabled: true,
  //   provider: 'giscus',
  //   giscus: {
  //     repo: 'your-username/your-repo',
  //     repoId: 'your-repo-id',
  //     category: 'Announcements',
  //     categoryId: 'your-category-id',
  //   },
  // },

  // ========== 笔记目录 ==========
  dataDir: 'data',

  // ========== 社交链接 ==========
  social: {
    github: 'https://github.com/7788dev/aog-notes',
    // twitter: 'https://twitter.com/your-username',
    // email: 'your-email@example.com',
  },

  // ========== 页脚 ==========
  footer: {
    copyright: 'AOG Notes',  // 版权名称，年份自动获取
    links: [{ name: 'GitHub', url: 'https://github.com/7788dev/aog-notes' }],
    showPoweredBy: true,
  },

  // ========== 自定义代码 ==========
  customCode: {
    // headScript: `<script>...</script>`,
    // bodyScript: `<script>...</script>`,
    // css: `.custom { color: red; }`,
  },

  // ========== URL 配置 ==========
  url_config: {
    pathStyle: 'default',      // 'default' | 'flat' | 'date' | 'category'
    trailingHtml: false,       // /article.html
    trailingSlash: false,      // /article/
    removeNumberPrefix: true,  // 01-快速开始 -> 快速开始
    basePath: '',              // 路径前缀如 /docs
    lowercase: false,
    slugify: true,
  },

  // ========== 高级配置 ==========
  advanced: {
    locale: 'zh-CN',
    dateFormat: 'YYYY-MM-DD',
    notesPerPage: 50,
    wordsPerMinute: 200,  // 阅读速度
  },
}

export default siteConfig
