'use client'

import { useEffect } from 'react'
import siteConfig from '../../site.config'

interface ArticleData {
  title: string
  description: string
  category: string
  slug: string
  keywords?: string[]
  datePublished?: string
  dateModified?: string
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface FAQItem {
  question: string
  answer: string
}

interface SEOProps {
  article?: ArticleData
  breadcrumbs?: BreadcrumbItem[]
  faqs?: FAQItem[]
}

// 从配置读取
const SITE_URL = siteConfig.url
const SITE_NAME = siteConfig.name
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

// 根据分类生成相关关键词
function generateKeywords(category: string, title: string): string[] {
  const baseKeywords = siteConfig.seo.keywords || []
  return [...baseKeywords, category, title].filter(Boolean)
}

export default function SEO({ article, breadcrumbs, faqs }: SEOProps) {
  // 动态更新页面 meta 标签
  useEffect(() => {
    if (article) {
      // 更新 canonical URL
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = `${SITE_URL}${basePath}/notes/${article.slug}`

      // 更新 meta description
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.name = 'description'
        document.head.appendChild(metaDesc)
      }
      metaDesc.content = article.description

      // 更新 keywords
      const keywords = generateKeywords(article.category, article.title)
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.name = 'keywords'
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.content = keywords.join(', ')

      // 更新 Open Graph
      const ogTags = [
        { property: 'og:title', content: `${article.title} | ${SITE_NAME}` },
        { property: 'og:description', content: article.description },
        { property: 'og:url', content: `${SITE_URL}${basePath}/notes/${article.slug}` },
        { property: 'og:type', content: 'article' },
      ]
      
      // 如果启用了 OG 图片
      if (siteConfig.seo.ogImage !== false) {
        ogTags.push({ property: 'og:image', content: `${SITE_URL}${basePath}/opengraph-image` })
      }
      
      ogTags.forEach(({ property, content }) => {
        let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
        if (!tag) {
          tag = document.createElement('meta')
          tag.setAttribute('property', property)
          document.head.appendChild(tag)
        }
        tag.content = content
      })
    }
  }, [article])

  // 网站结构化数据
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}${basePath}`,
    description: siteConfig.description,
    inLanguage: siteConfig.advanced?.locale || 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}${basePath}/?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  // 文章结构化数据（增强版）
  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    url: `${SITE_URL}${basePath}/notes/${article.slug}`,
    ...(siteConfig.seo.ogImage !== false ? { image: `${SITE_URL}${basePath}/opengraph-image` } : {}),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}${basePath}`
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}${basePath}/logo.svg`,
        width: 60,
        height: 60
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${basePath}/notes/${article.slug}`
    },
    articleSection: article.category,
    inLanguage: 'zh-CN',
    keywords: generateKeywords(article.category, article.title).join(', '),
    datePublished: article.datePublished || new Date().toISOString(),
    dateModified: article.dateModified || new Date().toISOString(),
    // 教育内容标记
    educationalLevel: 'beginner',
    learningResourceType: 'tutorial'
  } : null

  // 面包屑结构化数据
  const breadcrumbSchema = breadcrumbs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`
    }))
  } : null

  // FAQ 结构化数据（用于富文本搜索结果）
  const faqSchema = faqs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null

  // 课程结构化数据（整站作为课程）
  const courseSchema = !article ? {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: siteConfig.title,
    description: siteConfig.description,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}${basePath}`
    },
    educationalLevel: 'beginner',
    inLanguage: siteConfig.advanced?.locale || 'zh-CN',
    isAccessibleForFree: true,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT20H'
    }
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {courseSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      )}
    </>
  )
}
