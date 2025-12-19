'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import NoteReader from '@/components/NoteReader'
import SEO from '@/components/SEO'
import { getFavorites, toggleFavorite, getTheme, setTheme, type Theme } from '@/lib/storage'
import { SearchEngine } from '@/lib/search'
import { generateFavoritesUrl } from '@/lib/url'
import { getMessages } from '@/lib/i18n'
import EmptyState from '@/components/EmptyState'
import { NoteListSkeleton } from '@/components/Skeleton'
import type { SiteConfig } from '@/types/config'

interface Category {
  id: number
  name: string
  slug: string
  url: string
  folder: string
  icon: string
}

interface Note {
  id: number
  title: string
  content: string
  slug: string
  url: string
  category_id?: number
  sub_category?: string
  tags?: string[]
  readingTime?: number
  date?: string
}

interface HomeClientProps {
  initialCategories: Category[]
  initialNotes: Note[]
  version: string
  config: SiteConfig
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

function HighlightText({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword.trim() || !text) return <>{text}</>
  const parts: { text: string; highlight: boolean }[] = []
  const lowerText = text.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()
  let lastIndex = 0
  let index = lowerText.indexOf(lowerKeyword)
  while (index !== -1) {
    if (index > lastIndex) parts.push({ text: text.slice(lastIndex, index), highlight: false })
    parts.push({ text: text.slice(index, index + keyword.length), highlight: true })
    lastIndex = index + keyword.length
    index = lowerText.indexOf(lowerKeyword, lastIndex)
  }
  if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), highlight: false })
  return <>{parts.map((part, i) => part.highlight ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100 rounded px-0.5">{part.text}</mark> : <span key={i}>{part.text}</span>)}</>
}

export default function HomeClient({ initialCategories, initialNotes, version, config }: HomeClientProps) {
  const [categories] = useState<Category[]>(initialCategories)
  const [allNotes] = useState<Note[]>(initialNotes)
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showList, setShowList] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [theme, setThemeState] = useState<Theme>('system')
  const [isLoading, setIsLoading] = useState(true)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debouncedKeyword = useDebounce(searchKeyword, 200)

  // 主题色 CSS 变量
  const themeColor = config.themeColor
  
  // 国际化
  const locale = config.advanced?.locale || 'zh-CN'
  const i18n = useMemo(() => getMessages(locale), [locale])

  const updateUrl = useCallback((path: string, title?: string) => {
    window.history.pushState({}, '', path)
    if (title) document.title = `${title} | ${config.name}`
  }, [config.name])

  // 使用构建时注入的 basePath（由 next.config.ts 设置）
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  // 解析 URL 路径，支持多种格式
  const parseUrlPath = useCallback((path: string) => {
    // 移除可能的后缀和 basePath
    let cleanPath = path.replace(/\.html$/, '').replace(/\/$/, '')
    if (basePath && cleanPath.startsWith(basePath)) {
      cleanPath = cleanPath.slice(basePath.length) || '/'
    }
    
    // 首页
    if (cleanPath === '' || cleanPath === '/') {
      return { type: 'home' as const }
    }
    
    // 笔记页 - 通过 URL 匹配
    const note = allNotes.find(n => {
      const noteUrl = n.url.replace(/\.html$/, '').replace(/\/$/, '')
      return noteUrl === cleanPath
    })
    if (note) {
      return { type: 'note' as const, note }
    }
    
    // 分类页 - 通过 URL 匹配
    const category = categories.find(c => {
      const catUrl = c.url.replace(/\.html$/, '').replace(/\/$/, '')
      return catUrl === cleanPath
    })
    if (category) {
      return { type: 'category' as const, category }
    }
    
    // 收藏页
    if (cleanPath === '/favorites' || cleanPath.endsWith('/favorites')) {
      return { type: 'favorites' as const }
    }
    
    // 兼容旧格式 /notes/slug
    if (cleanPath.startsWith('/notes/')) {
      const slug = decodeURIComponent(cleanPath.slice(7))
      const noteBySlug = allNotes.find(n => n.slug === slug)
      if (noteBySlug) {
        return { type: 'note' as const, note: noteBySlug }
      }
    }
    
    // 兼容旧格式 /category/slug
    if (cleanPath.startsWith('/category/')) {
      const slug = decodeURIComponent(cleanPath.slice(10))
      const catBySlug = categories.find(c => c.slug === slug)
      if (catBySlug) {
        return { type: 'category' as const, category: catBySlug }
      }
    }
    
    return { type: 'unknown' as const }
  }, [allNotes, categories, basePath])

  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname
      const result = parseUrlPath(path)
      
      if (result.type === 'note' && result.note) {
        const note = result.note
        setSelectedNote(note)
        setActiveCategory(note.category_id ?? null)
        setShowList(false)
        if (note.category_id) {
          setExpandedCategories(prev => prev.includes(note.category_id!) ? prev : [...prev, note.category_id!])
        }
        return
      }
      
      if (result.type === 'category' && result.category) {
        setActiveCategory(result.category.id)
        setExpandedCategories(prev => prev.includes(result.category!.id) ? prev : [...prev, result.category!.id])
        return
      }
      
      if (result.type === 'favorites') {
        setShowFavorites(true)
        return
      }
    }
    parseUrl()
    const handlePopState = () => {
      const path = window.location.pathname
      const result = parseUrlPath(path)
      const isHome = result.type === 'home' || path === '/' || (basePath && (path === basePath || path === basePath + '/'))
      if (isHome) {
        setSelectedNote(null)
        setActiveCategory(null)
        setShowList(true)
        setShowFavorites(false)
      } else {
        parseUrl()
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [allNotes, categories, parseUrlPath, basePath])

  const applyThemeClass = useCallback((t: Theme) => {
    if (typeof window === 'undefined') return
    const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    // 临时禁用过渡动画防止抖动
    document.documentElement.classList.add('theme-transition')
    document.documentElement.classList.toggle('dark', isDark)
    // 下一帧恢复过渡
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-transition')
      })
    })
  }, [])

  // 客户端挂载标记
  const [mounted, setMounted] = useState(false)
  
  // 初始化收藏和主题（客户端挂载后执行）
  useEffect(() => {
    setMounted(true)
    
    // 初始化收藏
    if (config.features.favorites) {
      const savedFavorites = getFavorites()
      if (savedFavorites.length > 0) {
        setFavorites(savedFavorites)
      }
    }
    // 初始化主题
    if (config.features.darkMode) {
      const savedTheme = getTheme()
      setThemeState(savedTheme)
      applyThemeClass(savedTheme)
    }
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleThemeChange = useCallback((t: Theme) => {
    setThemeState(t)
    setTheme(t)
    applyThemeClass(t)
  }, [applyThemeClass])

  const searchEngine = useMemo(() => {
    if (!config.features.search) return null
    return new SearchEngine(allNotes.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content
    })))
  }, [allNotes, config.features.search])

  const searchResults = useMemo(() => {
    if (!config.features.search || !searchEngine || !debouncedKeyword.trim()) return null
    const results = searchEngine.search(debouncedKeyword, { fuzzy: true, limit: 50 })
    const matchedIds = new Set(results.map(r => r.item.id))
    return allNotes
      .filter(note => matchedIds.has(note.id))
      .sort((a, b) => {
        const scoreA = results.find(r => r.item.id === a.id)?.score || 0
        const scoreB = results.find(r => r.item.id === b.id)?.score || 0
        return scoreB - scoreA
      })
  }, [debouncedKeyword, allNotes, searchEngine, config.features.search])

  const baseNotes = searchResults !== null ? searchResults : allNotes
  const filteredNotes = useMemo(() => {
    let notes = baseNotes
    if (showFavorites && config.features.favorites) notes = notes.filter(n => favorites.includes(n.id))
    return notes.filter(note => {
      const matchCategory = activeCategory === null || note.category_id === activeCategory
      const matchSubCategory = !activeSubCategory || note.sub_category === activeSubCategory
      return matchCategory && matchSubCategory
    })
  }, [baseNotes, activeCategory, activeSubCategory, showFavorites, favorites, config.features.favorites])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (config.features.search && (e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        return
      }
      if (e.key === 'Escape' && selectedNote) {
        setSelectedNote(null)
        setShowList(true)
        return
      }
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && filteredNotes.length > 0) {
        e.preventDefault()
        const currentIndex = selectedNote ? filteredNotes.findIndex(n => n.id === selectedNote.id) : -1
        let newIndex: number
        if (e.key === 'ArrowUp') {
          newIndex = currentIndex <= 0 ? filteredNotes.length - 1 : currentIndex - 1
        } else {
          newIndex = currentIndex >= filteredNotes.length - 1 ? 0 : currentIndex + 1
        }
        setSelectedNote(filteredNotes[newIndex])
        setShowList(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNote, filteredNotes, config.features.search])

  const notesForCount = useMemo(() => 
    showFavorites ? baseNotes.filter(n => favorites.includes(n.id)) : baseNotes
  , [showFavorites, baseNotes, favorites])

  // 预计算分类笔记数量和子分类，避免重复计算
  const categoryStats = useMemo(() => {
    const stats = new Map<number, { count: number; subCategories: string[] }>()
    categories.forEach(cat => {
      const catNotes = notesForCount.filter(n => n.category_id === cat.id)
      const subCats = new Set<string>()
      catNotes.forEach(n => { if (n.sub_category) subCats.add(n.sub_category) })
      stats.set(cat.id, { count: catNotes.length, subCategories: Array.from(subCats).sort() })
    })
    return stats
  }, [categories, notesForCount])

  const getSubCategories = useCallback((categoryId: number) => 
    categoryStats.get(categoryId)?.subCategories || []
  , [categoryStats])

  const getNoteCount = useCallback((categoryId: number) => 
    categoryStats.get(categoryId)?.count || 0
  , [categoryStats])

  const toggleCategory = useCallback((catId: number) => 
    setExpandedCategories(prev => prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId])
  , [])

  const getSubCategoryDisplayName = (subCat: string) => subCat
  const getCategoryName = useCallback((id: number) => categories.find(c => c.id === id)?.name || i18n.allNotes, [categories, i18n.allNotes])
  
  const handleSelectNote = (note: Note, scrollToView = false) => {
    setSelectedNote(note)
    setShowList(false)
    updateUrl(note.url, note.title)
    if (!filteredNotes.find(n => n.id === note.id)) {
      setActiveCategory(note.category_id ?? null)
      setActiveSubCategory(note.sub_category || null)
      setShowFavorites(false)
      setSearchKeyword('')
    }
    if (scrollToView) {
      setTimeout(() => {
        const el = document.getElementById(`note-item-${note.id}`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }
  
  const handleBack = () => { 
    setSelectedNote(null)
    setShowList(true)
    if (activeCategory) {
      const cat = categories.find(c => c.id === activeCategory)
      if (cat) {
        updateUrl(cat.url, cat.name)
      } else {
        updateUrl('/')
      }
    } else {
      updateUrl('/')
    }
  }
  
  const handleToggleFavorite = (noteId: number) => { 
    toggleFavorite(noteId)
    setFavorites(getFavorites()) 
  }

  // 批量更新分类状态，减少重渲染
  const handleCategoryClick = useCallback((catId: number | null, catUrl: string, catName: string, hasSubCats: boolean) => {
    if (hasSubCats && catId !== null) toggleCategory(catId)
    setActiveCategory(catId)
    setActiveSubCategory(null)
    setSelectedNote(null)
    setSidebarOpen(false)
    setShowList(true)
    setShowFavorites(false)
    updateUrl(catUrl, catName)
  }, [toggleCategory, updateUrl])

  const handleSubCategoryClick = useCallback((catId: number, subCat: string, catUrl: string, catName: string) => {
    setActiveCategory(catId)
    setActiveSubCategory(subCat)
    setSelectedNote(null)
    setSidebarOpen(false)
    setShowList(true)
    setShowFavorites(false)
    updateUrl(`${catUrl}/${encodeURIComponent(subCat)}`, `${catName} - ${subCat}`)
  }, [updateUrl])

  const seoData = useMemo(() => {
    if (!selectedNote) return { article: undefined, breadcrumbs: undefined }
    const cat = categories.find(c => c.id === selectedNote.category_id)
    return {
      article: {
        title: selectedNote.title,
        description: selectedNote.content.substring(0, 150).replace(/[#*`\n]/g, ''),
        category: cat?.name || '未分类',
        slug: selectedNote.slug
      },
      breadcrumbs: [
        { name: '首页', url: '/' },
        ...(cat ? [{ name: cat.name, url: cat.url }] : []),
        { name: selectedNote.title, url: selectedNote.url }
      ]
    }
  }, [selectedNote, categories])

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      <SEO article={seoData.article} breadcrumbs={seoData.breadcrumbs} />
      <style jsx global>{`
        :root { --theme-color: ${themeColor}; }
        .theme-bg { background-color: ${themeColor}; }
        .theme-text { color: ${themeColor}; }
        .theme-border { border-color: ${themeColor}; }
        .theme-bg-light { background-color: ${themeColor}10; }
        .theme-ring:focus { --tw-ring-color: ${themeColor}; }
      `}</style>

      <header className="h-14 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between flex-shrink-0 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          {config.logo?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={config.logo.image} alt={config.name} className="w-8 h-8 rounded" />
          ) : (
            <div className="w-8 h-8 theme-bg flex items-center justify-center rounded">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
          )}
          <span className="font-semibold text-gray-900 dark:text-gray-100 hidden sm:block">{config.logo?.text || config.name}</span>
        </div>
        {config.features.search && (
          <div className="flex-1 max-w-md mx-4 sm:mx-8">
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input ref={searchInputRef} type="text" placeholder={i18n.searchPlaceholder} value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full h-9 pl-9 pr-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 theme-ring focus:bg-white dark:focus:bg-gray-700 transition-colors" />
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:block">{version}</span>
          {config.features.darkMode && mounted && (
            <button onClick={() => handleThemeChange(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" title={`当前: ${theme === 'dark' ? '深色' : theme === 'light' ? '浅色' : '跟随系统'}`}>
              {theme === 'dark' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
               : theme === 'light' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
               : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            </button>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{notesForCount.length} {i18n.articles}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-52 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} pt-14 lg:pt-0 overflow-y-auto flex-shrink-0`}>
          <div className="p-2">
            <button onClick={() => handleCategoryClick(null, '/', i18n.allNotes, false)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${activeCategory === null && !showFavorites ? 'theme-bg-light theme-text font-medium border-l-[3px] theme-border' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>
              <span>{i18n.allNotes}</span>
              <span className={`text-xs ${activeCategory === null && !showFavorites ? 'theme-text' : 'text-gray-400'}`}>{baseNotes.length}</span>
            </button>
            {config.features.favorites && (
              <button onClick={() => { setShowFavorites(!showFavorites); setActiveCategory(null); setActiveSubCategory(null); setSelectedNote(null); setSidebarOpen(false); setShowList(true); updateUrl(generateFavoritesUrl(), i18n.favorites) }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between mt-1 ${showFavorites ? 'bg-[#fffbeb] text-[#d97706] font-medium border-l-[3px] border-[#d97706]' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill={showFavorites ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  {i18n.favorites}
                </span>
                <span className={`text-xs ${showFavorites ? 'text-[#d97706]' : 'text-gray-400'}`}>{favorites.length}</span>
              </button>
            )}
            <div className="mt-4 mb-2 px-3"><span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{i18n.categories}</span></div>
            {categories.map(cat => {
              const subCats = getSubCategories(cat.id)
              const hasSubCats = subCats.length > 0
              const isExpanded = expandedCategories.includes(cat.id)
              const isActive = activeCategory === cat.id && !activeSubCategory && !showFavorites
              return (
                <div key={cat.id} className="mb-1">
                  <button onClick={() => handleCategoryClick(cat.id, cat.url, cat.name, hasSubCats)}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between group ${isActive ? 'theme-bg-light theme-text font-medium border-l-[3px] theme-border' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>
                    <span className="flex items-center gap-2">
                      {hasSubCats && <svg className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                      <span>{cat.name}</span>
                    </span>
                    <span className={`text-xs ${isActive ? 'theme-text' : 'text-gray-400'}`}>{getNoteCount(cat.id)}</span>
                  </button>
                  {hasSubCats && isExpanded && (
                    <div className="ml-5 mt-1 pl-3 border-l-2 border-gray-100 dark:border-gray-700 space-y-1">
                      {subCats.map(subCat => {
                        const isSubActive = activeCategory === cat.id && activeSubCategory === subCat && !showFavorites
                        const subCatCount = categoryStats.get(cat.id)?.subCategories.includes(subCat) 
                          ? notesForCount.filter(n => n.category_id === cat.id && n.sub_category === subCat).length 
                          : 0
                        return (
                          <button key={subCat} onClick={() => handleSubCategoryClick(cat.id, subCat, cat.url, cat.name)}
                            className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${isSubActive ? 'theme-bg-light theme-text font-medium' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}>
                            <span>{getSubCategoryDisplayName(subCat)}</span>
                            <span className={`text-xs ${isSubActive ? 'theme-text' : 'text-gray-400'}`}>{subCatCount}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </aside>


        <div className={`w-full md:w-80 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex-shrink-0 bg-gray-50 dark:bg-gray-800 ${!showList && selectedNote ? 'hidden md:block' : 'block'}`}>
          <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              {showFavorites ? (<><svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>{i18n.favorites}</>)
               : searchResults !== null ? (<><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>{i18n.search}</>)
               : activeCategory === null ? i18n.allNotes : getCategoryName(activeCategory)}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {filteredNotes.length} {i18n.results}
              {searchResults !== null && debouncedKeyword && <span className="ml-1">· {i18n.keyword}: <span className="theme-text">{debouncedKeyword}</span></span>}
            </p>
          </div>
          <div className="p-2">
            {filteredNotes.map((note) => (
              <div key={note.id} id={`note-item-${note.id}`} onClick={() => handleSelectNote(note)}
                className={`p-3 cursor-pointer mb-1 border-l-[3px] ${selectedNote?.id === note.id ? 'bg-white dark:bg-gray-700 theme-border' : 'border-transparent hover:bg-white dark:hover:bg-gray-700'}`}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-sm font-medium mb-1 flex-1 ${selectedNote?.id === note.id ? 'theme-text' : 'text-gray-800 dark:text-gray-100'}`}>
                    {debouncedKeyword ? <HighlightText text={note.title} keyword={debouncedKeyword} /> : note.title}
                  </h3>
                  {config.features.favorites && favorites.includes(note.id) && <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {debouncedKeyword ? <HighlightText text={note.content.substring(0, 100)} keyword={debouncedKeyword} /> : note.content.substring(0, 80)}...
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-0.5">{getCategoryName(note.category_id ?? 0)}</span>
                </div>
              </div>
            ))}
            {isLoading ? (
              <NoteListSkeleton count={5} />
            ) : filteredNotes.length === 0 ? (
              <EmptyState 
                type={
                  showFavorites 
                    ? 'no-favorites' 
                    : debouncedKeyword 
                      ? 'no-results' 
                      : activeCategory !== null 
                        ? 'empty-category' 
                        : 'no-results'
                } 
                keyword={debouncedKeyword || undefined}
                categoryName={activeCategory !== null ? getCategoryName(activeCategory) : undefined}
              />
            ) : null}
          </div>
        </div>

        <main className={`flex-1 overflow-y-auto bg-white dark:bg-gray-900 ${showList && !selectedNote ? 'hidden md:block' : 'block'}`}>
          {selectedNote ? (
            <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8 sm:py-10">
              {/* 顶部导航栏 */}
              <div className="flex items-center justify-between mb-8">
                <button onClick={handleBack} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  {i18n.backToList}
                </button>
                <nav className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                  <button onClick={() => { setActiveCategory(null); setSelectedNote(null); setShowList(true); updateUrl('/') }} className="hover:text-gray-600 dark:hover:text-gray-300">{i18n.home}</button>
                  {selectedNote.category_id !== undefined && selectedNote.category_id !== null && (
                    <>
                      <span>/</span>
                      <button onClick={() => { const cat = categories.find(c => c.id === selectedNote.category_id); if (cat) { setActiveCategory(cat.id); setSelectedNote(null); setShowList(true); updateUrl(cat.url, cat.name) }}} className="hover:text-gray-600 dark:hover:text-gray-300">{getCategoryName(selectedNote.category_id)}</button>
                    </>
                  )}
                </nav>
              </div>
              <div className="mb-8">
                {/* 标题 */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">{selectedNote.title}</h1>
                
                {/* 元信息行 */}
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">{getCategoryName(selectedNote.category_id ?? 0)}</span>
                  {config.features.readingTime && selectedNote.readingTime && (
                    <span className="flex items-center gap-1 text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {selectedNote.readingTime} {i18n.minuteRead}
                    </span>
                  )}
                  {config.features.favorites && (
                    <button 
                      onClick={() => handleToggleFavorite(selectedNote.id)} 
                      className={`flex items-center gap-1 text-xs transition-colors ${favorites.includes(selectedNote.id) ? 'text-amber-500' : 'hover:text-amber-500'}`}
                    >
                      <svg className="w-3.5 h-3.5" fill={favorites.includes(selectedNote.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                      {favorites.includes(selectedNote.id) ? i18n.favorited : i18n.addFavorite}
                    </button>
                  )}
                </div>

                {/* 标签 */}
                {config.features.tags && selectedNote.tags && selectedNote.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    {selectedNote.tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => { setSearchKeyword(tag); setActiveCategory(null); setSelectedNote(null); setShowList(true) }}
                        className="text-xs px-2 py-0.5 rounded theme-text opacity-70 hover:opacity-100 transition-opacity"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <hr className="border-gray-100 dark:border-gray-800 mb-8" />
              {selectedNote.content && (
                <article className="mt-8">
                  <NoteReader content={selectedNote.content} />
                </article>
              )}
              {config.features.articleNav && (() => {
                const currentIndex = allNotes.findIndex(n => n.id === selectedNote.id)
                const prevNote = currentIndex > 0 ? allNotes[currentIndex - 1] : null
                const nextNote = currentIndex < allNotes.length - 1 ? allNotes[currentIndex + 1] : null
                if (!prevNote && !nextNote) return null
                return (
                  <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between gap-4">
                      {prevNote ? (
                        <button onClick={() => handleSelectNote(prevNote, true)} className="flex-1 text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:theme-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            {i18n.prevArticle}
                          </span>
                          <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:theme-text line-clamp-1">{prevNote.title}</p>
                        </button>
                      ) : <div className="flex-1" />}
                      {nextNote ? (
                        <button onClick={() => handleSelectNote(nextNote, true)} className="flex-1 text-right p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:theme-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                          <span className="text-xs text-gray-400 flex items-center justify-end gap-1">
                            {i18n.nextArticle}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </span>
                          <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:theme-text line-clamp-1">{nextNote.title}</p>
                        </button>
                      ) : <div className="flex-1" />}
                    </div>
                  </div>
                )
              })()}
              
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState type="select-note" />
            </div>
          )}
        </main>
      </div>

      {/* 页脚 - 融入页面 */}
      {config.footer && (
        <footer className="px-4 py-2 flex-shrink-0">
          <div className="flex items-center justify-center gap-3 text-[11px] text-gray-300 dark:text-gray-600">
            {config.footer.copyright && <span>© {new Date().getFullYear()} {config.footer.copyright}</span>}
            {config.footer.links?.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 dark:hover:text-gray-500 transition-colors">{link.name}</a>
            ))}
            {config.features.rss && (
              <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 dark:hover:text-gray-500 transition-colors">RSS</a>
            )}
            {config.footer.showPoweredBy && (
              <span>Powered by <a href="https://github.com/7788dev/aog-notes" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 dark:hover:text-gray-500 transition-colors">AOG Notes</a></span>
            )}
          </div>
        </footer>
      )}
    </div>
  )
}
