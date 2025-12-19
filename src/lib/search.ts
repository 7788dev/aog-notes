/**
 * 搜索引擎 - 实现类似大厂的搜索算法
 * 包含：BM25排序、中文分词、模糊匹配、关键词高亮
 */

// BM25 参数 - 针对中文短文档优化
const BM25_K1 = 1.5  // 词频饱和参数
const BM25_B = 0.5   // 文档长度归一化参数

interface SearchableDoc {
  id: number
  title: string
  content: string
}

interface SearchResult<T> {
  item: T
  score: number
  matches: {
    field: string
    indices: [number, number][]
  }[]
}

// 简单中文分词
function tokenize(text: string): string[] {
  if (!text) return []
  
  const normalized = text.toLowerCase()
  const englishWords = normalized.match(/[a-z][a-z0-9]*/g) || []
  const chineseText = normalized.replace(/[^\u4e00-\u9fa5]/g, '')
  
  const chineseNgrams: string[] = []
  for (let i = 0; i < chineseText.length; i++) {
    chineseNgrams.push(chineseText[i])
    if (i < chineseText.length - 1) {
      chineseNgrams.push(chineseText.slice(i, i + 2))
    }
    if (i < chineseText.length - 2) {
      chineseNgrams.push(chineseText.slice(i, i + 3))
    }
  }
  
  const numbers = normalized.match(/\d+/g) || []
  
  return [...new Set([...englishWords, ...chineseNgrams, ...numbers])]
}

function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix: number[][] = []
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  return matrix[b.length][a.length]
}

