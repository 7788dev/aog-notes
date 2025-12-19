/**
 * AOG Notes 配置文件
 *
 * 修改此文件来自定义你的笔记网站
 * 所有配置项都有详细注释，按需修改即可
 */

import type { SiteConfig } from './src/types/config'

const siteConfig: SiteConfig = {
  // ============================================================
  // 基本信息
  // ============================================================

  // 网站名称，显示在浏览器标签页和页脚
  name: 'AOG Notes',

  // 网站标题，用于 SEO 和浏览器标签页
  title: 'AOG Notes | Markdown 笔记框架',

  // 网站描述，用于 SEO 和社交分享
  description: '一个简洁优雅的 Markdown 笔记框架，支持全文搜索、收藏、深色模式等功能。',

  // 网站正式域名，用于生成 sitemap 和 RSS
  // 部署后请修改为你的实际域名
  url: 'https://your-domain.com',

  // 版本号，显示在页面顶部
  version: 'v1.0.0',

  // ============================================================
  // 品牌设置
  // ============================================================

  // Logo 配置
  // text: 显示的文字
  // image: 图片路径（可选），如 '/logo.svg'，设置后会显示图片而非文字
  logo: {
    text: 'AOG Notes',
    // image: '/logo.svg',
  },

  // Favicon 图标路径
  // 默认使用 /logo.svg，可以修改为其他图片
  // 支持 SVG、PNG、ICO 格式
  favicon: '/logo.svg',

  // 主题色，影响整个网站的强调色
  // 推荐色值：
  // - #16b777 绿色（默认）- 清新自然
  // - #3b82f6 蓝色 - 专业稳重
  // - #8b5cf6 紫色 - 优雅神秘
  // - #f97316 橙色 - 活力热情
  // - #ef4444 红色 - 醒目强烈
  // - #06b6d4 青色 - 清爽现代
  themeColor: '#16b777',

  // ============================================================
  // SEO 配置
  // ============================================================

  seo: {
    // 是否启用 SEO 功能
    // 设为 false 可关闭所有 SEO 相关功能（适合内部文档）
    enabled: true,

    // 网站关键词，用于搜索引擎优化
    keywords: ['笔记', '知识管理', '学习笔记', 'Markdown', '个人博客', 'Next.js'],

    // 作者名称
    author: 'AOG Notes',

    // 搜索引擎爬取规则
    // 'index, follow' - 允许索引和跟踪链接
    // 'noindex, nofollow' - 禁止索引和跟踪
    robots: 'index, follow',

    // Google 站点验证码（可选）
    // 在 Google Search Console 获取
    // googleVerification: 'your-google-verification-code',

    // 百度站点验证码（可选）
    // 在百度站长平台获取
    // baiduVerification: 'your-baidu-verification-code',

    // 是否启用 Open Graph 图片
    // 启用后社交分享时会显示 public/og-image.svg 图片
    // 如需自定义 OG 图片，请替换 public/og-image.svg 文件
    ogImage: true,
  },

  // ============================================================
  // 功能开关
  // ============================================================

  features: {
    // 全文搜索
    // 基于 BM25 算法，支持中文分词
    search: true,

    // 收藏功能
    // 数据保存在浏览器本地存储
    favorites: true,

    // 深色模式
    // 支持浅色/深色/跟随系统三种模式
    darkMode: true,

    // 文章导航
    // 在文章底部显示上一篇/下一篇
    articleNav: true,

    // RSS 订阅
    // 自动生成 /feed.xml
    rss: true,

    // 阅读时间估算
    // 根据字数自动计算预估阅读时间
    readingTime: true,

    // 标签系统
    // 在 Markdown frontmatter 中添加 tags 字段
    tags: true,

    // PWA 支持
    // 支持安装到桌面和离线访问
    // 需要在 public 目录放置 icon-192.svg 和 icon-512.svg
    pwa: true,
  },

  // ============================================================
  // 笔记目录
  // ============================================================

  // Markdown 笔记存放目录
  // 相对于项目根目录
  dataDir: 'data',

  // ============================================================
  // 社交链接
  // ============================================================

  social: {
    // GitHub 链接
    github: 'https://github.com/7788dev/aog-notes',

    // Twitter 链接（可选）
    // twitter: 'https://twitter.com/your-username',

    // 邮箱（可选）
    // email: 'your-email@example.com',
  },

  // ============================================================
  // 页脚配置
  // ============================================================

  footer: {
    // 版权名称，年份会自动获取当前年份
    // 显示为：© 2024 AOG Notes
    copyright: 'AOG Notes',

    // 页脚链接
    links: [{ name: 'GitHub', url: 'https://github.com/7788dev/aog-notes' }],

    // 是否显示 "Powered by AOG Notes"
    showPoweredBy: true,
  },

  // ============================================================
  // 自定义代码
  // ============================================================

  customCode: {
    // 插入到 <head> 中的代码
    // 适合添加统计代码、字体等
    // headScript: `
    //   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"></script>
    //   <script>
    //     window.dataLayer = window.dataLayer || [];
    //     function gtag(){dataLayer.push(arguments);}
    //     gtag('js', new Date());
    //     gtag('config', 'G-XXXXXX');
    //   </script>
    // `,

    // 插入到 </body> 前的代码
    // bodyScript: `<script src="https://example.com/custom.js"></script>`,

    // 自定义 CSS 样式
    // css: `
    //   .prose h2 { color: #16b777; }
    //   .custom-class { font-weight: bold; }
    // `,
  },

  // ============================================================
  // URL 配置
  // ============================================================

  url_config: {
    // URL 路径样式
    // 'default'  - /notes/article（默认）
    // 'flat'     - /article（扁平化）
    // 'date'     - /2024/01/article（按日期）
    // 'category' - /category-slug/article（按分类）
    pathStyle: 'default',

    // 是否添加 .html 后缀
    // true: /notes/article.html
    // false: /notes/article（默认）
    trailingHtml: false,

    // 是否添加尾部斜杠
    // true: /notes/article/
    // false: /notes/article（默认）
    trailingSlash: false,

    // 是否去除文件名中的数字前缀
    // true: 01-快速开始 → 快速开始（默认）
    // false: 保留数字前缀
    removeNumberPrefix: true,

    // 路径前缀（Vercel 子路径部署时使用）
    // 例如部署到 example.com/docs，设置为 '/docs'
    // GitHub Pages 会自动从仓库名获取，无需设置
    basePath: '',

    // 是否将 URL 转为小写
    lowercase: false,

    // 是否启用 slugify（中文转拼音）
    slugify: true,
  },

  // ============================================================
  // 部署配置
  // ============================================================

  deploy: {
    // GitHub Pages 自动 basePath 检测
    // 启用后会自动从仓库名获取 basePath
    // 例如仓库 username/my-notes → basePath 为 /my-notes
    // 设为 false 可禁用自动检测
    githubPagesAutoBasePath: true,
  },

  // ============================================================
  // 高级配置
  // ============================================================

  advanced: {
    // 界面语言
    // 'zh-CN' - 简体中文（默认）
    // 'en' - English
    locale: 'zh-CN',

    // 阅读速度（字/分钟）
    // 用于计算预估阅读时间
    wordsPerMinute: 200,
  },
}

export default siteConfig
