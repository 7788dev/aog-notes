---
tags:
  - 进阶
  - API
  - 开发
date: 2024-12-19
---

# API 参考

本文档介绍 AOG Notes 的内部 API 和工具函数，供二次开发参考。

## 笔记加载 API

位于 `src/lib/notes.ts`

### loadCategories()

加载所有分类。

```typescript
function loadCategories(): Category[]

interface Category {
  id: number
  name: string      // 显示名称（去除序号）
  slug: string      // URL slug（拼音）
  url: string       // 完整 URL
  folder: string    // 文件夹名称
  icon: string      // 图标（预留）
}
```

### loadAllNotes()

加载所有笔记。

```typescript
function loadAllNotes(): Note[]

interface Note {
  id: number
  title: string
  content: string
  slug: string
  url: string
  category_id?: number
  sub_category?: string
  tags?: string[]
  readingTime?: number
  date?: string
}
```

### getNotesByCategory(categoryId)

获取指定分类的笔记。

```typescript
function getNotesByCategory(categoryId: number): Note[]
```

### getNotesByTag(tag)

获取指定标签的笔记。

```typescript
function getNotesByTag(tag: string): Note[]
```

## URL 工具 API

位于 `src/lib/url.ts`

### generateCategorySlug(folderName)

生成分类的 URL slug。

```typescript
function generateCategorySlug(folderName: string): string

// 示例
generateCategorySlug('01-快速开始')  // 'kuai-su-kai-shi'
```

### generateNoteSlug(filename)

生成笔记的 URL slug。

```typescript
function generateNoteSlug(filename: string): string

// 示例
generateNoteSlug('01-介绍.md')  // 'jie-shao'
```

### generateNoteUrl(slug, options?)

生成笔记的完整 URL。

```typescript
function generateNoteUrl(slug: string, options?: {
  categorySlug?: string
  date?: Date
}): string

// 示例
generateNoteUrl('jie-shao')  // '/notes/jie-shao'
generateNoteUrl('jie-shao', { categorySlug: 'kuai-su-kai-shi' })
// pathStyle='category' 时: '/kuai-su-kai-shi/jie-shao'
```

### generateCategoryUrl(slug)

生成分类的完整 URL。

```typescript
function generateCategoryUrl(slug: string): string

// 示例
generateCategoryUrl('kuai-su-kai-shi')  // '/category/kuai-su-kai-shi'
```

### parseUrl(pathname)

解析 URL 路径。

```typescript
function parseUrl(pathname: string): {
  type: 'home' | 'note' | 'category' | 'favorites' | 'unknown'
  slug?: string
  categorySlug?: string
}
```

## 搜索引擎 API

位于 `src/lib/search.ts`

### SearchEngine

搜索引擎类。

```typescript
class SearchEngine {
  constructor(documents: SearchDocument[])
  
  search(query: string, options?: SearchOptions): SearchResult[]
}

interface SearchDocument {
  id: number
  title: string
  content: string
}

interface SearchOptions {
  fuzzy?: boolean   // 启用模糊匹配，默认 false
  limit?: number    // 结果数量限制，默认 50
}

interface SearchResult {
  item: SearchDocument
  score: number
}
```

使用示例：

```typescript
const engine = new SearchEngine(notes)
const results = engine.search('配置', { fuzzy: true, limit: 10 })
```

## 存储 API

位于 `src/lib/storage.ts`

### 收藏功能

```typescript
// 获取收藏列表
function getFavorites(): number[]

// 切换收藏状态
function toggleFavorite(noteId: number): void

// 检查是否已收藏
function isFavorite(noteId: number): boolean
```

### 主题功能

```typescript
type Theme = 'light' | 'dark' | 'system'

// 获取当前主题
function getTheme(): Theme

// 设置主题
function setTheme(theme: Theme): void
```

## 国际化 API

位于 `src/lib/i18n.ts`

### getMessages(locale)

获取指定语言的文本。

```typescript
function getMessages(locale: string): Messages

interface Messages {
  allNotes: string
  favorites: string
  categories: string
  search: string
  searchPlaceholder: string
  results: string
  keyword: string
  articles: string
  minuteRead: string
  backToList: string
  home: string
  prevArticle: string
  nextArticle: string
  addFavorite: string
  favorited: string
}
```

支持的语言：
- `zh-CN` - 简体中文（默认）
- `en` - English

## 配置类型

位于 `src/types/config.ts`

```typescript
interface SiteConfig {
  // 基本信息
  name: string
  title: string
  description: string
  url: string
  version: string

  // 品牌
  logo?: { text?: string; icon?: string }
  themeColor: string

  // SEO
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
    articleNav: boolean
    rss: boolean
    readingTime: boolean
    tags: boolean
    pwa: boolean
  }

  // 其他配置
  dataDir: string
  social?: SocialConfig
  footer?: FooterConfig
  customCode?: CustomCodeConfig
  url_config?: UrlConfig
  deploy?: DeployConfig
  advanced?: AdvancedConfig
}
```

## 组件 Props

### HomeClient

主页面组件。

```typescript
interface HomeClientProps {
  initialCategories: Category[]
  initialNotes: Note[]
  version: string
  config: SiteConfig
}
```

### NoteReader

Markdown 渲染组件。

```typescript
interface NoteReaderProps {
  content: string  // Markdown 内容
}
```

### SEO

SEO 组件。

```typescript
interface SEOProps {
  article?: {
    title: string
    description: string
    category: string
    slug: string
  }
  breadcrumbs?: {
    name: string
    url: string
  }[]
}
```

## 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `GITHUB_PAGES` | 启用静态导出 | `true` |
| `GITHUB_REPOSITORY` | GitHub 仓库名 | `owner/repo` |
| `NEXT_PUBLIC_BASE_PATH` | 自定义 basePath | `/docs` |

## 扩展开发

### 添加新功能

1. 在 `src/types/config.ts` 添加配置类型
2. 在 `site.config.ts` 添加默认配置
3. 在相应组件中实现功能
4. 更新文档

### 添加新组件

1. 在 `src/components/` 创建组件文件
2. 使用 TypeScript 定义 Props 接口
3. 支持深色模式（使用 `dark:` 前缀）
4. 响应式设计（使用 Tailwind 断点）
