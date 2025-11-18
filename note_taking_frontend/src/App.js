import Blits from '@lightningjs/blits';
import { Header } from './components/Header';
import { NotesList } from './components/NotesList';
import { NoteEditor } from './components/NoteEditor';
import { ensureSeed, saveNotes } from './utils/storage';
import { isNewShortcut, isSaveShortcut } from './utils/keyboard';

/**
 * PUBLIC_INTERFACE
 * Root App: Blits component that manages notes state, layout, and keyboard shortcuts.
 */
export default Blits.Component('App', function () {
  // State
  this._notes = ensureSeed();
  this._selectedId = this._notes[0]?.id || null;

  // Signals binding for child components happens via methods below
  this.select = ({ id }) => {
    this._selectedId = id;
    this._syncUI();
  };
  this.delete = ({ id }) => {
    const idx = this._notes.findIndex((n) => n.id === id);
    if (idx >= 0) {
      this._notes.splice(idx, 1);
      if (this._selectedId === id) {
        this._selectedId = this._notes[0]?.id || null;
      }
      saveNotes(this._notes);
      this._syncUI();
    }
  };
  this.save = ({ id, title, content }) => {
    const now = Date.now();
    if (id) {
      const idx = this._notes.findIndex((n) => n.id === id);
      if (idx >= 0) {
        this._notes[idx] = { ...this._notes[idx], title, content, updatedAt: now };
      }
    } else {
      const newId = self.crypto?.randomUUID ? self.crypto.randomUUID() : String(now);
      const newNote = { id: newId, title, content, updatedAt: now };
      this._notes.unshift(newNote);
      this._selectedId = newId;
    }
    saveNotes(this._notes);
    this._syncUI();
  };

  this._createNewNote = () => {
    this._selectedId = null;
    this.tag('EditorWrap').setNote({ id: null, title: '', content: '' });
    this._syncUI();
  };

  this._saveCurrentNote = () => {
    const editor = this.tag('EditorWrap');
    const title = editor.tag('Title').text.text || '';
    const content = editor.tag('Content').text.text || '';
    if (!(title || '').trim()) {
      editor.tag('Error').text.text = 'Title is required';
      return;
    }
    const id = editor._note?.id || null;
    this.save({ id, title, content });
  };

  // Lifecycle
  this._setup = () => {
    // Keyboard listeners for new/save
    window.addEventListener('keydown', (e) => {
      if (isNewShortcut(e)) {
        e.preventDefault();
        this._createNewNote();
      } else if (isSaveShortcut(e)) {
        e.preventDefault();
        this._saveCurrentNote();
      }
    });

    // Initial UI sync and responsive layout
    this._syncUI();
    this._applyResponsive();
    window.addEventListener('resize', () => {
      this._applyResponsive();
    });
  };

  this._applyResponsive = () => {
    const content = this.tag('Content');
    const notes = this.tag('NotesWrap');
    const editor = this.tag('EditorWrap');
    const width = content.w || 1024;
    const height = content.h || (window.innerHeight - 112);

    if (width < 800) {
      // Stacked
      notes.w = content.w;
      notes.h = Math.floor(height * 0.45);
      notes.x = 0;
      notes.y = 0;

      editor.x = 0;
      editor.y = notes.h + 12;
      editor.w = content.w;
      editor.h = height - editor.y;
    } else {
      // Split view
      notes.x = 0;
      notes.y = 0;
      notes.w = Math.min(360, Math.floor(content.w * 0.35));
      notes.h = height;

      editor.x = notes.w + 16;
      editor.y = 0;
      editor.w = content.w - (notes.w + 16);
      editor.h = height;
    }
  };

  this._syncUI = () => {
    this.tag('Header').setTitle('Simple Note Keeper');
    this.tag('NotesWrap').setData(this._notes, this._selectedId);

    const note = this._notes.find((n) => n.id === this._selectedId);
    this.tag('EditorWrap').setNote(note || { id: null, title: '', content: '' });

    const has = this._notes.length > 0;
    this.tag('Content').alpha = has ? 1 : 0;
    this.tag('EmptyState').alpha = has ? 0 : 1;
  };

  // Template
  this.template = () => ({
    color: 0xfff9fafb,
    Header: {
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
        signals: { select: true, delete: true },
      },
      EditorWrap: {
        type: NoteEditor,
        x: (w) => Math.min(360 + 16, Math.floor(w * 0.35) + 16),
        y: 0,
        w: (w) => w - (Math.min(360, Math.floor(w * 0.35)) + 16),
        h: (h) => h,
        signals: { save: true, error: true },
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
      y: (h) => h - 12,
      mountY: 1,
      text: {
        text: 'Shortcuts: Cmd/Ctrl+N New • Cmd/Ctrl+S Save',
        fontSize: 14,
        textColor: 0xff6b7280,
      },
    },
  });
});
