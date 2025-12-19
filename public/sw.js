const CACHE_NAME = 'aog-notes-v1'

// 动态获取 basePath（从 SW 的路径推断）
const getBasePath = () => {
  const swPath = self.location.pathname
  // 如果 sw.js 在子路径下，如 /aog-notes/sw.js，则 basePath 为 /aog-notes
  const match = swPath.match(/^(\/[^/]+)\/sw\.js$/)
  return match ? match[1] : ''
}

const basePath = getBasePath()

// 安装 Service Worker - 不预缓存，避免路径问题
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// 网络优先，失败时使用缓存
self.addEventListener('fetch', (event) => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return

  // 跳过非同源请求
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  // API 请求不缓存
  if (url.pathname.startsWith('/api/')) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 只缓存成功的响应
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // 网络失败时使用缓存
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          // 返回离线页面
          if (event.request.mode === 'navigate') {
            return caches.match(basePath + '/') || caches.match('/')
          }
          return new Response('Offline', { status: 503 })
        })
      })
  )
})
