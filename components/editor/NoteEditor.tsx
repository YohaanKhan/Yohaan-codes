"use client"
import MDEditor from "@uiw/react-md-editor"
import CodeBlock from "./CodeBlock"

export default function NoteEditor({ 
  initialValue = "", 
  onChange 
}: { 
  initialValue?: string; 
  onChange: (val: string) => void 
}) {
  return (
    <div data-color-mode="auto" className="border border-[var(--border)] rounded overflow-hidden">
      <MDEditor
        value={initialValue}
        onChange={(v) => onChange(v || "")}
        preview="live"
        height={400}
        previewOptions={{
          components: {
            code: CodeBlock as any
          }
        }}
        style={{ borderRadius: 0, border: 'none', backgroundColor: 'var(--bg)' }}
      />
    </div>
  )
}
