import { loadAllNotes, loadCategories } from '@/lib/notes'
import siteConfig from '../../../site.config'

export const dynamic = 'force-static'

export async function GET() {
  if (!siteConfig.features.rss) {
    return new Response('RSS feed is disabled', { status: 404 })
  }

  const notes = loadAllNotes()
  const categories = loadCategories()
  const baseUrl = siteConfig.url.replace(/\/$/, '')

  const rssItems = notes.map(note => {
    const category = categories.find(c => c.id === note.category_id)
    const pubDate = note.date ? new Date(note.date).toUTCString() : new Date().toUTCString()
    const description = note.content.substring(0, 300).replace(/[<>&'"]/g, c => ({
      '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&#39;', '"': '&quot;'
    }[c] || c))

    return `
    <item>
      <title><![CDATA[${note.title}]]></title>
      <link>${baseUrl}${note.url}</link>
      <guid isPermaLink="true">${baseUrl}${note.url}</guid>
      <description><![CDATA[${description}...]]></description>
      <pubDate>${pubDate}</pubDate>
      ${category ? `<category><![CDATA[${category.name}]]></category>` : ''}
      ${note.tags?.map(tag => `<category><![CDATA[${tag}]]></category>`).join('\n      ') || ''}
    </item>`
  }).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${siteConfig.name}]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${siteConfig.description}]]></description>
    <language>${siteConfig.advanced?.locale || 'zh-CN'}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>AOG Notes</generator>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
