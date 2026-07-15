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

/* ── Mini Slider (Reviews / Testimonials Carousel) ────────────── */
function initTestimonialSlider() {
  const wrapper = document.querySelector('.testimonials-carousel-wrapper');
  if (!wrapper) return;

  const slider = wrapper.querySelector('.testimonials-slider');
  const track = wrapper.querySelector('.testimonials-track');
  const slides = Array.from(wrapper.querySelectorAll('.testimonial-slide'));
  const prevBtn = wrapper.querySelector('.carousel-arrow.prev');
  const nextBtn = wrapper.querySelector('.carousel-arrow.next');
  const dotsContainer = wrapper.querySelector('.carousel-dots');

  if (!slider || !track || !slides.length) return;

  let currentIndex = 0;
  let autoplayInterval = null;
  let touchStartX = 0;
  let touchEndX = 0;
  let perView = 3;

  function getPerView() {
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  function getMaxIndex() {
    return Math.max(0, slides.length - perView);
  }

  function updateLayout() {
    perView = getPerView();
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) {
      currentIndex = maxIdx;
    }

    // Set flex styles dynamically
    slides.forEach(slide => {
      slide.style.width = `calc((100% - (1.5rem * (${perView} - 1))) / ${perView})`;
      slide.style.marginRight = '1.5rem';
      slide.style.flex = '0 0 auto';
    });

    // Reset last slide margin
    if (slides.length) {
      slides[slides.length - 1].style.marginRight = '0';
    }

    updatePosition();
    buildDots();
  }

  function updatePosition() {
    if (!slides.length) return;
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 24; // 1.5rem in px
    const offset = currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update dots active class
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    
    // Total scroll positions
    const maxIdx = getMaxIndex();
    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.addEventListener('click', () => {
        goTo(i);
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    const maxIdx = getMaxIndex();
    if (index > maxIdx) {
      currentIndex = 0; // Infinite loop forward
    } else if (index < 0) {
      currentIndex = maxIdx; // Infinite loop backward
    } else {
      currentIndex = index;
    }
    updatePosition();
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(next, 4000);
  }

  function stopAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
  }

  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prev();
      startAutoplay();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      next();
      startAutoplay();
    });
  }

  // Touch swipe support
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchEndX = touchStartX; // reset
    stopAutoplay();
  }, { passive: true });

  slider.addEventListener('touchmove', (e) => {
    touchEndX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', () => {
    const swipeDistance = touchStartX - touchEndX;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        next();
      } else {
        prev();
      }
    }
    startAutoplay();
  });

  // Hover listeners to pause autoplay
  wrapper.addEventListener('mouseenter', stopAutoplay);
  wrapper.addEventListener('mouseleave', startAutoplay);

  // Initial setup
  updateLayout();
  startAutoplay();

  // Recalculate on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateLayout, 100);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initTestimonialSlider();
});
