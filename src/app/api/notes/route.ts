import { NextResponse } from 'next/server'
import { loadAllNotes } from '@/lib/notes'
import { SearchEngine } from '@/lib/search'

export const dynamic = 'force-static'

type NoteType = ReturnType<typeof loadAllNotes>[0]

// 缓存搜索引擎实例
let searchEngine: SearchEngine<NoteType> | null = null
let cachedNotes: NoteType[] | null = null

function getSearchEngine() {
  const notes = loadAllNotes()
  
  // 简单缓存：如果笔记数量变化则重建索引
  if (!searchEngine || !cachedNotes || cachedNotes.length !== notes.length) {
    cachedNotes = notes
    searchEngine = new SearchEngine(notes)
  }
  
  return { searchEngine: searchEngine!, notes }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('category_id')
  const keyword = searchParams.get('keyword')

  const { searchEngine, notes } = getSearchEngine()
  let filteredNotes = notes

  // 分类过滤
  if (categoryId) {
    filteredNotes = filteredNotes.filter(n => n.category_id === parseInt(categoryId))
  }

  // 关键词搜索（使用 BM25 算法）
  if (keyword && keyword.trim()) {
    const searchResults = searchEngine.search(keyword, { fuzzy: true, limit: 100 })
    const matchedIds = new Set(searchResults.map(r => r.item.id))
    
    // 按搜索分数排序
    const scoreMap = new Map(searchResults.map(r => [r.item.id, r.score]))
    filteredNotes = filteredNotes
      .filter(n => matchedIds.has(n.id))
      .sort((a, b) => (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0))
  }

  // 移除内部字段
  const result = filteredNotes.map(({ _file, _folder, ...rest }) => rest)

  return NextResponse.json({ 
    code: 0, 
    data: result, 
    count: result.length,
    query: keyword || undefined
  })
}
