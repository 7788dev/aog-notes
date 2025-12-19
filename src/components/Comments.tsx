'use client'

import { useEffect, useRef, useMemo } from 'react'
import { getMessages } from '@/lib/i18n'
import type { SiteConfig } from '@/types/config'

interface CommentsProps {
  config: SiteConfig
  slug: string
  title: string
}

export default function Comments({ config, slug, title }: CommentsProps) {
  const i18n = useMemo(() => getMessages(config.advanced?.locale || 'zh-CN'), [config.advanced?.locale])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!config.comments?.enabled || !containerRef.current) return

    const container = containerRef.current
    container.innerHTML = ''

    const { provider } = config.comments

    if (provider === 'giscus' && config.comments.giscus) {
      const { repo, repoId, category, categoryId, mapping = 'pathname', theme = 'preferred_color_scheme' } = config.comments.giscus
      const script = document.createElement('script')
      script.src = 'https://giscus.app/client.js'
      script.setAttribute('data-repo', repo)
      script.setAttribute('data-repo-id', repoId)
      script.setAttribute('data-category', category)
      script.setAttribute('data-category-id', categoryId)
      script.setAttribute('data-mapping', mapping)
      script.setAttribute('data-strict', '0')
      script.setAttribute('data-reactions-enabled', '1')
      script.setAttribute('data-emit-metadata', '0')
      script.setAttribute('data-input-position', 'bottom')
      script.setAttribute('data-theme', theme)
      script.setAttribute('data-lang', config.advanced?.locale || 'zh-CN')
      script.crossOrigin = 'anonymous'
      script.async = true
      container.appendChild(script)
    }

    if (provider === 'utterances' && config.comments.utterances) {
      const { repo, theme = 'github-light' } = config.comments.utterances
      const script = document.createElement('script')
      script.src = 'https://utteranc.es/client.js'
      script.setAttribute('repo', repo)
      script.setAttribute('issue-term', 'pathname')
      script.setAttribute('theme', theme)
      script.crossOrigin = 'anonymous'
      script.async = true
      container.appendChild(script)
    }

    if (provider === 'disqus' && config.comments.disqus) {
      const { shortname } = config.comments.disqus
      // @ts-expect-error Disqus global
      window.disqus_config = function() {
        // @ts-expect-error Disqus global
        this.page.url = window.location.href
        // @ts-expect-error Disqus global
        this.page.identifier = slug
        // @ts-expect-error Disqus global
        this.page.title = title
      }
      const script = document.createElement('script')
      script.src = `https://${shortname}.disqus.com/embed.js`
      script.setAttribute('data-timestamp', String(+new Date()))
      script.async = true
      container.appendChild(script)
    }

    return () => {
      container.innerHTML = ''
    }
  }, [config, slug, title])

  if (!config.comments?.enabled) return null

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">{i18n.comments}</h3>
      <div ref={containerRef} />
    </div>
  )
}
