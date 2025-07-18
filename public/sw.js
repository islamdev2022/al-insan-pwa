const CACHE_VERSION = "v3"
const STATIC_CACHE = `static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`
const OFFLINE_CACHE = `offline-${CACHE_VERSION}`

// Critical resources that MUST be cached
const CRITICAL_RESOURCES = ["/", "/offline", "/manifest.json"]

// Install event - cache critical resources
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...")

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(STATIC_CACHE)

        // Cache critical resources one by one
        for (const resource of CRITICAL_RESOURCES) {
          try {
            const response = await fetch(resource)
            if (response.ok) {
              await cache.put(resource, response)
              console.log(`[SW] Cached: ${resource}`)
            }
          } catch (error) {
            console.warn(`[SW] Failed to cache ${resource}:`, error)
          }
        }

        // Force activation
        await self.skipWaiting()
        console.log("[SW] Installation complete")
      } catch (error) {
        console.error("[SW] Installation failed:", error)
      }
    })(),
  )
})

// Activate event - take control immediately
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...")

  event.waitUntil(
    (async () => {
      try {
        // Delete old caches
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log(`[SW] Deleting old cache: ${cacheName}`)
              return caches.delete(cacheName)
            }
          }),
        )

        // Take control of all clients immediately
        await self.clients.claim()
        console.log("[SW] Activation complete - controlling all clients")
      } catch (error) {
        console.error("[SW] Activation failed:", error)
      }
    })(),
  )
})

// Fetch event - intercept ALL requests
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    return
  }

  // Only handle GET requests
  if (request.method !== "GET") {
    return
  }

  // Intercept ALL requests - this is crucial for mobile
  event.respondWith(handleRequest(request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const isNavigation =
    request.mode === "navigate" ||
    request.destination === "document" ||
    (request.headers.get("accept") && request.headers.get("accept").includes("text/html"))

  console.log(`[SW] Handling request: ${url.pathname}, Navigation: ${isNavigation}`)

  try {
    // For navigation requests (HTML pages)
    if (isNavigation) {
      return await handleNavigation(request)
    }

    // For CSS files - cache aggressively
    if (url.pathname.endsWith(".css") || url.pathname.includes("/_next/static/css/")) {
      return await handleCSS(request)
    }

    // For JS files
    if (url.pathname.endsWith(".js") || url.pathname.includes("/_next/static/")) {
      return await handleStatic(request)
    }

    // For API requests
    if (url.pathname.startsWith("/api/")) {
      return await handleAPI(request)
    }

    // For other resources
    return await handleOther(request)
  } catch (error) {
    console.error(`[SW] Error handling ${url.pathname}:`, error)

    if (isNavigation) {
      return await getOfflinePage()
    }

    return new Response("Resource unavailable", { status: 503 })
  }
}

async function handleNavigation(request) {
  const url = new URL(request.url)
  console.log(`[SW] Navigation request for: ${url.pathname}`)

  try {
    // Try network first with short timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 500) // 0.5 second timeout

    const networkResponse = await fetch(request, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (networkResponse.ok) {
      console.log(`[SW] Network response for navigation: ${url.pathname}`)
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log(`[SW] Deleting old cache: ${cacheName}`)
              return caches.delete(cacheName)
            }
          }),
        )
      // Cache the response
      const cache = await caches.open(DYNAMIC_CACHE)
      await cache.put(request, networkResponse.clone())
      console.log(`[SW] Cached navigation: ${url.pathname}`)
      return networkResponse
    }
  } catch (error) {
    console.log(`[SW] Network failed for ${url.pathname}:`, error.name)
  }

  // Try cache
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    console.log(`[SW] Serving from cache: ${url.pathname}`)
    return cachedResponse
  }

  // Try cache without query params
  const baseUrl = `${url.origin}${url.pathname}`
  const baseCached = await caches.match(baseUrl)
  if (baseCached) {
    console.log(`[SW] Serving base URL from cache: ${baseUrl}`)
    return baseCached
  }

  // Return offline page
  console.log(`[SW] Returning offline page for: ${url.pathname}`)
  return await getOfflinePage()
}

async function handleCSS(request) {
  console.log(`[SW] CSS request: ${request.url}`)

  // Try cache first for CSS
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    console.log(`[SW] CSS from cache: ${request.url}`)
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      await cache.put(request, networkResponse.clone())
      console.log(`[SW] CSS cached: ${request.url}`)
      return networkResponse
    }
  } catch (error) {
    console.error(`[SW] CSS fetch failed: ${request.url}`, error)
  }

  // Return empty CSS as fallback
  return new Response("/* CSS unavailable offline */", {
    headers: { "Content-Type": "text/css" },
  })
}

async function handleStatic(request) {
  // Cache first for static assets
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      await cache.put(request, networkResponse.clone())
      return networkResponse
    }
  } catch (error) {
    console.error(`[SW] Static asset failed: ${request.url}`, error)
  }

  return new Response("Static asset unavailable", { status: 404 })
}

async function handleAPI(request) {
  try {
    return await fetch(request)
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "API unavailable offline",
        offline: true,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

async function handleOther(request) {
  // Stale while revalidate
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)

  // Start background fetch
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => cachedResponse)

  return cachedResponse || fetchPromise
}

async function getOfflinePage() {
  // Try to get cached offline page
  const offlineResponse = await caches.match("/offline")
  if (offlineResponse) {
    return offlineResponse
  }

  // Return inline offline page with embedded styles
  return new Response(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - My PWA</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          max-width: 400px;
          width: 100%;
        }
        .icon {
          width: 64px;
          height: 64px;
          background: #f3f4f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 24px;
        }
        h1 {
          color: #1f2937;
          margin-bottom: 12px;
          font-size: 24px;
        }
        p {
          color: #6b7280;
          margin-bottom: 30px;
          line-height: 1.5;
        }
        .buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        button, .button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s;
        }
        button:hover, .button:hover {
          background: #2563eb;
        }
        .button-secondary {
          background: #f3f4f6;
          color: #374151;
        }
        .button-secondary:hover {
          background: #e5e7eb;
        }
        @media (max-width: 480px) {
          .container { padding: 30px 20px; }
          h1 { font-size: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📱</div>
        <h1>You're Offline</h1>
        <p>No internet connection detected. You can still browse previously visited pages.</p>
        <div class="buttons">
          <button onclick="window.location.reload()">Try Again</button>
          <a href="/" class="button button-secondary">Go to Home</a>
          <button onclick="window.history.back()" class="button-secondary">Go Back</button>
        </div>
      </div>
    </body>
    </html>
  `,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache",
      },
    },
  )
}

// Message handling
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
