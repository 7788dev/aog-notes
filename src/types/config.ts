/**
 * AOG Notes 配置类型定义
 */

export interface SiteConfig {
  // 基本信息
  name: string
  title: string
  description: string
  url: string
  version: string

  // 品牌
  logo?: {
    text?: string
    image?: string // Logo 图片路径，如 '/logo.svg'
  }
  favicon?: string // Favicon 路径，如 '/logo.svg'
  themeColor: string

  // SEO 配置
  seo: {
    enabled: boolean
    keywords: string[]
    author: string
    robots?: string
    googleVerification?: string
    baiduVerification?: string
    ogImage?: boolean // 是否启用 Open Graph 图片
  }

  // 功能开关
  features: {
    search: boolean
    favorites: boolean
    darkMode: boolean
    articleNav: boolean
    rss: boolean // RSS 订阅
    readingTime: boolean // 阅读时间估算
    tags: boolean // 标签系统
    pwa: boolean // PWA 支持
  }

  // 笔记目录
  dataDir: string

  // 社交链接
  social?: {
    github?: string
    twitter?: string
    email?: string
  }

  // 页脚
  footer?: {
    copyright?: string // 版权名称，年份自动获取
    links?: { name: string; url: string }[]
    showPoweredBy?: boolean
  }

  // 自定义代码
  customCode?: {
    headScript?: string
    bodyScript?: string
    css?: string
  }

  // URL 配置
  url_config?: {
    pathStyle?: 'default' | 'flat' | 'date' | 'category'
    trailingHtml?: boolean
    trailingSlash?: boolean
    removeNumberPrefix?: boolean
    basePath?: string
    lowercase?: boolean
    slugify?: boolean
  }

  // 部署配置
  deploy?: {
    // GitHub Pages 部署时自动从 GITHUB_REPOSITORY 获取仓库名作为 basePath
    // 设为 true 启用自动检测，设为 false 禁用
    githubPagesAutoBasePath?: boolean
  }

  // 高级配置
  advanced?: {
    locale?: string
    wordsPerMinute?: number // 阅读速度，用于计算阅读时间
  }
}
