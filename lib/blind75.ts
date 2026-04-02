import type { Note, Pattern, Subquestion } from "./types"

export type Blind75Entry = {
  completed: boolean
  note: string
  updatedAt: string
}

export type Blind75Question = {
  id: string
  slug: string
  title: string
  url: string
  premium?: boolean
}

export type Blind75Category = {
  id: string
  title: string
  questions: Blind75Question[]
}

function createQuestion(categoryId: string, slug: string, title: string, premium = false): Blind75Question {
  return {
    id: `${categoryId}-${slug}`,
    slug,
    title,
    url: `https://leetcode.com/problems/${slug}/`,
    premium,
  }
}

export const BLIND75_CATEGORIES: Blind75Category[] = [
  {
    id: "array",
    title: "Array",
    questions: [
      createQuestion("array", "two-sum", "Two Sum"),
      createQuestion("array", "best-time-to-buy-and-sell-stock", "Best Time to Buy and Sell Stock"),
      createQuestion("array", "contains-duplicate", "Contains Duplicate"),
      createQuestion("array", "product-of-array-except-self", "Product of Array Except Self"),
      createQuestion("array", "maximum-subarray", "Maximum Subarray"),
      createQuestion("array", "maximum-product-subarray", "Maximum Product Subarray"),
      createQuestion("array", "find-minimum-in-rotated-sorted-array", "Find Minimum in Rotated Sorted Array"),
      createQuestion("array", "search-in-rotated-sorted-array", "Search in Rotated Sorted Array"),
      createQuestion("array", "3sum", "3Sum"),
      createQuestion("array", "container-with-most-water", "Container With Most Water"),
    ],
  },
  {
    id: "binary",
    title: "Binary",
    questions: [
      createQuestion("binary", "sum-of-two-integers", "Sum of Two Integers"),
      createQuestion("binary", "number-of-1-bits", "Number of 1 Bits"),
      createQuestion("binary", "counting-bits", "Counting Bits"),
      createQuestion("binary", "missing-number", "Missing Number"),
      createQuestion("binary", "reverse-bits", "Reverse Bits"),
    ],
  },
  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    questions: [
      createQuestion("dynamic-programming", "climbing-stairs", "Climbing Stairs"),
      createQuestion("dynamic-programming", "coin-change", "Coin Change"),
      createQuestion("dynamic-programming", "longest-increasing-subsequence", "Longest Increasing Subsequence"),
      createQuestion("dynamic-programming", "longest-common-subsequence", "Longest Common Subsequence"),
      createQuestion("dynamic-programming", "word-break", "Word Break Problem"),
      createQuestion("dynamic-programming", "combination-sum-iv", "Combination Sum"),
      createQuestion("dynamic-programming", "house-robber", "House Robber"),
      createQuestion("dynamic-programming", "house-robber-ii", "House Robber II"),
      createQuestion("dynamic-programming", "decode-ways", "Decode Ways"),
      createQuestion("dynamic-programming", "unique-paths", "Unique Paths"),
      createQuestion("dynamic-programming", "jump-game", "Jump Game"),
    ],
  },
  {
    id: "graph",
    title: "Graph",
    questions: [
      createQuestion("graph", "clone-graph", "Clone Graph"),
      createQuestion("graph", "course-schedule", "Course Schedule"),
      createQuestion("graph", "pacific-atlantic-water-flow", "Pacific Atlantic Water Flow"),
      createQuestion("graph", "number-of-islands", "Number of Islands"),
      createQuestion("graph", "longest-consecutive-sequence", "Longest Consecutive Sequence"),
      createQuestion("graph", "alien-dictionary", "Alien Dictionary", true),
      createQuestion("graph", "graph-valid-tree", "Graph Valid Tree", true),
      createQuestion("graph", "number-of-connected-components-in-an-undirected-graph", "Number of Connected Components in an Undirected Graph", true),
    ],
  },
  {
    id: "interval",
    title: "Interval",
    questions: [
      createQuestion("interval", "insert-interval", "Insert Interval"),
      createQuestion("interval", "merge-intervals", "Merge Intervals"),
      createQuestion("interval", "non-overlapping-intervals", "Non-overlapping Intervals"),
      createQuestion("interval", "meeting-rooms", "Meeting Rooms", true),
      createQuestion("interval", "meeting-rooms-ii", "Meeting Rooms II", true),
    ],
  },
  {
    id: "linked-list",
    title: "Linked List",
    questions: [
      createQuestion("linked-list", "reverse-linked-list", "Reverse a Linked List"),
      createQuestion("linked-list", "linked-list-cycle", "Detect Cycle in a Linked List"),
      createQuestion("linked-list", "merge-two-sorted-lists", "Merge Two Sorted Lists"),
      createQuestion("linked-list", "merge-k-sorted-lists", "Merge K Sorted Lists"),
      createQuestion("linked-list", "remove-nth-node-from-end-of-list", "Remove Nth Node From End Of List"),
      createQuestion("linked-list", "reorder-list", "Reorder List"),
    ],
  },
  {
    id: "matrix",
    title: "Matrix",
    questions: [
      createQuestion("matrix", "set-matrix-zeroes", "Set Matrix Zeroes"),
      createQuestion("matrix", "spiral-matrix", "Spiral Matrix"),
      createQuestion("matrix", "rotate-image", "Rotate Image"),
      createQuestion("matrix", "word-search", "Word Search"),
    ],
  },
  {
    id: "string",
    title: "String",
    questions: [
      createQuestion("string", "longest-substring-without-repeating-characters", "Longest Substring Without Repeating Characters"),
      createQuestion("string", "longest-repeating-character-replacement", "Longest Repeating Character Replacement"),
      createQuestion("string", "minimum-window-substring", "Minimum Window Substring"),
      createQuestion("string", "valid-anagram", "Valid Anagram"),
      createQuestion("string", "group-anagrams", "Group Anagrams"),
      createQuestion("string", "valid-parentheses", "Valid Parentheses"),
      createQuestion("string", "valid-palindrome", "Valid Palindrome"),
      createQuestion("string", "longest-palindromic-substring", "Longest Palindromic Substring"),
      createQuestion("string", "palindromic-substrings", "Palindromic Substrings"),
      createQuestion("string", "encode-and-decode-strings", "Encode and Decode Strings", true),
    ],
  },
  {
    id: "tree",
    title: "Tree",
    questions: [
      createQuestion("tree", "maximum-depth-of-binary-tree", "Maximum Depth of Binary Tree"),
      createQuestion("tree", "same-tree", "Same Tree"),
      createQuestion("tree", "invert-binary-tree", "Invert/Flip Binary Tree"),
      createQuestion("tree", "binary-tree-maximum-path-sum", "Binary Tree Maximum Path Sum"),
      createQuestion("tree", "binary-tree-level-order-traversal", "Binary Tree Level Order Traversal"),
      createQuestion("tree", "serialize-and-deserialize-binary-tree", "Serialize and Deserialize Binary Tree"),
      createQuestion("tree", "construct-binary-tree-from-preorder-and-inorder-traversal", "Construct Binary Tree from Preorder and Inorder Traversal"),
      createQuestion("tree", "validate-binary-search-tree", "Validate Binary Search Tree"),
      createQuestion("tree", "kth-smallest-element-in-a-bst", "Kth Smallest Element in a BST"),
      createQuestion("tree", "lowest-common-ancestor-of-a-binary-search-tree", "Lowest Common Ancestor of BST"),
      createQuestion("tree", "implement-trie-prefix-tree", "Implement Trie (Prefix Tree)"),
      createQuestion("tree", "design-add-and-search-words-data-structure", "Add and Search Word"),
      createQuestion("tree", "word-search-ii", "Word Search II"),
      createQuestion("tree", "subtree-of-another-tree", "Subtree of Another Tree"),
    ],
  },
  {
    id: "heap",
    title: "Heap",
    questions: [
      createQuestion("heap", "merge-k-sorted-lists", "Merge K Sorted Lists"),
      createQuestion("heap", "top-k-frequent-elements", "Top K Frequent Elements"),
      createQuestion("heap", "find-median-from-data-stream", "Find Median from Data Stream"),
    ],
  },
]

