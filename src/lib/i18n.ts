/**
 * 国际化配置
 */

export type Locale = 'zh-CN' | 'en'

export interface I18nMessages {
  // 通用
  home: string
  allNotes: string
  favorites: string
  categories: string
  search: string
  searchPlaceholder: string
  noResults: string
  noNotes: string
  noFavorites: string
  
  // 文章
  readingTime: string
  minuteRead: string
  prevArticle: string
  nextArticle: string
  backToList: string
  
  // 收藏
  addFavorite: string
  removeFavorite: string
  favorited: string
  
  // 主题
  theme: string
  themeLight: string
  themeDark: string
  themeSystem: string
  
  // 评论
  comments: string
  
  // 其他
  selectNote: string
  shortcutTip: string
  poweredBy: string
  articles: string
  results: string
  keyword: string
}

const messages: Record<Locale, I18nMessages> = {
  'zh-CN': {
    home: '首页',
    allNotes: '全部笔记',
    favorites: '我的收藏',
    categories: '分类',
    search: '搜索',
    searchPlaceholder: '搜索... (Ctrl+K)',
    noResults: '暂无结果',
    noNotes: '暂无笔记',
    noFavorites: '暂无收藏',
    
    readingTime: '阅读时间',
    minuteRead: '分钟阅读',
    prevArticle: '上一篇',
    nextArticle: '下一篇',
    backToList: '返回列表',
    
    addFavorite: '收藏',
    removeFavorite: '取消收藏',
    favorited: '已收藏',
    
    theme: '主题',
    themeLight: '浅色',
    themeDark: '深色',
    themeSystem: '跟随系统',
    
    comments: '评论',
    
    selectNote: '选择笔记查看详情',
    shortcutTip: '快捷键: ↑↓ 切换 · Esc 返回',
    poweredBy: '由 AOG Notes 驱动',
    articles: '篇',
    results: '条结果',
    keyword: '关键词',
  },
  'en': {
    home: 'Home',
    allNotes: 'All Notes',
    favorites: 'Favorites',
    categories: 'Categories',
    search: 'Search',
    searchPlaceholder: 'Search... (Ctrl+K)',
    noResults: 'No results',
    noNotes: 'No notes',
    noFavorites: 'No favorites',
    
    readingTime: 'Reading time',
    minuteRead: 'min read',
    prevArticle: 'Previous',
    nextArticle: 'Next',
    backToList: 'Back',
    
    addFavorite: 'Favorite',
    removeFavorite: 'Unfavorite',
    favorited: 'Favorited',
    
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    
    comments: 'Comments',
    
    selectNote: 'Select a note to view',
    shortcutTip: 'Shortcuts: ↑↓ Navigate · Esc Back',
    poweredBy: 'Powered by AOG Notes',
    articles: 'articles',
    results: 'results',
    keyword: 'Keyword',
  },
}

export function getMessages(locale: string): I18nMessages {
  return messages[locale as Locale] || messages['zh-CN']
}

export function t(locale: string, key: keyof I18nMessages): string {
  const msgs = getMessages(locale)
  return msgs[key] || key
}
