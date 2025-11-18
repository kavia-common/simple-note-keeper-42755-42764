import lng from '@lightningjs/core';
import { transitions } from '../utils/ui';

/**
 * Renders a scrollable list of notes with selection and deletion.
 * Emits events:
 *  - select({ id })
 *  - delete({ id })
 */
export class NotesList extends lng.Component {
  static _template() {
    return {
      w: 360,
      h: (h) => h,
      rect: true,
      color: 0xffffffff,
      shader: { type: lng.shaders.RoundedRectangle, radius: 12 },
      transitions: { alpha: transitions.medium },
      Header: {
        x: 16,
        y: 14,
        text: {
          text: 'Notes',
          fontSize: 18,
          textColor: 0xff111827,
        },
      },
      Count: {
        x: 80,
        y: 16,
        text: {
          text: '',
          fontSize: 14,
          textColor: 0xff6b7280,
        },
      },
      ListWrap: {
        x: 8,
        y: 48,
        w: (w) => w - 16,
        h: (h) => h - 56,
        clipping: true,
        Items: [],
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
    this._items = [];
    this._selectedId = null;
    this._scrollY = 0;
    this._rowHeight = 64;
    this._gap = 6;
  }

  /**
   * PUBLIC_INTERFACE
   * Provide notes and current selection
   */
  setData(notes, selectedId) {
    this._items = notes || [];
    this._selectedId = selectedId || (this._items[0] && this._items[0].id) || null;
    this._render();
  }

  _render() {
    const items = this._items.map((n, i) => this._row(n, i));
    this.tag('Items').children = items;
    this.tag('Count').text.text = `(${this._items.length})`;
  }

  _row(note, index) {
    const isActive = note.id === this._selectedId;
    const color = isActive ? 0x102563eb : 0x00ffffff;
    return {
      type: Row,
      y: index * (this._rowHeight + this._gap),
      w: (w) => w,
      h: this._rowHeight,
      note,
      active: isActive,
      backgroundColor: color,
      signals: { pressed: '_onRowPressed', remove: '_onRowRemove' },
    };
  }

  _onRowPressed({ id }) {
    this.signal('select', { id });
  }

  _onRowRemove({ id }) {
    this.signal('delete', { id });
  }

  /**
   * PUBLIC_INTERFACE
   * Update current selection highlight
   */
  setSelected(id) {
    this._selectedId = id;
    this._render();
  }

  _handleWheel({ deltaY }) {
    const maxY = Math.max(0, this._items.length * (this._rowHeight + this._gap) - this.tag('ListWrap').h);
    this._scrollY = Math.min(maxY, Math.max(0, this._scrollY + deltaY));
    this.tag('Items').y = -this._scrollY;
    return true;
  }
}

class Row extends lng.Component {
  static _template() {
    return {
      rect: true,
      color: 0x00ffffff,
      shader: { type: lng.shaders.RoundedRectangle, radius: 10 },
      transitions: { color: transitions.quick },
      Bg: {
        rect: true,
        w: (w) => w,
        h: (h) => h,
        color: 0x00ffffff,
        shader: { type: lng.shaders.RoundedRectangle, radius: 10 },
      },
      Title: {
        x: 12,
        y: 12,
        text: { text: '', fontSize: 16, textColor: 0xff111827 },
      },
      Meta: {
        x: 12,
        y: 36,
        text: { text: '', fontSize: 12, textColor: 0xff6b7280 },
      },
      Delete: {
        x: (w) => w - 12,
        y: 12,
        mountX: 1,
        rect: true,
        w: 28,
        h: 28,
        color: 0x00ffffff,
        shader: { type: lng.shaders.RoundedRectangle, radius: 8 },
        Icon: {
          x: 6,
          y: 6,
          text: { text: '🗑', fontSize: 16, textColor: 0xffef4444 },
        },
      },
    };
  }

  set note(v) {
    this._note = v;
    this.tag('Title').text.text = v.title || '(Untitled)';
    const d = new Date(v.updatedAt || Date.now()).toLocaleString();
    this.tag('Meta').text.text = `Updated ${d}`;
  }

  set active(v) {
    this._active = v;
    this._updateColors();
  }

  set backgroundColor(v) {
    this.tag('Bg').color = v;
  }

  _init() {
    this.patch({
      color: 0xffffffff,
    });
    this._updateColors();
  }

  _updateColors() {
    const primary = 0xff2563eb;
    const text = 0xff111827;
    const muted = 0xff6b7280;
    const bg = this._active ? 0x102563eb : 0x00ffffff;
    this.tag('Bg').color = bg;
    this.tag('Title').text.textColor = this._active ? primary : text;
    this.tag('Meta').text.textColor = muted;
  }

  _handleEnter() {
    this.signal('pressed', { id: this._note.id });
    return true;
  }

  _handleClick() {
    this.signal('pressed', { id: this._note.id });
    return true;
  }

  _handleMouseMove() {
    this.color = 0x0d000000;
  }

  _handleMouseLeave() {
    this.color = 0xffffffff;
  }

  _handleMouseDown(evt) {
    // Detect click in delete zone
    const relX = evt.x - this.x;
    if (relX > this.w - 44) {
      this.signal('remove', { id: this._note.id });
    } else {
      this.signal('pressed', { id: this._note.id });
    }
    return true;
  }
}
