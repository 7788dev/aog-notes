/**
 * 本地存储工具 - 管理学习进度、收藏、搜索历史等
 */

const STORAGE_KEYS = {
  READ_NOTES: 'notes_read',
  FAVORITES: 'notes_favorites',
  SEARCH_HISTORY: 'notes_search_history',
  THEME: 'notes_theme',
  INTERVIEW_STATS: 'notes_interview_stats',
} as const

// 已读笔记管理
export function getReadNotes(): number[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEYS.READ_NOTES)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function markNoteAsRead(noteId: number): void {
  if (typeof window === 'undefined') return
  const readNotes = getReadNotes()
  if (!readNotes.includes(noteId)) {
    readNotes.push(noteId)
    localStorage.setItem(STORAGE_KEYS.READ_NOTES, JSON.stringify(readNotes))
  }
}

export function isNoteRead(noteId: number): boolean {
  return getReadNotes().includes(noteId)
}

// 收藏管理
export function getFavorites(): number[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function toggleFavorite(noteId: number): boolean {
  if (typeof window === 'undefined') return false
  const favorites = getFavorites()
  const index = favorites.indexOf(noteId)
  if (index === -1) {
    favorites.push(noteId)
  } else {
    favorites.splice(index, 1)
  }
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites))
  return index === -1 // 返回是否添加了收藏
}

export function isFavorite(noteId: number): boolean {
  return getFavorites().includes(noteId)
}

// 搜索历史管理
export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addSearchHistory(keyword: string): void {
  if (typeof window === 'undefined' || !keyword.trim()) return
  const history = getSearchHistory()
  const filtered = history.filter(h => h !== keyword)
  filtered.unshift(keyword)
  localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(filtered.slice(0, 10)))
}

export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY)
}

// 主题管理
export type Theme = 'light' | 'dark' | 'system'

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme
    return theme || 'system'
  } catch {
    return 'system'
  }
}

export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.THEME, theme)
  applyTheme(theme)
}

export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return
  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}

// 面试题统计
interface InterviewStats {
  totalAnswered: number
  correctCount: number
  lastPracticeDate: string
}

export function getInterviewStats(): InterviewStats {
  if (typeof window === 'undefined') return { totalAnswered: 0, correctCount: 0, lastPracticeDate: '' }
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INTERVIEW_STATS)
    return data ? JSON.parse(data) : { totalAnswered: 0, correctCount: 0, lastPracticeDate: '' }
  } catch {
    return { totalAnswered: 0, correctCount: 0, lastPracticeDate: '' }
  }
}

export function updateInterviewStats(correct: boolean): void {
  if (typeof window === 'undefined') return
  const stats = getInterviewStats()
  stats.totalAnswered++
  if (correct) stats.correctCount++
  stats.lastPracticeDate = new Date().toISOString().split('T')[0]
  localStorage.setItem(STORAGE_KEYS.INTERVIEW_STATS, JSON.stringify(stats))
}

// 学习进度计算
export function calculateProgress(totalNotes: number): { read: number; total: number; percentage: number } {
  const readNotes = getReadNotes()
  const read = readNotes.length
  const percentage = totalNotes > 0 ? Math.round((read / totalNotes) * 100) : 0
  return { read, total: totalNotes, percentage }
}
