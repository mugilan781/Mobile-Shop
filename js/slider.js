/* ================================================================
   MR CODERS HUB — Mobile Repair Shop
   slider.js — Hero Banner Slider
   ================================================================ */

'use strict';

function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  const dotsContainer = slider.querySelector('.slider-dots');
  const prevBtn = slider.querySelector('.slider-arrow.prev');
  const nextBtn = slider.querySelector('.slider-arrow.next');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayInterval = null;
  let touchStartX = 0;
  let touchEndX = 0;

  // Create dots
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlider(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    if (dotsContainer) {
      dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    currentIndex = index;
  }

  function goTo(index) {
    const total = slides.length;
    const newIndex = ((index % total) + total) % total;
    updateSlider(newIndex);
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(next, 5000);
  }

  function stopAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
  }

  // Arrow buttons
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });

  // Touch support
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    startAutoplay();
  });

  // Keyboard
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Initialize
  updateSlider(0);
  startAutoplay();
}

/* ── Mini Slider (Reviews / Testimonials) ─────────────────────── */
function initTestimonialSlider() {
  const sliders = document.querySelectorAll('.testimonials-slider');

  sliders.forEach(slider => {
    const track = slider.querySelector('.testimonials-track');
    const slides = slider.querySelectorAll('.testimonial-slide');
    if (!track || slides.length < 2) return;

    let current = 0;
    let perView = window.innerWidth >= 768 ? 2 : 1;

    function update() {
      perView = window.innerWidth >= 768 ? 2 : 1;
      const slideWidth = slides[0].offsetWidth;
      const gap = 32;
      track.style.transform = `translateX(-${current * (slideWidth + gap)}px)`;
    }

    const prevBtn = slider.parentElement.querySelector('.testi-prev');
    const nextBtn = slider.parentElement.querySelector('.testi-next');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const maxIndex = Math.max(0, slides.length - perView);
        current = Math.min(current + 1, maxIndex);
        update();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        current = Math.max(0, current - 1);
        update();
      });
    }

    window.addEventListener('resize', update, { passive: true });
    update();

    // Auto
    setInterval(() => {
      const maxIndex = Math.max(0, slides.length - perView);
      current = current >= maxIndex ? 0 : current + 1;
      update();
    }, 4500);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initTestimonialSlider();
});
