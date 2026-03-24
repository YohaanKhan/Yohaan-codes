"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ThemeToggle from "./ThemeToggle"
import { useStore } from "@/lib/store"
import { ChevronRight, ChevronDown, Download, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRef } from "react"

export default function Sidebar() {
  const { patterns, reviewCards, notes, searchQuery, setSearchQuery } = useStore()
  const pathname = usePathname() || ""
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Extract active patternId from URL (e.g. /patterns/sliding-window or /patterns/sliding-window/lc-3)
  const segments = pathname.split("/")
  const activePatternId = segments[1] === "patterns" && segments[2] !== "new" ? segments[2] : null

  const dueCount = reviewCards.filter(c => {
    const parentNote = notes.find(n => n.id === c.noteId)
    const parentPattern = patterns.find(p => p.id === parentNote?.patternId)
    return parentNote && parentPattern && new Date(c.nextDue) <= new Date()
  }).length

  const handleExport = () => {
    const data = { patterns, notes, reviewCards }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `dsa-notes-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const parsed = JSON.parse(text)
        
        if (parsed.patterns || parsed.notes || parsed.reviewCards) {
          useStore.setState({
            patterns: parsed.patterns || [],
            notes: parsed.notes || [],
            reviewCards: parsed.reviewCards || []
          })
          alert("Backup successfully restored! Your storage has been synced.")
        } else {
          alert("Invalid backup file structure.")
        }
      } catch (err) {
        alert("Failed to parse backup file.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--bg-subtle)] flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
        <Link href="/patterns" className="font-bold text-lg hover:text-[var(--text-muted)] transition-colors">
          DSA Notes
        </Link>
        <ThemeToggle />
      </div>
      
      <div className="p-4 border-b border-[var(--border)]">
        <input
          type="text"
          placeholder="Search patterns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      <nav className="flex-1 overflow-y-auto w-full p-4 space-y-1">
        <Link href="/patterns" className="block px-3 py-2 rounded hover:bg-[var(--bg-hover)] transition-colors font-medium">
          All Patterns ({patterns.length})
        </Link>
        <Link href="/patterns/new" className="block px-3 py-2 rounded hover:bg-[var(--bg-hover)] transition-colors text-sm text-[var(--accent)] font-semibold mb-4">
          + New Pattern
        </Link>

        <div className="mt-4 space-y-1">
          {patterns.map(pattern => {
            const isActive = activePatternId === pattern.id
            return (
              <div key={pattern.id}>
                <Link 
                  href={`/patterns/${pattern.id}`}
                  className={`flex items-center justify-between px-3 py-2 rounded transition-colors text-sm ${isActive ? 'bg-[var(--bg-hover)] font-bold' : 'hover:bg-[var(--bg-hover)]'}`}
                >
                  <span className="truncate">{pattern.name}</span>
                  {pattern.subquestions?.length > 0 && (
                     isActive ? <ChevronDown size={14} className="shrink-0" /> : <ChevronRight size={14} className="shrink-0"/>
                  )}
                </Link>
                <AnimatePresence>
                  {isActive && pattern.subquestions?.length > 0 && (
                    <motion.div 
                      key={`child-${pattern.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 mt-1 space-y-1 border-l border-[var(--border)] pl-2 overflow-hidden"
                    >
                      {pattern.subquestions.map(sq => {
                        const isSubActive = segments[3] === sq.id
                        return (
                          <Link 
                            key={sq.id} 
                            href={`/patterns/${pattern.id}/${sq.id}`}
                            className={`flex items-center justify-between px-2 py-1.5 rounded transition-colors text-xs ${isSubActive ? 'bg-[var(--bg)] font-bold text-[var(--accent)] border border-[var(--border)] shadow-sm' : 'hover:bg-[var(--bg-hover)] text-[var(--text-muted)] border border-transparent'}`}
                          >
                            <span className="truncate">{sq.title}</span>
                            {sq.status === "solved" && <span className="text-green-500 shrink-0 font-bold">✓</span>}
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-[var(--border)] space-y-1 bg-[var(--bg)] shrink-0">
        <Link href="/review" className="flex justify-between items-center px-3 py-2 mb-3 rounded hover:bg-[var(--bg-hover)] transition-colors text-sm font-bold">
          <span>Review Sessions Due</span>
          {dueCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
              {dueCount}
            </span>
          )}
        </Link>
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          onChange={handleImport} 
          className="hidden" 
        />
        <div className="flex gap-1">
          <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex justify-center items-center px-2 py-2 rounded hover:bg-[var(--bg-hover)] transition-colors text-[11px] font-bold text-[var(--text-muted)] group" title="Restore Data">
            <span className="flex items-center gap-1.5"><Upload size={14} className="group-hover:text-[var(--accent)] transition-colors" /> Restore</span>
          </button>
          <button onClick={handleExport} className="flex-1 flex justify-center items-center px-2 py-2 rounded hover:bg-[var(--bg-hover)] transition-colors text-[11px] font-bold text-[var(--text-muted)] group" title="Backup Data">
            <span className="flex items-center gap-1.5"><Download size={14} className="group-hover:text-[var(--accent)] transition-colors" /> Backup</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
