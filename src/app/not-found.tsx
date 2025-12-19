import Link from 'next/link'
import { loadCategories } from '@/lib/notes'
import siteConfig from '../../site.config'

export default function NotFound() {
  const categories = loadCategories()
  
  // 随机选择最多 4 个分类
  const shuffled = [...categories].sort(() => Math.random() - 0.5)
  const recommendedCategories = shuffled.slice(0, 4)
  
  const themeColor = siteConfig.themeColor

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600">404</h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          页面走丢了
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          抱歉，您访问的页面不存在或已被移动。
          <br />
          请检查网址是否正确，或返回首页继续浏览。
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg transition-colors"
            style={{ backgroundColor: themeColor }}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            返回首页
          </Link>
        </div>

        {recommendedCategories.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">或者试试这些内容：</p>
            <div className="flex flex-wrap justify-center gap-2">
              {recommendedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full hover:opacity-80 transition-colors"
                  style={{ ['--hover-color' as string]: themeColor }}
                >
                  {cat.name.replace(/^\d+-/, '')}
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="mt-8 text-xs text-gray-400">
          {siteConfig.name}
        </p>
      </div>
    </div>
  )
}
