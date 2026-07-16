/* ================================================================
   NEXCELL — RTL/LTR Switching System
   rtl.js — Right-to-Left direction toggle with localStorage persistence
   Architecture mirrors theme.js: same patterns, same conventions.
   Default direction: LTR. RTL is an optional user preference.
   ================================================================ */

'use strict';

const RTL_STORAGE_KEY = 'nexcell-dir';
const DIR_LTR = 'ltr';
const DIR_RTL = 'rtl';

/* ── Get current direction ────────────────────────────────────── */
function getDir() {
  return document.documentElement.getAttribute('dir') || DIR_LTR;
}

/* ── Set direction on <html> and persist ──────────────────────── */
function setDir(dir) {
  const html = document.documentElement;

  if (dir === DIR_RTL) {
    html.setAttribute('dir', DIR_RTL);
  } else {
    html.setAttribute('dir', DIR_LTR);
  }

  try {
    localStorage.setItem(RTL_STORAGE_KEY, dir);
  } catch (_) { /* localStorage unavailable */ }

  updateRTLToggleIcon(dir);
  updateRTLToggleIcon(dir, 'rtlToggleMobile');
}

/* ── Toggle between LTR and RTL ───────────────────────────────── */
function toggleDir() {
  const current = getDir();
  const next = current === DIR_RTL ? DIR_LTR : DIR_RTL;
  setDir(next);
}

/* ── LTR Text ────────────────────────────────────────────────── */
const LTR_TEXT = `<span class="rtl-toggle-text">LTR</span>`;

/* ── RTL Text ────────────────────────────────────────────────── */
const RTL_TEXT = `<span class="rtl-toggle-text">RTL</span>`;

/* ── Update toggle button icon ────────────────────────────────── */
function updateRTLToggleIcon(dir, toggleId = 'rtlToggle') {
  const toggle = document.getElementById(toggleId);
  if (!toggle) return;

  if (dir === DIR_RTL) {
    toggle.innerHTML = LTR_TEXT;
    toggle.setAttribute('aria-label', 'Switch to Left-to-Right layout');
    toggle.setAttribute('title', 'Switch to LTR');
  } else {
    toggle.innerHTML = RTL_TEXT;
    toggle.setAttribute('aria-label', 'Switch to Right-to-Left layout');
    toggle.setAttribute('title', 'Switch to RTL');
  }
}

/* ── Apply saved direction on load ───────────────────────────── */
function initRTL() {
  // Restore saved preference from localStorage
  let saved = DIR_LTR;
  try {
    const stored = localStorage.getItem(RTL_STORAGE_KEY);
    if (stored === DIR_LTR || stored === DIR_RTL) {
      saved = stored;
    }
  } catch (_) { /* localStorage unavailable */ }

  // Apply direction (sets dir attribute + updates icon)
  setDir(saved);

  // Wire up desktop toggle
  const toggle = document.getElementById('rtlToggle');
  if (toggle) {
    toggle.addEventListener('click', toggleDir);
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDir();
      }
    });
  }

  // Wire up mobile toggle
  const toggleMobile = document.getElementById('rtlToggleMobile');
  if (toggleMobile) {
    toggleMobile.addEventListener('click', toggleDir);
    toggleMobile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDir();
      }
    });
  }
}

/* ── Boot on DOMContentLoaded ─────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRTL);
} else {
  initRTL();
}

/* ── Expose globally (matches theme.js pattern) ───────────────── */
window.setDir = setDir;
window.getDir = getDir;
window.toggleDir = toggleDir;
