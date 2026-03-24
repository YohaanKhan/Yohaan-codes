"use client"
import { useEffect, useState } from "react"
import { codeToHtml } from "shiki"

export default function CodeBlock({ inline, className, children, ...props }: any) {
  const [html, setHtml] = useState<string>("")
  const match = /language-(\w+)/.exec(className || "")
  const lang = match ? match[1] : ""
  const code = String(children).replace(/\n$/, "")

  useEffect(() => {
    if (!inline && lang) {
      codeToHtml(code, {
        lang,
        theme: "github-dark",
      })
        .then((out) => setHtml(out))
        .catch(() => setHtml("")) // silent fallback
    }
  }, [code, lang, inline])

  if (inline) {
    return (
      <code className="bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded text-sm border border-[var(--border)]" {...props}>
        {children}
      </code>
    )
  }

  if (html) {
    // Shiki output gives us a <pre> element internally.
    // We render it directly.
    return <div dangerouslySetInnerHTML={{ __html: html }} className="shiki-wrapper my-4 rounded overflow-hidden text-sm" />
  }

  // fallback while loading shiki
  return (
    <pre className="p-4 rounded bg-[var(--bg-subtle)] border border-[var(--border)] overflow-x-auto text-sm my-4">
      <code className={className} {...props}>
        {code}
      </code>
    </pre>
  )
}
