# Simple Note Keeper (LightningJS + Vite)

A minimal note-taking frontend built with LightningJS, themed with "Ocean Professional". It supports listing, creating, editing, and deleting notes, with persistence to localStorage. No backend is required.

Features:
- Notes list (left) and editor (right), responsive (stacks on small screens).
- Create, edit, delete notes.
- Persist to localStorage; seeds a sample note on first run.
- Keyboard shortcuts:
  - Cmd/Ctrl+N: New note
  - Cmd/Ctrl+S: Save note
- Validation: Title is required.
- Subtle rounded corners, shadows, and gradient header.

Theme (Ocean Professional):
- primary: #2563EB
- secondary/success: #F59E0B
- error: #EF4444
- background: #f9fafb
- surface: #ffffff
- text: #111827

Environment variables:
- Uses Vite environment if present. You may set:
  - VITE_PORT (defaults to 3000)
  - VITE_LOG_LEVEL, VITE_NODE_ENV, etc. are optional and not required.

Getting started:
1. Install dependencies
   - npm install
2. Run in this environment (the preview is already configured to run on port 3000)
   - npm run dev
   - In some CI previews, the system starts the dev server automatically; otherwise run the command above.
3. Build (optional)
   - npm run build
4. Preview build (optional)
   - npm run preview

Usage notes:
- Your notes are stored locally in your browser via localStorage and will persist across reloads.
- First run seeds a "Welcome to Simple Note Keeper" note.
- Use the keyboard shortcuts for faster editing:
  - Cmd/Ctrl+N creates a new empty note (focuses the editor).
  - Cmd/Ctrl+S saves the current note.
- If no notes exist, an empty state message will be shown.

Troubleshooting:
- If the canvas doesn't appear, ensure the #app element exists in index.html and that the dev server is running on port 3000.
- If running behind a proxy, set VITE_TRUST_PROXY accordingly in your .env when needed.
