"use client"
import { motion } from "framer-motion"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(2px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(2px)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col flex-1 h-full w-full overflow-hidden bg-[var(--bg)]"
    >
      {children}
    </motion.div>
  )
}
