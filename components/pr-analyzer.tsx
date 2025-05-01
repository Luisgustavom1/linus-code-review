"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, AlertCircle, MessageSquare } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Dictionary } from "@/lib/dictionaries"

interface PrAnalyzerProps {
  dict: Dictionary
  lang: string
}

export function PrAnalyzer({ dict, lang }: PrAnalyzerProps) {
  const [prUrl, setPrUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!prUrl) {
      setError(dict.errors.emptyUrl)
      return
    }

    const lastPart = prUrl.split('/').pop()
    const endsWithFiles = lastPart?.includes("files") || lastPart?.includes("checks") || lastPart?.includes("commits")
    if (!prUrl.startsWith("https://github.com/") || (lastPart && endsWithFiles)) {
      setError(dict.errors.emptyUrl)
      return
    }

    try {
      setIsAnalyzing(true)
      setError(null)
      setAnalysis(null)
      const cleanUrl = prUrl.endsWith("/") ? prUrl.slice(0, -1) : prUrl
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${lang}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prUrl: cleanUrl }),
      })
      const { result } = await response.json()
      setAnalysis(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.errors.failed)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <>
      <Card className="p-6 bg-gray-50 border-gray-300">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">{dict.form.title}</h2>
          <p className="text-gray-600">{dict.form.warning}</p>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder={dict.form.placeholder}
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              className="flex-1"
              disabled={isAnalyzing}
            />
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="md:w-auto w-full bg-red-600 hover:bg-red-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {dict.form.analyzing}
                </>
              ) : (
                dict.form.submit
              )}
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{dict.errors.title}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysis && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-start gap-4">
            <MessageSquare className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center">
                <span className="text-red-600">{dict.results.title}</span>
              </h2>
              <div className="whitespace-pre-wrap text-gray-800 font-mono">
                {analysis.split("\n").map((line, i) => (
                  <p key={i} className="mb-2">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
