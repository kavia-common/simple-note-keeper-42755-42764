import Blits from '@lightningjs/blits'
import { Header } from './components/Header'
import { NotesList } from './components/NotesList'
import { NoteEditor } from './components/NoteEditor'
import { ensureSeed, saveNotes } from './utils/storage'
import { isNewShortcut, isSaveShortcut } from './utils/keyboard'

/**
 * PUBLIC_INTERFACE
 * Root App: Blits component that manages notes state, layout, and keyboard shortcuts.
 */
export default Blits.Component('App', {
  // PUBLIC_INTERFACE
  /** Root template defining the app layout */
  template: {
    // Ensure the root paints and defines an area
    rect: true,
    color: 0xfff9fafb,
    Header: {
      // Bridge class-based component via Lightning core class reference
      // Blits can mount Lightning components through type
      type: Header,
      x: 16,
      y: 16,
      w: (w) => w - 32,
    },
    Content: {
      x: 16,
      y: 96,
      w: (w) => w - 32,
      h: (h) => h - 112,
      NotesWrap: {
        type: NotesList,
        x: 0,
        y: 0,
        w: (w) => Math.min(360, Math.floor(w * 0.35)),
        h: (h) => h,
        // PUBLIC_INTERFACE signals: select and delete bubble to parent
        signals: { select: true, delete: true },
      },
      EditorWrap: {
        type: NoteEditor,
        x: (w) => Math.min(360 + 16, Math.floor(w * 0.35) + 16),
        y: 0,
        w: (w) => w - (Math.min(360, Math.floor(w * 0.35)) + 16),
        h: (h) => h,
        // PUBLIC_INTERFACE signals: save bubble to parent
        signals: { save: true },
      },
    },
    EmptyState: {
      x: 16,
      y: 96,
      alpha: 0,
      Label: {
        text: {
          text: 'No notes yet. Press Cmd/Ctrl+N to create a new note.',
          fontSize: 18,
          textColor: 0xff6b7280,
          wordWrap: true,
          wordWrapWidth: (w) => w - 32,
        },
      },
    },
    FooterHint: {
      x: 16,
      y: (h) => h - 16,
      mountY: 1,
      text: {
        text: 'Shortcuts: Cmd/Ctrl+N New • Cmd/Ctrl+S Save',
        fontSize: 14,
        textColor: 0xff6b7280,
      },
    },
  },

  /**
   * Component state
   */
  state() {
    const notes = ensureSeed()
    return {
      notes,
      selectedId: notes[0]?.id || null,
    }
  },

  hooks: {
    /**
     * Initialize event listeners and initial layout when component is ready.
     */
    ready() {
      // Keyboard shortcuts (new/save)
      window.addEventListener('keydown', (e) => {
        if (isNewShortcut(e)) {
          e.preventDefault()
          this._createNewNote()
        } else if (isSaveShortcut(e)) {
          e.preventDefault()
          this._saveCurrentNote()
        }
      })

      // Initial render + layout
      this._syncUI()
      this._applyResponsive()

      // Keep layout responsive
      window.addEventListener('resize', () => {
        this._applyResponsive()
      })
    },
  },

  methods: {
    /**
     * PUBLIC_INTERFACE
     * Handle selection coming from NotesList
     */
    select({ id }) {
      this.selectedId = id
      this._syncUI()
    },

    /**
     * PUBLIC_INTERFACE
     * Handle deletion coming from NotesList
     */
    delete({ id }) {
      const idx = this.notes.findIndex((n) => n.id === id)
      if (idx >= 0) {
        this.notes.splice(idx, 1)
        if (this.selectedId === id) {
          this.selectedId = this.notes[0]?.id || null
        }
        saveNotes(this.notes)
        this._syncUI()
      }
    },

    /**
     * PUBLIC_INTERFACE
     * Save a note (create or update) coming from NoteEditor
     */
    save({ id, title, content }) {
      const now = Date.now()
      if (id) {
        const idx = this.notes.findIndex((n) => n.id === id)
        if (idx >= 0) {
          this.notes[idx] = { ...this.notes[idx], title, content, updatedAt: now }
        }
      } else {
        const newId =
          (typeof self !== 'undefined' && self.crypto?.randomUUID)
            ? self.crypto.randomUUID()
            : String(now)
        const newNote = { id: newId, title, content, updatedAt: now }
        this.notes.unshift(newNote)
        this.selectedId = newId
      }
      saveNotes(this.notes)
      this._syncUI()
    },

    // Create new note (clears editor)
    _createNewNote() {
      this.selectedId = null
      const editor = this.$('EditorWrap')
      if (editor && editor.setNote) {
        editor.setNote({ id: null, title: '', content: '' })
      }
      this._syncUI()
    },

    // Save using current editor fields
    _saveCurrentNote() {
      const editor = this.$('EditorWrap')
      if (!editor) return
      const title = editor.tag && editor.tag('Title')?.text?.text
        ? editor.tag('Title').text.text
        : ''
      const content = editor.tag && editor.tag('Content')?.text?.text
        ? editor.tag('Content').text.text
        : ''
      if (!(title || '').trim()) {
        if (editor.tag) {
          editor.tag('Error').text.text = 'Title is required'
        }
        return
      }
      const id = editor._note?.id || null
      this.save({ id, title, content })
    },

    // Update layout responsive split/stack
    _applyResponsive() {
      const content = this.$('Content')
      const notes = this.$('NotesWrap')
      const editor = this.$('EditorWrap')
      if (!content || !notes || !editor) return

      // Resolve dimensions
      const width = typeof content.w === 'number' ? content.w : (this.w || window.innerWidth || 1024)
      const height = typeof content.h === 'number' ? content.h : ((this.h || window.innerHeight || 768) - 112)

      if (width < 800) {
        // Stacked
        notes.x = 0
        notes.y = 0
        notes.w = width
        notes.h = Math.floor(height * 0.45)

        editor.x = 0
        editor.y = notes.h + 12
        editor.w = width
        editor.h = height - editor.y
      } else {
        // Split
        notes.x = 0
        notes.y = 0
        notes.w = Math.min(360, Math.floor(width * 0.35))
        notes.h = height

        editor.x = notes.w + 16
        editor.y = 0
        editor.w = width - (notes.w + 16)
        editor.h = height
      }
    },

    // Sync UI with current state
    _syncUI() {
      const header = this.$('Header')
      header?.setTitle?.('Simple Note Keeper')

      const notesWrap = this.$('NotesWrap')
      notesWrap?.setData?.(this.notes, this.selectedId)

      const note = this.notes.find((n) => n.id === this.selectedId)
      const editor = this.$('EditorWrap')
      editor?.setNote?.(note || { id: null, title: '', content: '' })

      const has = this.notes.length > 0
      const content = this.$('Content')
      const empty = this.$('EmptyState')
      if (content) content.alpha = has ? 1 : 0
      if (empty) empty.alpha = has ? 0 : 1
    },
  },
})
