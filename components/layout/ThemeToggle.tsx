"use client"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true)
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  const toggle = () => {
    setIsDark(!isDark)
  }

  return (
    <button 
      onClick={toggle} 
      className="px-3 py-1 text-sm border border-[var(--border)] rounded hover:bg-[var(--bg-hover)] transition-colors"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  )
}
