"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"


export default function NewPatternPage() {
  const [name, setName] = useState("")
  const [summary, setSummary] = useState("")
  const [tags, setTags] = useState("")
  const { addPattern } = useStore()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    addPattern({
      id,
      name,
      summary,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      subquestions: [],
      content: {
        description: "",
        whenToUse: "",
        approach: "",
        complexity: "",
        codeTemplate: "",
        variations: ""
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    router.push(`/patterns/${id}`)
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 flex justify-center">
      <div className="w-full max-w-2xl mt-10">
          <h1 className="text-2xl font-bold mb-6 border-b border-[var(--border)] pb-4">Create New Pattern</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2">Pattern Name</label>
              <input 
                autoFocus
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Sliding Window"
                className="w-full px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--accent)] font-mono text-sm shadow-sm" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2">Summary</label>
              <input 
                type="text" 
                value={summary} 
                onChange={e => setSummary(e.target.value)} 
                placeholder="One-liner description..."
                className="w-full px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--accent)] font-mono text-sm shadow-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2">Tags (comma separated)</label>
              <input 
                type="text" 
                value={tags} 
                onChange={e => setTags(e.target.value)} 
                placeholder="array, pointers, sliding"
                className="w-full px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--accent)] font-mono text-sm shadow-sm" 
              />
            </div>
            <button type="submit" className="px-8 py-3 bg-[var(--accent)] text-[var(--bg)] font-bold rounded hover:opacity-90 shadow-sm w-full sm:w-auto">
              Create Pattern
            </button>
          </form>
        </div>
      </main>
  )
}
