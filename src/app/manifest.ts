import type { MetadataRoute } from 'next'
import siteConfig from '../../site.config'

export const dynamic = 'force-static'

// 获取 basePath
const basePath = process.env.GITHUB_PAGES === 'true' ? '/aog-notes' : (siteConfig.url_config?.basePath || '')

export default function manifest(): MetadataRoute.Manifest {
  if (!siteConfig.features.pwa) {
    return {} as MetadataRoute.Manifest
  }

  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: basePath || '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: siteConfig.themeColor,
    orientation: 'portrait-primary',
    icons: [
      {
        src: `${basePath}/icon-192.svg`,
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: `${basePath}/icon-512.svg`,
        sizes: '512x512',
        type: 'image/svg+xml',
      },
      {
        src: `${basePath}/icon-512.svg`,
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