function fuzzyMatch(query: string, text: string, threshold = 0.3): boolean {
  if (text.includes(query)) return true
  if (query.length <= 2) return false
  
  const distance = levenshteinDistance(query, text)
  const maxLen = Math.max(query.length, text.length)
  const similarity = 1 - distance / maxLen
  
  return similarity >= (1 - threshold)
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export class SearchEngine<T extends SearchableDoc> {
  private docs: T[] = []
  private tokenizedDocs: Map<number, Map<string, number>> = new Map()
  private docLengths: Map<number, number> = new Map()
  private avgDocLength = 0
  private idf: Map<string, number> = new Map()
  private fieldWeights = {
    title: 5.0,
    content: 1.0
  }

  constructor(docs: T[]) {
    this.docs = docs
    this.buildIndex()
  }

  private buildIndex() {
    const docFreq: Map<string, number> = new Map()
    let totalLength = 0

    this.docs.forEach(doc => {
      const allTokens: string[] = []
      const tokenCounts: Map<string, number> = new Map()

      const fields = ['title', 'content'] as const
      fields.forEach(field => {
        const text = doc[field] as string || ''
        const tokens = tokenize(text)
        tokens.forEach(token => {
          allTokens.push(token)
          tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1)
        })
      })

      this.tokenizedDocs.set(doc.id, tokenCounts)
      this.docLengths.set(doc.id, allTokens.length)
      totalLength += allTokens.length

      const uniqueTokens = new Set(allTokens)
      uniqueTokens.forEach(token => {
        docFreq.set(token, (docFreq.get(token) || 0) + 1)
      })
    })

    this.avgDocLength = totalLength / this.docs.length

    const N = this.docs.length
    docFreq.forEach((df, token) => {
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1)
      this.idf.set(token, idf)
    })
  }

  private bm25Score(queryTokens: string[], docId: number): number {
    const tokenCounts = this.tokenizedDocs.get(docId)
    if (!tokenCounts) return 0

    const docLength = this.docLengths.get(docId) || 0
    let score = 0

    queryTokens.forEach(token => {
      const tf = tokenCounts.get(token) || 0
      const idf = this.idf.get(token) || 0

      if (tf > 0) {
        const numerator = tf * (BM25_K1 + 1)
        const denominator = tf + BM25_K1 * (1 - BM25_B + BM25_B * (docLength / this.avgDocLength))
        score += idf * (numerator / denominator)
      }
    })

    return score
  }

  private fieldBoost(query: string, doc: SearchableDoc): number {
    let boost = 0
    const queryLower = query.toLowerCase()
    const titleLower = doc.title.toLowerCase()
    const contentLower = doc.content.toLowerCase()

    if (titleLower === queryLower) {
      boost += this.fieldWeights.title * 20
    } else if (titleLower.startsWith(queryLower)) {
      boost += this.fieldWeights.title * 10
    } else if (titleLower.includes(queryLower)) {
      boost += this.fieldWeights.title * 6
    }

    if (contentLower.includes(queryLower)) {
      const matchCount = (contentLower.match(new RegExp(escapeRegex(queryLower), 'g')) || []).length
      boost += Math.min(matchCount * 1.5, 12)
    }

    if (contentLower.substring(0, 300).includes(queryLower)) {
      boost += 5
    }

    const titlePos = titleLower.indexOf(queryLower)
    if (titlePos !== -1) {
      boost += Math.max(0, 5 - titlePos * 0.5)
    }

    return boost
  }

  private findMatches(query: string, doc: SearchableDoc): SearchResult<T>['matches'] {
    const matches: SearchResult<T>['matches'] = []
    const queryLower = query.toLowerCase()
    const queryTokens = tokenize(query)

    const fields = ['title', 'content'] as const
    fields.forEach(field => {
      const text = (doc[field] || '').toLowerCase()
      const indices: [number, number][] = []

      let pos = 0
      while ((pos = text.indexOf(queryLower, pos)) !== -1) {
        indices.push([pos, pos + queryLower.length])
        pos += 1
      }

      queryTokens.forEach(token => {
        let tokenPos = 0
        while ((tokenPos = text.indexOf(token, tokenPos)) !== -1) {
          const exists = indices.some(([start, end]) => 
            tokenPos >= start && tokenPos < end
          )
          if (!exists) {
            indices.push([tokenPos, tokenPos + token.length])
          }
          tokenPos += 1
        }
      })

      if (indices.length > 0) {
        indices.sort((a, b) => a[0] - b[0])
        const merged: [number, number][] = [indices[0]]
        for (let i = 1; i < indices.length; i++) {
          const last = merged[merged.length - 1]
          if (indices[i][0] <= last[1]) {
            last[1] = Math.max(last[1], indices[i][1])
          } else {
            merged.push(indices[i])
          }
        }
        matches.push({ field, indices: merged })
      }
    })

    return matches
  }

  search(query: string, options?: { fuzzy?: boolean; limit?: number }): SearchResult<T>[] {
    if (!query.trim()) return []

    const { fuzzy = true, limit = 50 } = options || {}
    const queryTokens = tokenize(query)
    const results: SearchResult<T>[] = []

    this.docs.forEach(doc => {
      let score = this.bm25Score(queryTokens, doc.id)
      score += this.fieldBoost(query, doc)

      if (score < 2 && fuzzy) {
        const titleLower = doc.title.toLowerCase()
        const allText = `${doc.title} ${doc.content}`.toLowerCase()
        
        queryTokens.forEach(token => {
          if (token.length > 2) {
            if (fuzzyMatch(token, titleLower)) {
              score += 2
            }
            const words = allText.split(/\s+/)
            words.forEach(word => {
              if (fuzzyMatch(token, word)) {
                score += 0.3
              }
            })
          }
        })
      }

      if (score > 0) {
        results.push({
          item: doc,
          score,
          matches: this.findMatches(query, doc)
        })
      }
    })

    results.sort((a, b) => b.score - a.score)
    return results.slice(0, limit)
  }
}

export function highlightText(text: string, query: string): string {
  if (!query.trim() || !text) return text

  const queryTokens = tokenize(query)
  let result = text

  const queryRegex = new RegExp(`(${escapeRegex(query)})`, 'gi')
  result = result.replace(queryRegex, '<mark>$1</mark>')

  queryTokens.forEach(token => {
    if (token.length >= 2 && !query.toLowerCase().includes(token)) {
      const tokenRegex = new RegExp(`(${escapeRegex(token)})`, 'gi')
      result = result.replace(tokenRegex, '<mark>$1</mark>')
    }
  })

  return result
}

export { tokenize, escapeRegex }
