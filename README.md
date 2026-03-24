# DSA Notes

A high-performance, local-first environment for tracking, studying, and mastering Data Structures and Algorithms (DSA) patterns. Designed as a unified workspace for technical interview preparation.

## Core Architecture

- **Framework**: Next.js (App Router)
- **State Management**: Zustand
- **Persistence Layer**: IndexedDB (via `idb-keyval`)
- **Styling**: Tailwind CSS
- **Transitions**: Framer Motion
- **Editors**: Monaco Editor (Implementation), `@uiw/react-md-editor` (Markdown)

## Features

### Local-First Persistence
All data is stored exclusively in the browser using IndexedDB. The application is fully capable of running offline with zero backend dependencies, prioritizing user privacy and immediate read/write access.

### Pattern Tracking
Organize interview questions by fundamental algorithmic patterns. Each pattern maintains its own structured core logic, including:
- Algorithmic Approach & Logic
- Time and Space Complexity bounds
- Boilerplate Code Templates
- Edge Cases & Variations

### Code Workspace
Integrated dual-pane workspace modeled for active subproblem resolution.
- **Left Pane**: Markdown integration for documenting the underlying logic, approach, and mathematical insight per problem.
- **Right Pane**: Embedded Monaco Editor supporting Python, TypeScript, Java, C++, and Go for active code implementation.

### Spaced Repetition System (SRS)
Built-in review queue utilizing the SM-2 algorithm. Personal insights and logic paradigms are automatically formatted as flashcards and scheduled for subsequent review to enforce long-term memory retention.

### Data Portability
Seamless state migration tools. Export the entire IndexedDB store as a JSON payload for manual backup or cross-device restoration.

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or pnpm

### Installation

1. Clone the repository.
```bash
git clone <repository-url>
cd dsa-notes
```

2. Install dependencies.
```bash
npm install
```

3. Start the development server.
```bash
npm run dev
```

4. Open `http://localhost:3000` in your browser.

## Project Structure

- `/app`: Next.js App Router endpoints and structural layout templates.
- `/components`: Self-contained modular React components (Layout, Pattern Visualization, Subquestion Workspace).
- `/lib`: Core logic interfaces, including the Zustand data store, SM-2 scheduling algorithms, and fuzzy search utilities.

## License

MIT
