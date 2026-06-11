"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Expand, Minimize, Upload, Sparkles } from "lucide-react"

const MAX_STRING_LENGTH = 100

const StringValue = ({ value }: { value: string }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const convertedString = value.replace(/\\n/g, "\n")
  const shouldTruncate = convertedString.length > MAX_STRING_LENGTH

  if (!shouldTruncate) {
    return <div className="bg-muted/30 p-2 rounded text-sm font-mono whitespace-pre-wrap">{convertedString}</div>
  }

  return (
    <div className="bg-muted/30 p-2 rounded text-sm font-mono whitespace-pre-wrap space-y-1">
      {isExpanded ? (
        convertedString
      ) : (
        <>
          <div>{convertedString.substring(0, MAX_STRING_LENGTH)}...</div>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            See more
          </button>
        </>
      )}
      {isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          className="block text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          See less
        </button>
      )}
    </div>
  )
}

const TRIM_OPTIONS = [1, 5, 10, 20, 50, 100]

const ArrayRenderer = ({
  data,
  level,
  onUpdateInput,
  defaultDepth = 1,
}: {
  data: any[]
  level: number
  onUpdateInput?: (trimmedData: any[]) => void
  defaultDepth?: number
}) => {
  const [isOpen, setIsOpen] = useState(level < defaultDepth + 1)
  const [trimLimit, setTrimLimit] = useState<number | null>(null)
  const [singleItemIndex, setSingleItemIndex] = useState<number | null>(null)

  const isSingleItemMode = singleItemIndex !== null
  const displayedItems = isSingleItemMode
    ? [data[singleItemIndex]]
    : trimLimit
      ? data.slice(0, trimLimit)
      : data
  const isTrimmed = (trimLimit !== null && trimLimit < data.length) || isSingleItemMode

  const handleUpdateInput = () => {
    if (onUpdateInput) {
      onUpdateInput(displayedItems)
    }
  }

  const handleShowThisOnly = (index: number) => {
    setSingleItemIndex(index)
    setTrimLimit(null)
  }

  const handleClearSingleItem = () => {
    setSingleItemIndex(null)
  }

  const handleTrimSelect = (n: number | null) => {
    setSingleItemIndex(null)
    setTrimLimit(n === trimLimit ? null : n)
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2 flex-wrap">
        <CollapsibleTrigger className="flex items-center gap-1 hover:bg-muted/50 p-1 rounded cursor-pointer">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-mono text-purple-600 dark:text-purple-400">
            Array (
            {isSingleItemMode
              ? `item ${singleItemIndex} of ${data.length}`
              : isTrimmed
                ? `${trimLimit} of ${data.length}`
                : `${data.length}`}{" "}
            items)
          </span>
        </CollapsibleTrigger>
        {data.length > 1 && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Show:</span>
            {TRIM_OPTIONS.filter((n) => n < data.length).map((n) => (
              <button
                key={n}
                onClick={() => handleTrimSelect(n)}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  trimLimit === n && !isSingleItemMode
                    ? "bg-purple-600 text-white"
                    : "bg-muted hover:bg-muted-foreground/20 text-muted-foreground"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => handleTrimSelect(null)}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                trimLimit === null && !isSingleItemMode
                  ? "bg-purple-600 text-white"
                  : "bg-muted hover:bg-muted-foreground/20 text-muted-foreground"
              }`}
            >
              All
            </button>
            {isTrimmed && onUpdateInput && (
              <button
                onClick={handleUpdateInput}
                className="ml-2 px-2 py-0.5 rounded cursor-pointer transition-colors bg-blue-600 text-white hover:bg-blue-700"
              >
                Update Input
              </button>
            )}
          </div>
        )}
      </div>
      <CollapsibleContent className="ml-4 mt-2 space-y-2 relative">
        {isOpen && (
          <div
            className="absolute left-0 top-0 bottom-0 w-2 bg-muted hover:bg-muted-foreground/20 cursor-pointer transition-colors"
            onClick={() => setIsOpen(false)}
            title="Click to collapse"
          />
        )}
        {isSingleItemMode && (
          <div className="text-xs text-muted-foreground pl-3 py-1 flex items-center gap-2">
            <span>Showing only item [{singleItemIndex}]</span>
            <button
              onClick={handleClearSingleItem}
              className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              Show all
            </button>
          </div>
        )}
        {displayedItems.map((item, displayIndex) => {
          const actualIndex = isSingleItemMode ? singleItemIndex! : displayIndex
          return (
            <div key={actualIndex} className="border-l-2 border-muted pl-3">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                <span>[{actualIndex}]</span>
                {!isSingleItemMode && data.length > 1 && (
                  <button
                    onClick={() => handleShowThisOnly(actualIndex)}
                    className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    Show This Only
                  </button>
                )}
              </div>
              <JSONRenderer data={item} level={level + 1} defaultDepth={defaultDepth} />
            </div>
          )
        })}
        {!isSingleItemMode && isTrimmed && (
          <div className="text-xs text-muted-foreground pl-3 py-2">
            ... and {data.length - trimLimit!} more items.{" "}
            <button
              onClick={() => setTrimLimit(null)}
              className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              Show all
            </button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

const JSONRenderer = ({
  data,
  level = 0,
  onUpdateInput,
  defaultDepth = 1,
}: {
  data: any
  level?: number
  onUpdateInput?: (trimmedData: any[]) => void
  defaultDepth?: number
}) => {
  const [isOpen, setIsOpen] = useState(level < defaultDepth + 1)

  if (typeof data === "string") {
    return <StringValue value={data} />
  }

  if (typeof data === "number" || typeof data === "boolean" || data === null) {
    return <span className="text-blue-600 dark:text-blue-400 font-mono">{JSON.stringify(data)}</span>
  }

  if (Array.isArray(data)) {
    return <ArrayRenderer data={data} level={level} onUpdateInput={onUpdateInput} defaultDepth={defaultDepth} />
  }

  if (typeof data === "object" && data !== null) {
    const entries = Object.entries(data)
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-1 hover:bg-muted/50 p-1 rounded cursor-pointer">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-mono text-green-600 dark:text-green-400">Object ({entries.length} properties)</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-4 mt-2 space-y-2 relative">
          {isOpen && (
            <div
              className="absolute left-0 top-0 bottom-0 w-2 bg-muted hover:bg-muted-foreground/20 cursor-pointer transition-colors"
              onClick={() => setIsOpen(false)}
              title="Click to collapse"
            />
          )}
          {entries.map(([key, value]) => (
            <div key={key} className="border-l-2 border-muted pl-3">
              <div className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">{key}:</div>
              <JSONRenderer data={value} level={level + 1} defaultDepth={defaultDepth} />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return <span>{JSON.stringify(data)}</span>
}

const DEPTH_OPTIONS = [
  { value: 0, label: "0" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: Infinity, label: "All" },
]

export default function TextConverter() {
  const [inputText, setInputText] = useState("")
  const [isInputExpanded, setIsInputExpanded] = useState(false)
  const [defaultDepth, setDefaultDepth] = useState(1)

  const isValidJSON = (text: string): boolean => {
    try {
      JSON.parse(text.trim())
      return true
    } catch {
      return false
    }
  }

  const isValidJSONL = (text: string): boolean => {
    const lines = text
      .trim()
      .split("\n")
      .filter((line) => line.trim())
    if (lines.length <= 1) return false

    return lines.every((line) => {
      try {
        JSON.parse(line.trim())
        return true
      } catch {
        return false
      }
    })
  }

  const processJSONL = (jsonlString: string): any[] => {
    try {
      const lines = jsonlString
        .trim()
        .split("\n")
        .filter((line) => line.trim())
      return lines.map((line) => JSON.parse(line.trim()))
    } catch {
      return []
    }
  }

  const processJSON = (jsonString: string): any => {
    try {
      return JSON.parse(jsonString.trim())
    } catch {
      return null
    }
  }

  const handleBeautify = () => {
    const text = inputText.trim()
    if (!text) return

    // Try JSONL first (multiple lines, each valid JSON)
    if (isValidJSONL(text)) {
      const beautified = text
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => JSON.stringify(JSON.parse(line.trim()), null, 2))
        .join("\n")
      setInputText(beautified)
      return
    }

    // Try single JSON
    if (isValidJSON(text)) {
      setInputText(JSON.stringify(JSON.parse(text), null, 2))
      return
    }
  }

  const canBeautify = isValidJSON(inputText.trim()) || isValidJSONL(inputText.trim())

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputText(content)
      }
      reader.readAsText(file)
    }
  }

  const isJSONL = isValidJSONL(inputText)
  const isJSON = !isJSONL && isValidJSON(inputText)
  const convertedText = isJSON || isJSONL ? null : inputText.replace(/\\n/g, "\n")
  const jsonData = isJSON ? processJSON(inputText) : null
  const jsonlData = isJSONL ? processJSONL(inputText) : null

  const handleUpdateInputFromArray = (trimmedData: any[]) => {
    if (isJSONL) {
      // Convert trimmed array back to JSONL format
      const newJsonl = trimmedData.map((item) => JSON.stringify(item)).join("\n")
      setInputText(newJsonl)
    } else if (isJSON) {
      // For JSON, just stringify the trimmed array
      setInputText(JSON.stringify(trimmedData, null, 2))
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-2">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">JSONL Data Viewer - Training Data Inspector</h1>
            <p className="text-muted-foreground">
              View and explore JSONL training data with newline conversion - ideal for reviewing fine-tuning datasets
              for models on platforms like{" "}
              <a
                href="https://platform.openai.com/finetune"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                OpenAI Platform
              </a>
            </p>
          </div>

          <div className="space-y-4">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Input Text
                    <span className="text-sm font-normal text-muted-foreground">(with \n characters)</span>
                    {isJSONL && <Badge variant="secondary">JSONL Detected</Badge>}
                    {isJSON && <Badge variant="secondary">JSON Detected</Badge>}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBeautify}
                      disabled={!canBeautify}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Sparkles className="h-4 w-4" />
                      Beautify
                    </Button>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".jsonl,.json,.txt"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="file-upload"
                      />
                      <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent" asChild>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="h-4 w-4" />
                          Upload File
                        </label>
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsInputExpanded(!isInputExpanded)}
                      className="flex items-center gap-2"
                    >
                      {isInputExpanded ? (
                        <>
                          <Minimize className="h-4 w-4" />
                          Collapse
                        </>
                      ) : (
                        <>
                          <Expand className="h-4 w-4" />
                          Expand
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="input-text">Enter text, JSON, or JSONL with literal \n characters:</Label>
                  <Textarea
                    id="input-text"
                    placeholder={`Text example: Hello\\nWorld\\nThis is a test

JSON example:
{
  "message": "Hello\\nWorld",
  "description": "Line 1\\nLine 2\\nLine 3"
}

JSONL example:
{"message": "Hello\\nWorld", "id": 1}
{"message": "Another\\nLine", "id": 2}`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className={`font-mono text-sm transition-all duration-200 resize-none ${
                      isInputExpanded ? "min-h-[300px]" : "h-20 max-h-20"
                    }`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Converted Output
                    <span className="text-sm font-normal text-muted-foreground">
                      (
                      {isJSONL
                        ? "interactive JSONL with newlines"
                        : isJSON
                          ? "interactive JSON with newlines"
                          : "with actual newlines"}
                      )
                    </span>
                  </CardTitle>
                  {(isJSONL || isJSON) && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Default Output Depth:</span>
                      {DEPTH_OPTIONS.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => setDefaultDepth(option.value)}
                          className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                            defaultDepth === option.value
                              ? "bg-purple-600 text-white"
                              : "bg-muted hover:bg-muted-foreground/20 text-muted-foreground"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="output-text">
                    {isJSONL
                      ? "Interactive JSONL with converted newlines:"
                      : isJSON
                        ? "Interactive JSON with converted newlines:"
                        : "Converted text with actual line breaks:"}
                  </Label>
                  {isJSONL && jsonlData ? (
                    <div key={defaultDepth} className="min-h-[300px] p-4 border rounded-md bg-muted/20 overflow-auto space-y-4">
                      {jsonlData.map((item, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                            Line {index + 1}
                          </div>
                          <JSONRenderer data={item} onUpdateInput={handleUpdateInputFromArray} defaultDepth={defaultDepth} />
                        </div>
                      ))}
                    </div>
                  ) : isJSON && jsonData ? (
                    <div key={defaultDepth} className="min-h-[300px] p-4 border rounded-md bg-muted/20 overflow-auto">
                      <JSONRenderer data={jsonData} onUpdateInput={handleUpdateInputFromArray} defaultDepth={defaultDepth} />
                    </div>
                  ) : (
                    <Textarea
                      id="output-text"
                      value={convertedText || ""}
                      readOnly
                      className="min-h-[300px] font-mono text-sm bg-muted/50"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Character Count Info */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-4 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg">
              <span>Input: {inputText.length} characters</span>
              <span>•</span>
              <span>
                Output:{" "}
                {isJSONL
                  ? "Interactive JSONL"
                  : isJSON
                    ? "Interactive JSON"
                    : `${convertedText?.length || 0} characters`}
              </span>
              {!isJSON && !isJSONL && (
                <>
                  <span>•</span>
                  <span>Lines: {convertedText?.split("\n").length || 0}</span>
                </>
              )}
              {isJSONL && (
                <>
                  <span>•</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    JSONL Format ({jsonlData?.length || 0} objects)
                  </span>
                </>
              )}
              {isJSON && (
                <>
                  <span>•</span>
                  <span className="text-blue-600 dark:text-blue-400">JSON Format</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center border-t pt-6">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Made with love from the</span>
          <a
            href="https://faved.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img src="/faved-logo.png" alt="Faved" className="h-6" />
          </a>
          <span>team</span>
        </div>
      </div>
    </div>
  )
}
