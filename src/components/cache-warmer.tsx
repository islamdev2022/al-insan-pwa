"use client"

import { useEffect } from "react"

export function CacheWarmer() {
  useEffect(() => {
    const warmCache = async () => {
      if ("serviceWorker" in navigator && "caches" in window) {
        try {
          // Wait for service worker to be ready
          const registration = await navigator.serviceWorker.ready

          // Pre-cache critical CSS files
          const criticalResources = [
            "/_next/static/css/app/layout.css",
            "/_next/static/css/app/globals.css",
            "/",
            "/offline",
          ]

          const cache = await caches.open("static-v3")

          for (const resource of criticalResources) {
            try {
              const response = await fetch(resource)
              if (response.ok) {
                await cache.put(resource, response)
                console.log(`Pre-cached: ${resource}`)
              }
            } catch (error) {
              console.warn(`Failed to pre-cache ${resource}:`, error)
            }
          }

          console.log("Cache warming complete")
        } catch (error) {
          console.error("Cache warming failed:", error)
        }
      }
    }

    // Warm cache after a short delay
    setTimeout(warmCache, 1000)
  }, [])

  return null
}
