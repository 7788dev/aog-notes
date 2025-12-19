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
    icon?: string
  }
  themeColor: string

  // SEO 配置
  seo: {
    enabled: boolean
    keywords: string[]
    author: string
    robots?: string
    googleVerification?: string
    baiduVerification?: string
  }

  // 功能开关
  features: {
    search: boolean
    favorites: boolean
    darkMode: boolean
    toc: boolean
    codeLineNumbers: boolean
    articleNav: boolean
    breadcrumb: boolean
    rss: boolean           // RSS 订阅
    readingTime: boolean   // 阅读时间估算
    tags: boolean          // 标签系统
    pwa: boolean           // PWA 支持
  }

  // 评论系统
  comments?: {
    enabled: boolean
    provider: 'giscus' | 'utterances' | 'disqus'
    // Giscus 配置
    giscus?: {
      repo: string
      repoId: string
      category: string
      categoryId: string
      mapping?: 'pathname' | 'url' | 'title'
      theme?: string
    }
    // Utterances 配置
    utterances?: {
      repo: string
      theme?: string
    }
    // Disqus 配置
    disqus?: {
      shortname: string
    }
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
    copyright?: string  // 版权名称，年份自动获取
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
    dateFormat?: string
    notesPerPage?: number
    wordsPerMinute?: number  // 阅读速度，用于计算阅读时间
  }
}
