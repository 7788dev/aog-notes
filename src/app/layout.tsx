import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import siteConfig from "../../site.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

// 获取 basePath（用于静态资源路径）
const staticBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// 获取 favicon 配置（需要包含 basePath）
const faviconPath = `${staticBasePath}${siteConfig.favicon || '/logo.svg'}`;

// SEO 元数据（根据配置决定是否启用）
export const metadata: Metadata = siteConfig.seo.enabled ? {
  icons: {
    icon: faviconPath,
    shortcut: faviconPath,
    apple: faviconPath,
  },
  ...(siteConfig.features.pwa ? { manifest: '/manifest.webmanifest' } : {}),
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.seo.author, url: siteConfig.url }],
  creator: siteConfig.seo.author,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: siteConfig.seo.robots || 'index, follow',
  verification: {
    google: siteConfig.seo.googleVerification,
    other: siteConfig.seo.baiduVerification ? {
      'baidu-site-verification': siteConfig.seo.baiduVerification,
    } : undefined,
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: "website",
    locale: siteConfig.advanced?.locale || "zh-CN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    ...(siteConfig.seo.ogImage !== false ? {
      images: [
        {
          url: `${siteConfig.url}${staticBasePath}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: siteConfig.title,
        }
      ],
    } : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    ...(siteConfig.seo.ogImage !== false ? {
      images: [`${siteConfig.url}${staticBasePath}/og-image.svg`],
    } : {}),
  },
  alternates: {
    canonical: siteConfig.url,
    types: siteConfig.features.rss ? {
      'application/rss+xml': `${siteConfig.url}/feed.xml`,
    } : undefined,
  },
} : {
  title: siteConfig.title,
  robots: 'noindex, nofollow',
  icons: {
    icon: faviconPath,
    shortcut: faviconPath,
  },
};

// 结构化数据
const organizationSchema = siteConfig.seo.enabled ? {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}${staticBasePath}/logo.svg`,
  sameAs: Object.values(siteConfig.social || {}).filter(Boolean),
} : null;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { customCode, seo, advanced } = siteConfig;
  const locale = advanced?.locale || 'zh-CN';

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        
        {/* RSS Feed */}
        {siteConfig.features.rss && (
          <link rel="alternate" type="application/rss+xml" title={`${siteConfig.name} RSS Feed`} href={`${staticBasePath}/feed.xml`} />
        )}
        
        {/* PWA Icons */}
        {siteConfig.features.pwa && (
          <>
            <link rel="apple-touch-icon" href={`${staticBasePath}/icon-192.svg`} />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          </>
        )}
        
        {/* 结构化数据 */}
        {seo.enabled && organizationSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
        )}
        
        {/* 自定义 CSS */}
        {customCode?.css && (
          <style dangerouslySetInnerHTML={{ __html: customCode.css }} />
        )}
        
        {/* 自定义 Head 脚本 */}
        {customCode?.headScript && (
          <div dangerouslySetInnerHTML={{ __html: customCode.headScript }} />
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        
        {/* 自定义 Body 脚本 */}
        {customCode?.bodyScript && (
          <div dangerouslySetInnerHTML={{ __html: customCode.bodyScript }} />
        )}
        
        {/* PWA Service Worker */}
        {siteConfig.features.pwa && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('${staticBasePath}/sw.js')
                  })
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
