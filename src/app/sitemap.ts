import { MetadataRoute } from 'next'
import { loadCategories, loadAllNotes } from '@/lib/notes'
import { getBasePathConfig } from '@/lib/url'
import siteConfig from '../../site.config'

export const dynamic = 'force-static'

// 根据内容重要性计算优先级
function calculatePriority(categoryName: string, isCategory: boolean): number {
  if (isCategory) {
    // 入门基础和交换技术优先级更高
    if (categoryName.includes('入门') || categoryName.includes('基础')) return 0.9
    if (categoryName.includes('交换') || categoryName.includes('路由')) return 0.85
    return 0.8
  }
  // 笔记页面根据分类调整优先级
  if (categoryName.includes('入门') || categoryName.includes('基础')) return 0.7
  if (categoryName.includes('实战') || categoryName.includes('面试')) return 0.75
  return 0.6
}

export default function sitemap(): MetadataRoute.Sitemap {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || getBasePathConfig()
  const baseUrl = siteConfig.url.replace(/\/$/, '') + basePath
  const now = new Date()
  
  // 首页 - 最高优先级
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl || siteConfig.url,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  try {
    const categories = loadCategories()
    const notes = loadAllNotes()

    // 添加分类页面（使用配置生成的 URL）
    categories.forEach((category) => {
      routes.push({
        url: `${baseUrl}${category.url}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: calculatePriority(category.name, true),
      })
    })

    // 添加笔记页面（使用配置生成的 URL）
    notes.forEach((note) => {
      const category = categories.find(c => c.id === note.category_id)
      const categoryName = category?.name || ''
      
      routes.push({
        url: `${baseUrl}${note.url}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: calculatePriority(categoryName, false),
      })
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return routes
}
