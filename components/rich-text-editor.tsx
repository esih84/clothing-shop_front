"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Bold,
  Italic,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LinkIcon,
  ImageIcon,
  Heading,
  Quote,
} from "lucide-react"

// Simulating a React-Quill package
interface ReactQuillProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  modules?: any
  formats?: string[]
  theme?: string
}

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

// This is a simulated React-Quill component
function ReactQuill({ value, onChange, placeholder, modules, theme = "snow" }: ReactQuillProps) {
  const [editorValue, setEditorValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setEditorValue(value)
  }, [value])

  const handleChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.innerHTML
    setEditorValue(newValue)
    onChange(newValue)
  }

  return (
    <div className={`quill-editor ${theme} ${isFocused ? "focused" : ""}`}>
      <div className="toolbar">
        {modules?.toolbar && (
          <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b">
            {modules.toolbar.includes("bold") && (
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Bold">
                <Bold className="w-4 h-4" />
              </button>
            )}
            {modules.toolbar.includes("italic") && (
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Italic">
                <Italic className="w-4 h-4" />
              </button>
            )}
            {modules.toolbar.includes("heading") && (
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Heading">
                <Heading className="w-4 h-4" />
              </button>
            )}
            {modules.toolbar.includes("list") && (
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="List">
                <List className="w-4 h-4" />
              </button>
            )}
            {modules.toolbar.includes("align") && (
              <>
                <button type="button" className="p-1 rounded hover:bg-gray-200" title="Align Left">
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-gray-200" title="Align Center">
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-gray-200" title="Align Right">
                  <AlignRight className="w-4 h-4" />
                </button>
              </>
            )}
            {modules.toolbar.includes("quote") && (
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Quote">
                <Quote className="w-4 h-4" />
              </button>
            )}
            {modules.toolbar.includes("link") && (
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Link">
                <LinkIcon className="w-4 h-4" />
              </button>
            )}
            {modules.toolbar.includes("image") && (
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Image">
                <ImageIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
      <div
        className="p-3 outline-none border-t-0 min-h-[200px]"
        contentEditable
        dangerouslySetInnerHTML={{ __html: editorValue }}
        onInput={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
      />
    </div>
  )
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  minHeight = "200px",
}: RichTextEditorProps) {
  // Configure Quill modules and formats
  const modules = {
    toolbar: ["bold", "italic", "heading", "list", "align", "quote", "link", "image"],
  }

  const formats = ["header", "bold", "italic", "list", "bullet", "align", "link", "image"]

  return (
    <div className="border rounded-lg overflow-hidden">
      <style jsx global>{`
        .quill-editor {
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
        }
        .quill-editor.focused {
          box-shadow: 0 0 0 2px #d8f5b4;
        }
        .quill-editor .toolbar {
          border-bottom: 1px solid #e2e8f0;
        }
        [contenteditable]:empty:before {
          content: attr(placeholder);
          color: #a0aec0;
          pointer-events: none;
        }
      `}</style>
      <ReactQuill
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        theme="snow"
      />
    </div>
  )
}
