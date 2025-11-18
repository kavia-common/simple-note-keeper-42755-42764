/// PUBLIC_INTERFACE
/** Keyboard utilities for handling shortcuts across platforms. */
/**
 * PUBLIC_INTERFACE
 * Returns true if the event represents the New Note shortcut (Cmd/Ctrl + N)
 * @param {KeyboardEvent} e
 * @returns {boolean}
 */
export function isNewShortcut(e) {
  const meta = e.metaKey || e.ctrlKey
  return meta && (e.key === 'n' || e.key === 'N')
}

/**
 * PUBLIC_INTERFACE
 * Returns true if the event represents the Save shortcut (Cmd/Ctrl + S)
 * @param {KeyboardEvent} e
 * @returns {boolean}
 */
export function isSaveShortcut(e) {
  const meta = e.metaKey || e.ctrlKey
  return meta && (e.key === 's' || e.key === 'S')
}
