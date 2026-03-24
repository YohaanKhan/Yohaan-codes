"use client"
import MDEditor from "@uiw/react-md-editor"
import CodeBlock from "./CodeBlock"

export default function MarkdownPreview({ source }: { source: string }) {
  if (!source) return <p className="text-[var(--text-faint)] italic text-sm">No notes provided.</p>

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none w-full" data-color-mode="auto">
      <MDEditor.Markdown 
        source={source} 
        style={{ backgroundColor: 'transparent', color: 'var(--text)' }}
        components={{
          code: CodeBlock as any
        }}
      />
    </div>
  )
}