export function createInitialBlind75Entries(): Record<string, Blind75Entry> {
  return {}
}

export function getBlind75TotalCount() {
  return BLIND75_CATEGORIES.reduce((sum, category) => sum + category.questions.length, 0)
}

function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/\bleetcode premium\b/g, " ")
    .replace(/\bproblem\b/g, " ")
    .replace(/\b(a|an|the|of)\b/g, " ")
    .replace(/\bflip\b/g, "invert")
    .replace(/\bbst\b/g, "binary search tree")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function getSlugFromUrl(url?: string) {
  if (!url) return null
  const match = url.match(/leetcode\.com\/problems\/([^/?#]+)/i)
  return match?.[1]?.toLowerCase() ?? null
}

type LinkedBlind75Record = {
  patternId: string
  patternName: string
  subquestion: Subquestion
  note?: Note
}

export function findBlind75Link(question: Blind75Question, patterns: Pattern[], notes: Note[]): LinkedBlind75Record | null {
  const normalizedTitle = normalizeTitle(question.title)

  for (const pattern of patterns) {
    for (const subquestion of pattern.subquestions) {
      const linkSlug = getSlugFromUrl(subquestion.link)
      const titleMatch = normalizeTitle(subquestion.title) === normalizedTitle
      const slugMatch = linkSlug === question.slug

      if (!titleMatch && !slugMatch) continue

      return {
        patternId: pattern.id,
        patternName: pattern.name,
        subquestion,
        note: notes.find((entry) => entry.patternId === pattern.id && entry.subquestionId === subquestion.id),
      }
    }
  }

  return null
}

export function getBlind75QuestionState(
  question: Blind75Question,
  patterns: Pattern[],
  notes: Note[],
  entries: Record<string, Blind75Entry>
) {
  const linked = findBlind75Link(question, patterns, notes)
  const entry = entries[question.slug]
  const isSolvedInWorkspace = linked?.subquestion.status === "solved"
  const hasWorkspaceNote = Boolean(linked?.note)

  return {
    entry,
    linked,
    completed: Boolean(entry?.completed || isSolvedInWorkspace),
    isSolvedInWorkspace,
    hasWorkspaceNote,
  }
}

export function getBlind75Progress(
  patterns: Pattern[],
  notes: Note[],
  entries: Record<string, Blind75Entry>
) {
  const categories = BLIND75_CATEGORIES.map((category) => {
    const completed = category.questions.filter((question) =>
      getBlind75QuestionState(question, patterns, notes, entries).completed
    ).length

    return {
      ...category,
      completed,
      total: category.questions.length,
      percentage: Math.round((completed / category.questions.length) * 100),
    }
  })

  const total = categories.reduce((sum, category) => sum + category.total, 0)
  const completed = categories.reduce((sum, category) => sum + category.completed, 0)

  return {
    categories,
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  }
}
