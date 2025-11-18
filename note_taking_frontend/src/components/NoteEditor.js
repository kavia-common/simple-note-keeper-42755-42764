import lng from '@lightningjs/core';
import { transitions } from '../utils/ui';

/**
 * PUBLIC_INTERFACE
 * NoteEditor supports creating/editing a note: title and content fields, validation, and save action.
 * Emits:
 *  - save({ id, title, content })
 *  - error({ message })
 */
export class NoteEditor extends lng.Component {
  static _template() {
    return {
      rect: true,
      color: 0xffffffff,
      shader: { type: lng.shaders.RoundedRectangle, radius: 12 },
      transitions: { alpha: transitions.medium },
      Header: {
        x: 16,
        y: 14,
        text: {
          text: 'Editor',
          fontSize: 18,
          textColor: 0xff111827,
        },
      },
      Tip: {
        x: 100,
        y: 16,
        text: {
          text: 'Cmd/Ctrl+S to Save',
          fontSize: 14,
          textColor: 0xff6b7280,
        },
      },
      Error: {
        x: 16,
        y: 44,
        text: {
          text: '',
          fontSize: 14,
          textColor: 0xffef4444,
        },
      },
      Fields: {
        x: 16,
        y: 72,
        TitleBg: {
          rect: true,
          w: (w) => w - 32,
          h: 48,
          color: 0xffffffff,
          shader: { type: lng.shaders.RoundedRectangle, radius: 10 },
          stroke: 1,
          strokeColor: 0xffe5e7eb,
          Title: {
            x: 12,
            y: 12,
            text: { text: '', fontSize: 18, textColor: 0xff111827 },
          },
        },
        ContentBg: {
          y: 64,
          rect: true,
          w: (w) => w - 32,
          h: (h) => Math.max(120, h - 160),
          color: 0xffffffff,
          shader: { type: lng.shaders.RoundedRectangle, radius: 10 },
          stroke: 1,
          strokeColor: 0xffe5e7eb,
          Content: {
            x: 12,
            y: 12,
            text: { text: '', fontSize: 16, textColor: 0xff111827, wordWrapWidth: (w) => w - 56, wordWrap: true, maxLines: 999 },
          },
        },
      },
      Footer: {
        x: 16,
        y: (h) => h - 56,
        SaveBtn: {
          rect: true,
          w: 120,
          h: 40,
          color: 0xff2563eb,
          shader: { type: lng.shaders.RoundedRectangle, radius: 10 },
          Label: { x: 16, y: 9, text: { text: 'Save', fontSize: 18, textColor: 0xffffffff } },
        },
      },
      Border: {
        rect: true,
        x: 0,
        y: 0,
        w: (w) => w,
        h: (h) => h,
        color: 0x00ffffff,
        stroke: 1,
        strokeColor: 0xffe5e7eb,
        shader: { type: lng.shaders.RoundedRectangle, radius: 12 },
      },
    };
  }

  _construct() {
    this._note = { id: null, title: '', content: '' };
    this._error = '';
  }

  /**
   * PUBLIC_INTERFACE
   * Load a note or clear for new
   */
  setNote(note) {
    this._note = note ? { ...note } : { id: null, title: '', content: '' };
    this._error = '';
    this._render();
  }

  _render() {
    this.tag('Error').text.text = this._error || '';
    this.tag('Title').text.text = this._note.title || '';
    this.tag('Content').text.text = this._note.content || '';
  }

  _validate() {
    const title = (this.tag('Title').text.text || '').trim();
    if (!title) {
      this._error = 'Title is required';
      this.tag('Error').text.text = this._error;
      return false;
    }
    return true;
  }

  _save() {
    if (!this._validate()) return false;
    const payload = {
      id: this._note.id,
      title: this.tag('Title').text.text,
      content: this.tag('Content').text.text,
    };
    this.signal('save', payload);
    return true;
  }

  _handleEnter() {
    return false;
  }

  _handleClick(evt) {
    const y = evt.y - this.tag('Fields').y;
    if (y < 56) {
      this.tag('TitleBg').strokeColor = 0xff2563eb;
      this.tag('ContentBg').strokeColor = 0xffe5e7eb;
    } else {
      this.tag('TitleBg').strokeColor = 0xffe5e7eb;
      this.tag('ContentBg').strokeColor = 0xff2563eb;
    }
    return true;
  }

  _handleMouseDown(evt) {
    const local = { x: evt.x - this.tag('Footer').x, y: evt.y - this.tag('Footer').y };
    if (local.x >= 0 && local.y >= 0 && local.x <= 120 && local.y <= 40) {
      this._save();
      return true;
    }
    return false;
  }

  /**
   * PUBLIC_INTERFACE
   * Programmatic API to update field values
   */
  setTitle(text) {
    this.tag('Title').text.text = text ?? '';
  }

  /**
   * PUBLIC_INTERFACE
   * Programmatic API to update field values
   */
  setContent(text) {
    this.tag('Content').text.text = text ?? '';
  }
}
