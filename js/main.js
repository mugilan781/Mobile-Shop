/* ================================================================
   MR CODERS HUB — Mobile Repair Shop
   main.js — Core App Logic
   ================================================================ */

'use strict';

/* ── Scroll Progress Bar ──────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
}

/* ── Sticky Navbar ────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  // Active link highlighting
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) {
      link.classList.add('active');
    }
  });
}

/* ── Mobile Menu Toggle ───────────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close when clicking a link
  mobileNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar?.contains(e.target) && !mobileNav?.contains(e.target)) {
      toggle.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── Scroll Reveal ────────────────────────────────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

/* ── Back To Top ──────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Stats Counter Animation ──────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count], [data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const isFloat = el.dataset.decimals !== undefined;
    const rawVal = el.dataset.count || el.dataset.target;
    const target = isFloat ? parseFloat(rawVal) : parseInt(rawVal, 10);
    const decimals = isFloat ? parseInt(el.dataset.decimals, 10) : 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = (isFloat ? current.toFixed(decimals) : Math.floor(current).toLocaleString()) + suffix;
      if (current < target) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  counters.forEach(el => observer.observe(el));
}

/* ── Progress Bar Animation ───────────────────────────────────── */
function initProgressBars() {
  const bars = document.querySelectorAll('[data-progress]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.progress-bar-fill');
        if (fill) {
          setTimeout(() => {
            fill.style.width = entry.target.dataset.progress + '%';
          }, 200);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
}

/* ── Noise Overlay ────────────────────────────────────────────── */
function initNoiseOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'noise-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);
}

function showToast(message, type = 'success', duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  // Vector SVG definitions
  const icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>`,
    party: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M5.8 11.3 2 22l10.7-3.8"></path><path d="M11 11h.01"></path><path d="M15 7h.01"></path><path d="M19 11h.01"></path><path d="M15 3h.01"></path><path d="M19 15h.01"></path><path d="m3 2 2.2 2.2"></path><path d="m15 15 2.2 2.2"></path><path d="m19 7 2.2 2.2"></path><path d="m11 19 2.2 2.2"></path><path d="m22 2-2.2 2.2"></path><path d="m22 22-2.2-2.2"></path></svg>`,
    camera: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>`,
    clipboard: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>`
  };

  // Determine icon based on message content or type
  let selectedIcon = type === 'success' ? icons.success : icons.error;
  if (message.includes('🎉') || message.includes('Party') || message.includes('placed') || message.includes('Subscribed')) {
    selectedIcon = icons.party;
  } else if (message.includes('📸') || message.includes('Instagram')) {
    selectedIcon = icons.camera;
  } else if (message.includes('📋') || message.includes('clipboard') || message.includes('copy') || message.includes('Copied')) {
    selectedIcon = icons.clipboard;
  } else if (message.includes('❌') || message.includes('Failed')) {
    selectedIcon = icons.error;
  }

  // Strip emojis from message
  let cleanMessage = message;
  try {
    cleanMessage = message
      .replace(/\p{Extended_Pictographic}/gu, '')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}\u{274C}\u{2705}📸📋🎉✅❌]/gu, '')
      .trim();
  } catch (e) {
    cleanMessage = message
      .replace(/[\u{1F300}-\u{1F9FF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}\u{274C}\u{2705}📸📋🎉✅❌]/gu, '')
      .trim();
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon" style="display: inline-flex; align-items: center; justify-content: center; color: ${type === 'success' ? 'var(--clr-success)' : 'var(--clr-error)'};">${selectedIcon}</span>
    <span class="toast-text">${cleanMessage}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeInUp 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── Smooth Anchor Scroll ─────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h'), 10) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ── Lazy Load Images ─────────────────────────────────────────── */
function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => observer.observe(img));
}

/* ── Cursor Glow Effect (desktop only) ───────────────────────── */
function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    will-change: left, top;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
}

/* ── Typing Animation ─────────────────────────────────────────── */
function initTypingAnimation() {
  const typingEls = document.querySelectorAll('[data-typing]');
  typingEls.forEach(el => {
    const words = el.dataset.typing.split('|');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const word = words[wordIndex];

      if (!isDeleting) {
        el.textContent = word.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === word.length) {
          isDeleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        el.textContent = word.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }

      setTimeout(type, isDeleting ? 60 : 90);
    };

    type();
  });
}

