import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { OfflineIndicator } from "@/components/offline-indicator"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { CacheWarmer } from "@/components/cache-warmer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My PWA App",
  description: "A Progressive Web App built with Next.js",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "My PWA App",
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Aggressive service worker registration for mobile
              if ('serviceWorker' in navigator) {
                // Register immediately
                navigator.serviceWorker.register('/sw.js', { 
                  scope: '/',
                  updateViaCache: 'none'
                })
                .then(function(registration) {
                  console.log('[Main] SW registered:', registration.scope);
                  
                  // Handle updates
                  registration.addEventListener('updatefound', function() {
                    const newWorker = registration.installing;
                    if (newWorker) {
                      newWorker.addEventListener('statechange', function() {
                        if (newWorker.state === 'installed') {
                          if (navigator.serviceWorker.controller) {
                            // New version available
                            console.log('[Main] New SW version available');
                            newWorker.postMessage({type: 'SKIP_WAITING'});
                            window.location.reload();
                          } else {
                            // First time install
                            console.log('[Main] SW installed for first time');
                          }
                        }
                      });
                    }
                  });
                  
                  // Check for updates every 30 seconds when online
                  setInterval(function() {
                    if (navigator.onLine) {
                      registration.update();
                    }
                  }, 30000);
                })
                .catch(function(error) {
                  console.error('[Main] SW registration failed:', error);
                });
                
                // Listen for controller changes
                navigator.serviceWorker.addEventListener('controllerchange', function() {
                  console.log('[Main] SW controller changed');
                  window.location.reload();
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <OfflineIndicator />
        <PWAInstallPrompt />
        <CacheWarmer />
      </body>
    </html>
  )
}
