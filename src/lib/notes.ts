import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import siteConfig from '../../site.config'
import { generateCategorySlug, generateNoteSlug, generateNoteUrl, generateCategoryUrl } from './url'

export interface SubCategory {
  id: string
  name: string
  folder: string
}

export interface Category {
  id: number
  name: string
  slug: string
  folder: string
  icon: string
  subCategories?: SubCategory[]
}

export interface Note {
  id: number
  title: string
  content: string
  slug: string
  url: string
  category_id?: number
  sub_category?: string
  tags?: string[]
  readingTime?: number  // 分钟
  date?: string         // 发布日期
}

const DATA_DIR = path.join(process.cwd(), siteConfig.dataDir)

// 计算阅读时间（分钟）
function calculateReadingTime(content: string): number {
  const wordsPerMinute = siteConfig.advanced?.wordsPerMinute || 200
  // 中文按字符计算，英文按单词计算
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = content.replace(/[\u4e00-\u9fa5]/g, '').split(/\s+/).filter(Boolean).length
  const totalWords = chineseChars + englishWords
  return Math.max(1, Math.ceil(totalWords / wordsPerMinute))
}

// 直接使用文件夹名称作为显示名称
function parseFolderName(folder: string): string {
  return folder
}

// 自动扫描 data 目录，生成分类列表
export function loadCategories(): (Category & { url: string })[] {
  if (!fs.existsSync(DATA_DIR)) return []

  const folders = fs.readdirSync(DATA_DIR)
    .filter(f => fs.statSync(path.join(DATA_DIR, f)).isDirectory())
    .sort()

  return folders.map((folder, index) => {
    const slug = generateCategorySlug(folder)
    return {
      id: index + 1,
      name: parseFolderName(folder),
      slug,
      url: generateCategoryUrl(slug),
      folder,
      icon: 'Folder'
    }
  })
}

// 移除正文开头的一级标题
function removeLeadingH1(content: string): string {
  const lines = content.split('\n')
  if (lines.length === 0) return content
  const firstLine = lines[0].trim()
  if (firstLine.startsWith('# ')) {
    return lines.slice(1).join('\n').replace(/^\n+/, '')
  }
  return content
}

export function loadAllNotes(): (Note & { _file: string; _folder: string })[] {
  const categories = loadCategories()
  const notes: (Note & { _file: string; _folder: string })[] = []
  let globalId = 1

  categories.forEach(cat => {
    const folderPath = path.join(DATA_DIR, cat.folder)
    if (!fs.existsSync(folderPath)) return

    const items = fs.readdirSync(folderPath)
    const files = items.filter(f => f.endsWith('.md')).sort()

    // 读取主目录下的笔记
    files.forEach(file => {
      try {
        const raw = fs.readFileSync(path.join(folderPath, file), 'utf-8')
        const { data, content } = matter(raw)
        const title = data.title || file.replace('.md', '')
        const slug = generateNoteSlug(file)
        const url = generateNoteUrl(slug, { categorySlug: cat.slug })
        const cleanContent = removeLeadingH1(content.trim())
        notes.push({
          id: globalId++,
          title,
          slug,
          url,
          content: cleanContent,
          category_id: cat.id,
          tags: data.tags || [],
          readingTime: calculateReadingTime(cleanContent),
          date: data.date || undefined,
          _file: file,
          _folder: cat.folder
        })
      } catch (e) {
        console.error(`读取文件失败: ${file}`, e)
      }
    })

    // 读取子目录下的笔记
    const subDirs = items.filter(f => fs.statSync(path.join(folderPath, f)).isDirectory())
    subDirs.forEach(subDir => {
      const subPath = path.join(folderPath, subDir)
      const subFiles = fs.readdirSync(subPath).filter(f => f.endsWith('.md')).sort()

      subFiles.forEach(file => {
        try {
          const raw = fs.readFileSync(path.join(subPath, file), 'utf-8')
          const { data, content } = matter(raw)
          const title = data.title || file.replace('.md', '')
          const slug = generateNoteSlug(file)
          const url = generateNoteUrl(slug, { categorySlug: cat.slug })
          const cleanContent = removeLeadingH1(content.trim())
          notes.push({
            id: globalId++,
            title,
            slug,
            url,
            content: cleanContent,
            category_id: cat.id,
            sub_category: subDir,
            tags: data.tags || [],
            readingTime: calculateReadingTime(cleanContent),
            date: data.date || undefined,
            _file: file,
            _folder: `${cat.folder}/${subDir}`
          })
        } catch (e) {
          console.error(`读取文件失败: ${subDir}/${file}`, e)
        }
      })
    })
  })

  return notes
}

export function getCategoryById(id: number): Category | undefined {
  return loadCategories().find(c => c.id === id)
}

// 获取所有标签及其文章数量
export function getAllTags(): { name: string; count: number }[] {
  const notes = loadAllNotes()
  const tagMap = new Map<string, number>()
  
  notes.forEach(note => {
    note.tags?.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

// 根据标签获取笔记
export function getNotesByTag(tag: string): Note[] {
  return loadAllNotes()
    .filter(note => note.tags?.includes(tag))
    .map(({ _file, _folder, ...rest }) => rest)
}