/* ── Pricing Tabs ─────────────────────────────────────────────── */
function initPricingTabs() {
  const tabs = document.querySelectorAll('.pricing-tab');
  const panels = document.querySelectorAll('.pricing-panel');
  if (!tabs.length) return;

  // Activate first tab by default
  tabs[0]?.classList.add('active');
  panels[0]?.style.removeProperty('display');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      const panel = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
      if (panel) panel.style.display = 'block';
    });
  });
}

/* ── Checkout / Quick Buy Modal ───────────────────────────────── */
function initCheckoutModal() {
  // Create overlay markup
  const overlay = document.createElement('div');
  overlay.className = 'checkout-modal-overlay';
  overlay.id = 'checkoutModal';
  overlay.innerHTML = `
    <div class="checkout-modal-card">
      <button class="checkout-modal-close" id="closeCheckout" aria-label="Close modal">&times;</button>
      <div style="margin-bottom:1rem;">
        <span class="badge badge-red" style="margin-bottom:0.5rem;">Quick Checkout</span>
        <h3 class="checkout-product-title" id="checkoutProdName">Product Name</h3>
        <p class="checkout-product-price" id="checkoutProdPrice">₹0.00</p>
      </div>
      <form id="checkoutForm" novalidate style="display:flex; flex-direction:column; gap:1rem;">
        <div class="form-group">
          <label class="form-label" for="checkoutName">Your Name *</label>
          <input type="text" id="checkoutName" class="form-input" placeholder="Enter your full name" required />
          <span class="form-error" id="checkoutNameError" style="display:none; color:var(--clr-error); font-size:0.75rem;"></span>
        </div>
        <div class="form-group">
          <label class="form-label" for="checkoutPhone">Phone Number *</label>
          <input type="tel" id="checkoutPhone" class="form-input" placeholder="+91 XXXXX XXXXX" required />
          <span class="form-error" id="checkoutPhoneError" style="display:none; color:var(--clr-error); font-size:0.75rem;"></span>
        </div>
        <div class="form-group">
          <label class="form-label" for="checkoutAddress">Delivery Address *</label>
          <input type="text" id="checkoutAddress" class="form-input" placeholder="Flat, Street, Area" required />
          <span class="form-error" id="checkoutAddressError" style="display:none; color:var(--clr-error); font-size:0.75rem;"></span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="checkoutQty">Quantity</label>
            <select id="checkoutQty" class="form-select">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="checkoutPayment">Payment Method</label>
            <select id="checkoutPayment" class="form-select">
              <option value="cod">Cash on Delivery</option>
              <option value="upi">UPI / QR Code</option>
            </select>
          </div>
        </div>
        <button type="submit" class="btn btn-primary" id="checkoutSubmit" style="margin-top:0.5rem; width:100%;">
          Confirm Order
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);

  const closeBtn = document.getElementById('closeCheckout');
  const form = document.getElementById('checkoutForm');

  function openModal(name, price) {
    document.getElementById('checkoutProdName').textContent = name;
    document.getElementById('checkoutProdPrice').textContent = price;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    form.reset();
    // Hide errors
    form.querySelectorAll('.form-error').forEach(e => e.style.display = 'none');
  }

  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Listen globally for Buy clicks
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a') || e.target.closest('button');
    if (!link) return;

    // Only intercept if class is 'buy-btn' or it's a specific "Buy" CTA inside a card (not generic redirects)
    const isBuyLink = link.classList.contains('buy-btn') || 
                      (link.textContent.trim().toLowerCase() === 'buy' && (link.closest('.product-card') || link.closest('.featured-item-content') || link.closest('article')));

    if (isBuyLink) {
      e.preventDefault();
      // Look for product details
      const card = link.closest('.product-card') || link.closest('.featured-item-content') || link.closest('article') || document.body;
      const name = card.querySelector('.product-name')?.textContent || card.querySelector('h3')?.textContent || 'Premium Tech Accessory';
      const price = card.querySelector('.product-price')?.textContent || card.querySelector('.price-amount')?.textContent || '₹999';

      openModal(name, price.split(' ')[0]); // Get price without old price
    }
  });

  // Form submission
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasErr = false;

    const name = document.getElementById('checkoutName');
    const phone = document.getElementById('checkoutPhone');
    const addr = document.getElementById('checkoutAddress');

    if (!name.value.trim()) {
      document.getElementById('checkoutNameError').textContent = 'Name is required';
      document.getElementById('checkoutNameError').style.display = 'block';
      hasErr = true;
    } else {
      document.getElementById('checkoutNameError').style.display = 'none';
    }

    if (!phone.value.trim() || !/^\+?[0-9\s-]{10,14}$/.test(phone.value.trim())) {
      document.getElementById('checkoutPhoneError').textContent = 'Enter a valid phone number';
      document.getElementById('checkoutPhoneError').style.display = 'block';
      hasErr = true;
    } else {
      document.getElementById('checkoutPhoneError').style.display = 'none';
    }

    if (!addr.value.trim()) {
      document.getElementById('checkoutAddressError').textContent = 'Address is required';
      document.getElementById('checkoutAddressError').style.display = 'block';
      hasErr = true;
    } else {
      document.getElementById('checkoutAddressError').style.display = 'none';
    }

    if (hasErr) return;

    // Loading transition
    const submitBtn = document.getElementById('checkoutSubmit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    setTimeout(() => {
      const orderId = 'MR' + Math.floor(1000 + Math.random() * 9000);
      closeModal();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Order';
      
      showToast(`Order placed! ID: #${orderId}. Executive will call you in 15 mins.`, 'success');
    }, 1200);
  });
}

