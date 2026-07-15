/* ================================================================
   NEXCELL — Theme Switching System
   theme.js — Dark/Light toggle with localStorage persistence
   Architecture matches reference implementation
   ================================================================ */

'use strict';

const STORAGE_KEY = 'nexcell-theme';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

/* ── Get current theme ────────────────────────────────────────── */
function getTheme() {
  return document.documentElement.getAttribute('data-theme') || THEME_DARK;
}

/* ── Set theme on <html> and persist ──────────────────────────── */
function setTheme(theme) {
  const html = document.documentElement;

  if (theme === THEME_LIGHT) {
    html.setAttribute('data-theme', THEME_LIGHT);
  } else {
    html.removeAttribute('data-theme');
  }

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (_) { /* localStorage unavailable */ }

  updateToggleIcon(theme);
}

/* ── Toggle between dark and light ────────────────────────────── */
function toggleTheme() {
  const current = getTheme();
  const next = current === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
  setTheme(next);
}

/* ── Update toggle button icon ────────────────────────────────── */
function updateToggleIcon(theme) {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  if (theme === THEME_LIGHT) {
    toggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
    toggle.setAttribute('aria-label', 'Switch to dark mode');
  } else {
    toggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    toggle.setAttribute('aria-label', 'Switch to light mode');
  }
}

/* ── Apply saved theme on load ────────────────────────────────── */
function initTheme() {
  // Check localStorage first
  let saved = THEME_DARK;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === THEME_DARK || stored === THEME_LIGHT) {
      saved = stored;
    }
  } catch (_) { /* localStorage unavailable */ }

  // Apply theme
  setTheme(saved);

  // Wire up toggle button
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', toggleTheme);
  }
}

/* ── Boot on DOMContentLoaded ─────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}
