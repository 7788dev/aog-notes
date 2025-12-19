import type { MetadataRoute } from 'next'
import siteConfig from '../../site.config'

export const dynamic = 'force-static'

// 获取 basePath（使用环境变量，由 next.config.ts 注入）
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

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