/* ── Service Tab Autofill ──────────────────────────────────────── */
function initServicePreselector() {
  // If we click "Book Service" cards
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('.service-book-btn');
    if (!link) return;

    const serviceName = link.dataset.service;
    if (!serviceName) return;

    // Set select service if present on page
    const select = document.getElementById('repairService') || document.getElementById('enquiryType');
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value.toLowerCase().includes(serviceName.toLowerCase()) ||
            select.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  });

  // Check URL hash on page load
  const hash = window.location.hash;
  if (hash.startsWith('#book-')) {
    const sName = hash.replace('#book-', '');
    setTimeout(() => {
      const select = document.getElementById('repairService') || document.getElementById('enquiryType');
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].value.toLowerCase().includes(sName) ||
              select.options[i].text.toLowerCase().includes(sName)) {
            select.selectedIndex = i;
            break;
          }
        }
      }
    }, 100);
  }
}

/* ── Profile Dropdown Menu ────────────────────────────────────── */
function initProfileDropdown() {
  const setupDropdown = (toggleId, dropdownId) => {
    const toggle = document.getElementById(toggleId);
    const dropdown = document.getElementById(dropdownId);
    if (!toggle || !dropdown) return;

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isCurrentlyOpen = dropdown.classList.contains('open');
      
      // Close all profile dropdowns first
      document.querySelectorAll('.profile-dropdown').forEach(d => {
        d.classList.remove('open');
      });
      document.querySelectorAll('.navbar-profile-btn').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
      });

      if (!isCurrentlyOpen) {
        dropdown.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  };

  // Setup desktop and mobile instances
  setupDropdown('profileMenuToggle', 'profileDropdown');
  setupDropdown('mobileProfileMenuToggle', 'mobileProfileDropdown');

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const isDropdownClick = e.target.closest('.navbar-profile-wrapper');
    if (!isDropdownClick) {
      document.querySelectorAll('.profile-dropdown').forEach(d => {
        d.classList.remove('open');
      });
      document.querySelectorAll('.navbar-profile-btn').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close when selecting an option
  document.querySelectorAll('.profile-dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.profile-dropdown').forEach(d => {
        d.classList.remove('open');
      });
      document.querySelectorAll('.navbar-profile-btn').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
      });
    });
  });
}

/* ── Init All ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initBackToTop();
  initCounters();
  initProgressBars();
  initNoiseOverlay();
  initSmoothScroll();
  initLazyImages();
  initCursorGlow();
  initTypingAnimation();
  initPricingTabs();
  initCheckoutModal();
  initServicePreselector();
  initProfileDropdown();
});

// Expose toast globally
window.showToast = showToast;


