import { useState } from "react"
import type { PatternContent } from "@/lib/types"

const TABS = [
  { id: "description", label: "Description" },
  { id: "whenToUse", label: "When to Use" },
  { id: "approach", label: "Approach" },
  { id: "complexity", label: "Complexity" },
  { id: "codeTemplate", label: "Code Template" },
  { id: "variations", label: "Variations" }
] as const

export default function PatternContentTabs({ 
  content, 
  onChange 
}: { 
  content: PatternContent;
  onChange: (patch: Partial<PatternContent>) => void;
}) {
  const [activeTab, setActiveTab] = useState<keyof PatternContent>("description")

  return (
    <div className="border border-[var(--border)] rounded bg-[var(--bg)] shadow-sm overflow-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-[var(--border)] bg-[var(--bg-subtle)] flex md:flex-col overflow-x-auto shrink-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as keyof PatternContent)}
            className={`px-4 py-3 text-sm font-semibold text-left whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-[var(--bg)] font-bold text-[var(--accent)] border-l-2 border-[var(--accent)]' : 'hover:bg-[var(--bg-hover)] text-[var(--text-muted)] border-l-2 border-transparent'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 bg-[var(--bg)] min-h-[300px] flex flex-col">
        <textarea
          value={content[activeTab]}
          onChange={(e) => onChange({ [activeTab]: e.target.value })}
          placeholder={`Enter content for ${activeTab} here...`}
          className="w-full h-full min-h-[300px] p-6 resize-y bg-transparent focus:outline-none font-mono text-sm text-[var(--text)] leading-relaxed"
        />
      </div>
    </div>
  )
}
