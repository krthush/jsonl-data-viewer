"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Expand, Minimize } from "lucide-react"

const JSONRenderer = ({ data, level = 0 }: { data: any; level?: number }) => {
  const [isOpen, setIsOpen] = useState(level < 2) // Auto-expand first 2 levels

  if (typeof data === "string") {
    // Convert \n to actual newlines for display
    const convertedString = data.replace(/\\n/g, "\n")
    return <div className="bg-muted/30 p-2 rounded text-sm font-mono whitespace-pre-wrap">"{convertedString}"</div>
  }

  if (typeof data === "number" || typeof data === "boolean" || data === null) {
    return <span className="text-blue-600 dark:text-blue-400 font-mono">{JSON.stringify(data)}</span>
  }

  if (Array.isArray(data)) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-1 hover:bg-muted/50 p-1 rounded">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-mono text-purple-600 dark:text-purple-400">Array ({data.length} items)</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-4 mt-2 space-y-2 relative">
          {isOpen && (
            <div
              className="absolute left-0 top-0 bottom-0 w-2 bg-muted hover:bg-muted-foreground/20 cursor-pointer transition-colors"
              onClick={() => setIsOpen(false)}
              title="Click to collapse"
            />
          )}
          {data.map((item, index) => (
            <div key={index} className="border-l-2 border-muted pl-3">
              <div className="text-xs text-muted-foreground mb-1">[{index}]</div>
              <JSONRenderer data={item} level={level + 1} />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  if (typeof data === "object" && data !== null) {
    const entries = Object.entries(data)
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-1 hover:bg-muted/50 p-1 rounded">
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
              <JSONRenderer data={value} level={level + 1} />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return <span>{JSON.stringify(data)}</span>
}

export default function TextConverter() {
  const [inputText, setInputText] = useState("")
  const [isInputExpanded, setIsInputExpanded] = useState(false)

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

  const isJSONL = isValidJSONL(inputText)
  const isJSON = !isJSONL && isValidJSON(inputText)
  const convertedText = isJSON || isJSONL ? null : inputText.replace(/\\n/g, "\n")
  const jsonData = isJSON ? processJSON(inputText) : null
  const jsonlData = isJSONL ? processJSONL(inputText) : null

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto px-2">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">JSONL Data Viewer - Training Data Inspector</h1>
          <p className="text-muted-foreground">
            View and explore JSONL training data with newline conversion - ideal for reviewing fine-tuning datasets for
            models on platforms like{" "}
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
                  <div className="min-h-[300px] p-4 border rounded-md bg-muted/20 overflow-auto space-y-4">
                    {jsonlData.map((item, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                          Line {index + 1}
                        </div>
                        <JSONRenderer data={item} />
                      </div>
                    ))}
                  </div>
                ) : isJSON && jsonData ? (
                  <div className="min-h-[300px] p-4 border rounded-md bg-muted/20 overflow-auto">
                    <JSONRenderer data={jsonData} />
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
              {isJSONL ? "Interactive JSONL" : isJSON ? "Interactive JSON" : `${convertedText?.length || 0} characters`}
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
  )
}
