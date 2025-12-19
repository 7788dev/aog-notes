/**
 * URL 工具库
 * 根据 site.config.ts 中的 url_config 配置生成和解析 URL
 */

import { pinyin } from 'pinyin-pro'
import siteConfig from '../../site.config'

const urlConfig = siteConfig.url_config || {}

/**
 * 处理字符串 slugify
 */
function slugifyString(str: string): string {
  if (!urlConfig.slugify) return str
  
  return str
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * 去除数字前缀 (如 01-快速开始 -> 快速开始)
 */
function removeNumberPrefix(str: string): string {
  if (!urlConfig.removeNumberPrefix) return str
  return str.replace(/^\d+-/, '')
}

/**
 * 将中文转为拼音
 */
function toPinyin(str: string): string {
  // 分离中文和英文/数字，分别处理
  const parts = str.match(/[a-zA-Z0-9]+|[\u4e00-\u9fa5]+/g) || []
  
  const slugParts = parts.map(part => {
    if (/^[a-zA-Z0-9]+$/.test(part)) {
      return part
    }
    return pinyin(part, { toneType: 'none', type: 'array' }).join('-')
  })
  
  return slugParts
    .join('-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * 应用大小写转换
 */
function applyCase(str: string): string {
  if (urlConfig.lowercase) {
    return str.toLowerCase()
  }
  return str
}

/**
 * 添加后缀 (.html 或 /)
 */
function addSuffix(path: string): string {
  if (urlConfig.trailingHtml) {
    return path.endsWith('.html') ? path : `${path}.html`
  }
  if (urlConfig.trailingSlash) {
    return path.endsWith('/') ? path : `${path}/`
  }
  return path
}

/**
 * 移除后缀 (.html 或 /)
 */
export function removeSuffix(path: string): string {
  return path
    .replace(/\.html$/, '')
    .replace(/\/$/, '')
}

/**
 * 获取基础路径前缀
 * 优先使用构建时注入的环境变量，确保客户端和服务端一致
 */
function getBasePath(): string {
  // 优先使用环境变量（构建时由 next.config.ts 注入）
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    const bp = process.env.NEXT_PUBLIC_BASE_PATH
    return bp.startsWith('/') ? bp : `/${bp}`
  }
  
  // 回退到配置文件
  const base = urlConfig.basePath || ''
  if (!base) return ''
  return base.startsWith('/') ? base : `/${base}`
}

/**
 * 生成分类 slug
 */
export function generateCategorySlug(folderName: string): string {
  let slug = folderName
  
  // 去除数字前缀
  slug = removeNumberPrefix(slug)
  
  // 转拼音
  slug = toPinyin(slug)
  
  // slugify
  slug = slugifyString(slug)
  
  // 大小写
  slug = applyCase(slug)
  
  return slug
}

/**
 * 生成笔记 slug
 */
export function generateNoteSlug(filename: string, options?: {
  categorySlug?: string
  date?: Date
}): string {
  // 移除 .md 后缀
  let name = filename.replace(/\.md$/, '')
  
  // 去除数字前缀
  name = removeNumberPrefix(name)
  
  // 转拼音
  let slug = toPinyin(name)
  
  // slugify
  slug = slugifyString(slug)
  
  // 大小写
  slug = applyCase(slug)
  
  return slug
}

/**
 * 生成笔记完整 URL 路径
 */
export function generateNoteUrl(slug: string, options?: {
  categorySlug?: string
  date?: Date
}): string {
  const basePath = getBasePath()
  const pathStyle = urlConfig.pathStyle || 'default'
  
  let path = ''
  
  switch (pathStyle) {
    case 'flat':
      // 扁平化: /article
      path = `${basePath}/notes/${slug}`
      break
      
    case 'date':
      // 按日期: /2024/01/article
      if (options?.date) {
        const year = options.date.getFullYear()
        const month = String(options.date.getMonth() + 1).padStart(2, '0')
        path = `${basePath}/${year}/${month}/${slug}`
      } else {
        path = `${basePath}/notes/${slug}`
      }
      break
      
    case 'category':
      // 按分类: /category/article
      if (options?.categorySlug) {
        path = `${basePath}/${options.categorySlug}/${slug}`
      } else {
        path = `${basePath}/notes/${slug}`
      }
      break
      
    case 'default':
    default:
      // 默认: /notes/article
      path = `${basePath}/notes/${slug}`
      break
  }
  
  return addSuffix(path)
}

/**
 * 生成分类完整 URL 路径
 */
export function generateCategoryUrl(slug: string): string {
  const basePath = getBasePath()
  const path = `${basePath}/category/${slug}`
  return addSuffix(path)
}

/**
 * 生成收藏页 URL
 */
export function generateFavoritesUrl(): string {
  const basePath = getBasePath()
  const path = `${basePath}/favorites`
  return addSuffix(path)
}

/**
 * 解析 URL 路径，返回类型和参数
 */
export function parseUrl(pathname: string): {
  type: 'home' | 'note' | 'category' | 'favorites' | 'unknown'
  slug?: string
  categorySlug?: string
} {
  const basePath = getBasePath()
  let path = pathname
  
  // 移除 basePath
  if (basePath && path.startsWith(basePath)) {
    path = path.slice(basePath.length)
  }
  
  // 移除后缀
  path = removeSuffix(path)
  
  // 首页
  if (path === '' || path === '/') {
    return { type: 'home' }
  }
  
  // 收藏页
  if (path === '/favorites') {
    return { type: 'favorites' }
  }
  
  const pathStyle = urlConfig.pathStyle || 'default'
  
  // 笔记页 - /notes/slug
  if (path.startsWith('/notes/')) {
    const slug = decodeURIComponent(path.slice(7))
    return { type: 'note', slug }
  }
  
  // 分类页 - /category/slug
  if (path.startsWith('/category/')) {
    const slug = decodeURIComponent(path.slice(10))
    return { type: 'category', categorySlug: slug }
  }
  
  // 按分类样式: /category-slug/note-slug
  if (pathStyle === 'category') {
    const parts = path.split('/').filter(Boolean)
    if (parts.length === 2) {
      return { type: 'note', categorySlug: parts[0], slug: parts[1] }
    }
    if (parts.length === 1) {
      return { type: 'category', categorySlug: parts[0] }
    }
  }
  
  // 按日期样式: /2024/01/slug
  if (pathStyle === 'date') {
    const match = path.match(/^\/(\d{4})\/(\d{2})\/(.+)$/)
    if (match) {
      return { type: 'note', slug: match[3] }
    }
  }
  
  return { type: 'unknown' }
}

/**
 * 获取 URL 配置
 */
export function getUrlConfig() {
  return urlConfig
}

/**
 * 检查是否启用了 HTML 后缀
 */
export function hasHtmlSuffix(): boolean {
  return urlConfig.trailingHtml === true
}

/**
 * 检查是否启用了尾部斜杠
 */
export function hasTrailingSlash(): boolean {
  return urlConfig.trailingSlash === true
}

/**
 * 获取基础路径
 */
export function getBasePathConfig(): string {
  return getBasePath()
}
