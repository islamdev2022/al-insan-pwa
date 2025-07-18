"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Smartphone, Download } from "lucide-react"
import Link from "next/link"
export default function HomePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError)
        })
    }

    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check if app is installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My PWA App</h1>
          <p className="text-xl text-gray-600 mb-6">A Progressive Web App with offline capabilities</p>

          <div className="flex items-center justify-center gap-4">
            <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-2">
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              {isOnline ? "Online" : "Offline"}
            </Badge>
{/* <Link href="/offline">offline</Link>  */}
            {isInstalled && (
              <Badge variant="secondary" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Installed
              </Badge>
            )}
          </div>
        </div>
          
 
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WifiOff className="h-5 w-5" />
                Offline Support
              </CardTitle>
              <CardDescription>Works even without internet connection</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                All cached pages and resources are available offline. The app automatically serves cached content when
                you're not connected.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Installable
              </CardTitle>
              <CardDescription>Install on your device like a native app</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Add to your home screen for quick access and a native app-like experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Responsive
              </CardTitle>
              <CardDescription>Works on all devices and screen sizes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Optimized for mobile, tablet, and desktop with a responsive design.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Test Offline Functionality */}
        <Card>
          <CardHeader>
            <CardTitle>Test Offline Functionality</CardTitle>
            <CardDescription>Try these actions to test the offline capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                Refresh Page
              </Button>

              <Button
                onClick={() => {
                  // Simulate going offline for testing
                  if ("serviceWorker" in navigator) {
                    navigator.serviceWorker.ready.then((registration) => {
                      console.log("Service worker is ready")
                    })
                  }
                }}
                variant="outline"
                className="w-full"
              >
                Test Service Worker
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              To test offline mode: Open DevTools → Network tab → Check "Offline" → Refresh the page
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
