// Control Panel module
// TODO: Implement control panel UI and localStorage persistence
// The panel will allow users to customize the scene (colors, layout, etc.)

export function initPanel() {
  // Placeholder for future panel implementation
}

export function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}