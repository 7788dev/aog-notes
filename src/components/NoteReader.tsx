'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  language: string
  code: string
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const lineCount = code.split('\n').length

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 检测是否为暗色模式
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')

  return (
    <div className="not-prose my-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-5 py-3 bg-gray-100 dark:bg-[#252526] border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[var(--theme-color)]"></span>
          <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">{language || 'code'}</span>
        </div>
        <div className="flex items-center gap-4">
          {lineCount > 20 && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-[var(--theme-color)] text-xs transition-colors"
            >
              {collapsed ? '展开代码' : '收起代码'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-[var(--theme-color)] text-xs transition-colors"
          >
            {copied ? '✓ 已复制' : '复制代码'}
          </button>
        </div>
      </div>
      <div className={collapsed ? 'max-h-60 overflow-hidden relative' : ''}>
        <SyntaxHighlighter
          style={isDark ? oneDark : oneLight}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '20px 24px',
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.75'
          }}
        >
          {code}
        </SyntaxHighlighter>
        {collapsed && (
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-50 dark:from-[#1e1e1e] to-transparent" />
        )}
      </div>
    </div>
  )
}

interface NoteReaderProps {
  content: string
}

export default function NoteReader({ content }: NoteReaderProps) {
  return (
    <article className="
      prose prose-slate dark:prose-invert max-w-none

      /* 标题 */
      prose-headings:font-semibold
      prose-h1:text-2xl prose-h1:text-gray-800 dark:prose-h1:text-gray-100
      prose-h1:pb-4 prose-h1:mb-8 prose-h1:border-b prose-h1:border-gray-200 dark:prose-h1:border-gray-700

      prose-h2:text-lg prose-h2:mt-10 prose-h2:mb-5
      prose-h2:text-gray-800 dark:prose-h2:text-gray-100
      prose-h2:pl-3 prose-h2:border-l-[3px] prose-h2:border-[var(--theme-color)]

      prose-h3:text-base prose-h3:mt-8 prose-h3:mb-4
      prose-h3:text-gray-700 dark:prose-h3:text-gray-200

      prose-h4:text-[15px] prose-h4:font-medium prose-h4:mt-6 prose-h4:mb-3
      prose-h4:text-gray-600 dark:prose-h4:text-gray-300

      /* 段落 */
      prose-p:text-[15px] prose-p:leading-8 prose-p:my-5
      prose-p:text-gray-600 dark:prose-p:text-gray-300

      /* 列表 */
      prose-li:text-[15px] prose-li:leading-8 prose-li:my-1.5
      prose-li:text-gray-600 dark:prose-li:text-gray-300
      prose-ul:my-5 prose-ul:pl-6
      prose-ol:my-5 prose-ol:pl-6

      /* 行内代码 */
      prose-code:text-sm prose-code:font-normal
      prose-code:bg-gray-100 dark:prose-code:bg-gray-800
      prose-code:text-[#d63384] dark:prose-code:text-[#f08d70]
      prose-code:px-2 prose-code:py-1 prose-code:rounded
      prose-code:before:content-none prose-code:after:content-none

      /* 代码块 */
      prose-pre:bg-transparent prose-pre:p-0

      /* 表格 */
      prose-table:text-[15px] prose-table:my-8 prose-table:w-full
      prose-table:border prose-table:border-gray-200 dark:prose-table:border-gray-700
      prose-thead:bg-gray-50 dark:prose-thead:bg-gray-800
      prose-th:font-medium prose-th:py-3.5 prose-th:px-5 prose-th:text-left
      prose-th:text-gray-700 dark:prose-th:text-gray-200
      prose-th:border-b prose-th:border-gray-200 dark:prose-th:border-gray-700
      prose-td:py-3.5 prose-td:px-5
      prose-td:text-gray-600 dark:prose-td:text-gray-300
      prose-td:border-b prose-td:border-gray-100 dark:prose-td:border-gray-700
      prose-tr:transition-colors
      hover:prose-tr:bg-gray-50 dark:hover:prose-tr:bg-gray-800/50

      /* 引用块 */
      prose-blockquote:border-l-4 prose-blockquote:border-[var(--theme-color)]
      prose-blockquote:bg-[var(--theme-color)]/5 dark:prose-blockquote:bg-[var(--theme-color)]/10
      prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:rounded-r-lg
      prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300
      prose-blockquote:not-italic prose-blockquote:text-[15px]

      /* 链接 */
      prose-a:text-[var(--theme-color)] prose-a:no-underline hover:prose-a:underline

      /* 加粗 */
      prose-strong:text-gray-800 dark:prose-strong:text-gray-100 prose-strong:font-semibold

      /* 分割线 */
      prose-hr:border-gray-200 dark:prose-hr:border-gray-700 prose-hr:my-10

      /* 图片 */
      prose-img:rounded-lg prose-img:shadow-sm prose-img:my-8
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const codeString = String(children).replace(/\n$/, '')
            if (match || codeString.includes('\n')) {
              return <CodeBlock language={match ? match[1] : 'text'} code={codeString} />
            }
            return <code {...props}>{children}</code>
          },
          table({ children }) {
            return (
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 my-5">
                <table className="m-0 border-none">{children}</table>
              </div>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
