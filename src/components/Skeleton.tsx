'use client'

// 笔记列表骨架屏
export function NoteListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="p-2 space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-3 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full mb-1" />
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3 mb-3" />
          <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-16" />
        </div>
      ))}
    </div>
  )
}


