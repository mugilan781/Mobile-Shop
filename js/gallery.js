/* ================================================================
   MR CODERS HUB — Mobile Repair Shop
   gallery.js — Gallery Filter & Lightbox
   ================================================================ */

'use strict';

function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach((item, index) => {
        const category = item.dataset.category;
        const matches = filter === 'all' || category === filter;

        if (matches) {
          item.style.display = '';
          item.style.animation = `scaleIn 0.4s ease ${index * 0.05}s both`;
        } else {
          item.style.animation = 'fadeIn 0.2s ease reverse';
          setTimeout(() => {
            if (btn.dataset.filter !== 'all' && item.dataset.category !== btn.dataset.filter) {
              item.style.display = 'none';
            }
          }, 200);
        }
      });

      // Re-run filter cleanly
      galleryItems.forEach(item => {
        const category = item.dataset.category;
        const matches = filter === 'all' || category === filter;
        item.style.display = matches ? '' : 'none';
        if (matches) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 30);
        }
      });
    });
  });
}

/* ── Lightbox ─────────────────────────────────────────────────── */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item[data-full]');
  if (!galleryItems.length) return;

  // Create lightbox
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <img src="" alt="Gallery image" />
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Gallery image';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const full = item.dataset.full;
      const name = item.querySelector('.gallery-item-name')?.textContent || '';
      openLightbox(full, name);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});
