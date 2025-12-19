import type { NextConfig } from "next";
import siteConfig from "./site.config";

const urlConfig = siteConfig.url_config || {};
const deployConfig = siteConfig.deploy || {};

// GitHub Pages 部署时设置环境变量 GITHUB_PAGES=true
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

// 计算 basePath
// 优先级: NEXT_PUBLIC_BASE_PATH 环境变量 > GitHub Pages 自动检测 > site.config.ts 配置
function getBasePath(): string {
  // 1. 环境变量优先（支持手动覆盖）
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    const bp = process.env.NEXT_PUBLIC_BASE_PATH;
    return bp.startsWith('/') ? bp : `/${bp}`;
  }
  
  // 2. GitHub Pages 自动从仓库名获取
  if (isGitHubPages && deployConfig.githubPagesAutoBasePath !== false) {
    const repo = process.env.GITHUB_REPOSITORY; // 格式: owner/repo-name
    if (repo) {
      const repoName = repo.split('/')[1];
      if (repoName) {
        return `/${repoName}`;
      }
    }
  }
  
  // 3. 使用配置文件中的 basePath
  return urlConfig.basePath || '';
}

const basePath = getBasePath();

// 生成重写规则
function generateRewrites() {
  const rewrites: { source: string; destination: string }[] = [];
  const prefix = basePath ? `/${basePath.replace(/^\/|\/$/g, '')}` : '';
  
  // 基础路由重写
  rewrites.push(
    { source: `${prefix}/notes/:slug*`, destination: '/' },
    { source: `${prefix}/category/:slug*`, destination: '/' },
    { source: `${prefix}/favorites`, destination: '/' }
  );
  
  // 支持 .html 后缀
  if (urlConfig.trailingHtml) {
    rewrites.push(
      { source: `${prefix}/notes/:slug*.html`, destination: '/' },
      { source: `${prefix}/category/:slug*.html`, destination: '/' },
      { source: `${prefix}/favorites.html`, destination: '/' }
    );
  }
  
  // 按分类样式的路由 /category-slug/note-slug
  if (urlConfig.pathStyle === 'category') {
    rewrites.push(
      { source: `${prefix}/:category/:slug`, destination: '/' }
    );
    if (urlConfig.trailingHtml) {
      rewrites.push(
        { source: `${prefix}/:category/:slug.html`, destination: '/' }
      );
    }
  }
  
  // 按日期样式的路由 /2024/01/slug
  if (urlConfig.pathStyle === 'date') {
    rewrites.push(
      { source: `${prefix}/:year(\\d{4})/:month(\\d{2})/:slug`, destination: '/' }
    );
    if (urlConfig.trailingHtml) {
      rewrites.push(
        { source: `${prefix}/:year(\\d{4})/:month(\\d{2})/:slug.html`, destination: '/' }
      );
    }
  }
  
  return rewrites;
}

const nextConfig: NextConfig = {
  // GitHub Pages 需要静态导出
  ...(isGitHubPages ? { output: 'export' } : {}),
  
  // 启用压缩
  compress: true,
  
  // 生产环境优化
  poweredByHeader: false,
  
  // 尾部斜杠配置
  trailingSlash: urlConfig.trailingSlash || false,
  
  // 基础路径配置
  ...(basePath ? { basePath } : {}),
  
  // 环境变量传递给客户端
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  
  // 图片优化配置
  images: isGitHubPages ? { unoptimized: true } : {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async rewrites() {
    return generateRewrites();
  },

  // HTTP 响应头优化（安全 + 缓存）
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'accept', value: '(.*text/html.*)' }],
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
