"use client"

import { Wifi, RefreshCw, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Wifi className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">You're Offline</CardTitle>
          <CardDescription className="text-gray-600">
            No internet connection detected. You can still browse cached content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-500 space-y-2">
            <p>While offline, you can:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>View previously loaded pages</li>
              <li>Access cached content</li>
              <li>Use basic app features</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button onClick={() => window.location.reload()} className="w-full" variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </Link>

            <Button onClick={() => window.history.back()} variant="ghost" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="text-xs text-gray-400 text-center pt-4">
            <p>Check your connection and try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
