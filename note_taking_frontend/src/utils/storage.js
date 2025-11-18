const STORAGE_KEY = 'simple-note-keeper.notes.v1';

/**
 * Get notes array from localStorage.
 * @returns {Array<{id:string,title:string,content:string,updatedAt:number}>}
 */
export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/**
 * Save notes array into localStorage.
 * @param {Array} notes
 */
export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore storage errors (quota, etc.)
  }
}

/**
 * Ensure there is at least one sample note on first run.
 * @returns {Array} The current notes after seeding if needed.
 */
export function ensureSeed() {
  const existing = loadNotes();
  if (existing.length > 0) return existing;
  const now = Date.now();
  const sample = [
    {
      id: (typeof self !== 'undefined' && self.crypto?.randomUUID)
        ? self.crypto.randomUUID()
        : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(now)),
      title: 'Welcome to Simple Note Keeper',
      content:
        'This is a sample note. Edit me, create a new one with Cmd/Ctrl+N, and save with Cmd/Ctrl+S.\n\nNotes are saved in your browser.',
      updatedAt: now,
    },
  ];
  saveNotes(sample);
  return sample;
}
