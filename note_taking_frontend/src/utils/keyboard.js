export function isSaveShortcut(e) {
  // Cmd/Ctrl + S
  return (e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S');
}

export function isNewShortcut(e) {
  // Cmd/Ctrl + N
  return (e.metaKey || e.ctrlKey) && (e.key === 'n' || e.key === 'N');
}
