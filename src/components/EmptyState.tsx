'use client'

interface EmptyStateProps {
  type: 'no-results' | 'no-favorites' | 'select-note' | 'empty-category'
  keyword?: string
  categoryName?: string
}

// 搜索无结果插图
function NoResultsIllustration() {
  return (
    <svg className="w-32 h-32 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" className="fill-gray-100 dark:fill-gray-800" />
      <circle cx="85" cy="85" r="35" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="6" fill="none" />
      <line x1="110" y1="110" x2="140" y2="140" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="6" strokeLinecap="round" />
      <path d="M75 80 Q85 70 95 80" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="75" cy="90" r="3" className="fill-gray-400 dark:fill-gray-500" />
      <circle cx="95" cy="90" r="3" className="fill-gray-400 dark:fill-gray-500" />
      <text x="100" y="175" textAnchor="middle" className="fill-gray-300 dark:fill-gray-600 text-xs">?</text>
    </svg>
  )
}

// 无收藏插图
function NoFavoritesIllustration() {
  return (
    <svg className="w-32 h-32 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" className="fill-amber-50 dark:fill-amber-900/20" />
      <path 
        d="M100 45 L112 75 L145 78 L120 100 L127 133 L100 118 L73 133 L80 100 L55 78 L88 75 Z" 
        className="stroke-amber-300 dark:stroke-amber-600" 
        strokeWidth="4" 
        strokeLinejoin="round"
        strokeDasharray="8 4"
        fill="none"
      />
      <circle cx="100" cy="95" r="15" className="fill-amber-100 dark:fill-amber-800/30" />
      <path d="M93 92 Q100 100 107 92" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="94" cy="88" r="2" className="fill-amber-400 dark:fill-amber-500" />
      <circle cx="106" cy="88" r="2" className="fill-amber-400 dark:fill-amber-500" />
    </svg>
  )
}

// 选择笔记插图
function SelectNoteIllustration() {
  return (
    <svg className="w-32 h-32 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" className="fill-gray-100 dark:fill-gray-800" />
      <rect x="60" y="50" width="80" height="100" rx="4" className="fill-white dark:fill-gray-700 stroke-gray-200 dark:stroke-gray-600" strokeWidth="2" />
      <line x1="75" y1="70" x2="125" y2="70" className="stroke-gray-200 dark:stroke-gray-600" strokeWidth="3" strokeLinecap="round" />
      <line x1="75" y1="85" x2="115" y2="85" className="stroke-gray-200 dark:stroke-gray-600" strokeWidth="3" strokeLinecap="round" />
      <line x1="75" y1="100" x2="120" y2="100" className="stroke-gray-200 dark:stroke-gray-600" strokeWidth="3" strokeLinecap="round" />
      <line x1="75" y1="115" x2="105" y2="115" className="stroke-gray-200 dark:stroke-gray-600" strokeWidth="3" strokeLinecap="round" />
      <circle cx="145" cy="130" r="20" className="fill-[var(--theme-color)] opacity-20" />
      <path d="M138 130 L143 135 L152 125" className="stroke-[var(--theme-color)]" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// 空分类插图
function EmptyCategoryIllustration() {
  return (
    <svg className="w-32 h-32 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" className="fill-gray-100 dark:fill-gray-800" />
      {/* 文件夹 */}
      <path d="M50 70 L50 140 L150 140 L150 80 L95 80 L85 70 Z" className="fill-white dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" />
      <path d="M50 80 L150 80" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="2" />
      {/* 虚线表示空 */}
      <line x1="70" y1="100" x2="130" y2="100" className="stroke-gray-200 dark:stroke-gray-600" strokeWidth="2" strokeDasharray="6 4" />
      <line x1="80" y1="115" x2="120" y2="115" className="stroke-gray-200 dark:stroke-gray-600" strokeWidth="2" strokeDasharray="6 4" />
      {/* 表情 */}
      <circle cx="90" cy="108" r="2" className="fill-gray-300 dark:fill-gray-500" />
      <circle cx="110" cy="108" r="2" className="fill-gray-300 dark:fill-gray-500" />
    </svg>
  )
}

export default function EmptyState({ type, keyword, categoryName }: EmptyStateProps) {
  const configs = {
    'no-results': {
      illustration: <NoResultsIllustration />,
      title: '没有找到相关内容',
      description: keyword ? `未找到与 "${keyword}" 相关的笔记` : '试试其他关键词吧',
    },
    'no-favorites': {
      illustration: <NoFavoritesIllustration />,
      title: '还没有收藏',
      description: '点击笔记中的星标按钮来收藏喜欢的内容',
    },
    'select-note': {
      illustration: <SelectNoteIllustration />,
      title: '选择一篇笔记开始阅读',
      description: '使用 ↑↓ 键快速切换，Ctrl+K 搜索',
    },
    'empty-category': {
      illustration: <EmptyCategoryIllustration />,
      title: '该分类暂无内容',
      description: categoryName ? `"${categoryName}" 分类下还没有笔记` : '在此分类下添加一些笔记吧',
    },
  }

  const config = configs[type]

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {config.illustration}
      <h3 className="mt-6 text-base font-medium text-gray-600 dark:text-gray-300">
        {config.title}
      </h3>
      <p className="mt-2 text-sm text-gray-400 dark:text-gray-500 text-center max-w-xs">
        {config.description}
      </p>
    </div>
  )
}
