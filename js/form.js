/* ================================================================
   MR CODERS HUB — Mobile Repair Shop
   form.js — Form Validation & Submission
   ================================================================ */

'use strict';

/* ── Validators ───────────────────────────────────────────────── */
const validators = {
  required: (val) => val.trim().length > 0,
  email:    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
  phone:    (val) => /^[\+]?[\d\s\-\(\)]{8,16}$/.test(val.trim()),
  minlen:   (val, len) => val.trim().length >= parseInt(len),
  match:    (val, otherId) => {
    const other = document.getElementById(otherId);
    return other && val === other.value;
  },
};

const errorMessages = {
  required: 'This field is required.',
  email:    'Please enter a valid email address.',
  phone:    'Please enter a valid phone number.',
  minlen:   (len) => `Must be at least ${len} characters.`,
  match:    'Passwords do not match.',
};

/* ── Single Field Validation ──────────────────────────────────── */
function validateField(input) {
  const rules = input.dataset.validate?.split('|') || [];
  const errorEl = input.parentElement.querySelector('.form-error') ||
                  input.closest('.form-group')?.querySelector('.form-error');
  let isValid = true;
  let message = '';

  for (const rule of rules) {
    const [name, param] = rule.split(':');

    if (!validators[name]) continue;

    const valid = validators[name](input.value, param);

    if (!valid) {
      isValid = false;
      message = typeof errorMessages[name] === 'function'
        ? errorMessages[name](param)
        : errorMessages[name];
      break;
    }
  }

  // Update UI
  input.classList.toggle('error',   !isValid);
  input.classList.toggle('success',  isValid && input.value.trim() !== '');

  if (errorEl) {
    errorEl.textContent = isValid ? '' : message;
    errorEl.style.display = isValid ? 'none' : 'flex';
  }

  return isValid;
}

/* ── Form Validation ──────────────────────────────────────────── */
function initForms() {
  const forms = document.querySelectorAll('form[data-validate-form]');

  forms.forEach(form => {
    const inputs = form.querySelectorAll('[data-validate]');
    const submitBtn = form.querySelector('[type="submit"], .btn-submit');

    // Real-time validation on blur
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let allValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) allValid = false;
      });

      if (!allValid) {
        // Focus first invalid field
        const firstInvalid = form.querySelector('.error');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Show loading
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Sending...';
      }

      // Simulate submission (replace with real fetch in production)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Message Sent! ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      }

      showToastIfAvailable('Your message has been sent successfully!', 'success');

      // Reset after delay
      setTimeout(() => {
        form.reset();
        inputs.forEach(input => {
          input.classList.remove('error', 'success');
        });
        if (submitBtn) {
          submitBtn.textContent = submitBtn.dataset.originalText || 'Send Message';
          submitBtn.style.background = '';
        }
      }, 3500);
    });

    // Store original button text
    if (submitBtn) {
      submitBtn.dataset.originalText = submitBtn.textContent.trim();
    }
  });
}

/* ── Pricing Tab Switcher ─────────────────────────────────────── */
function initPricingTabs() {
  const tabs = document.querySelectorAll('.pricing-tab');
  const panels = document.querySelectorAll('.pricing-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      panels.forEach(panel => {
        panel.style.display = panel.dataset.panel === target ? 'block' : 'none';
      });
    });
  });

  // Show first tab
  if (tabs[0]) tabs[0].click();
}

/* ── Helper ───────────────────────────────────────────────────── */
function showToastIfAvailable(msg, type) {
  if (typeof window.showToast === 'function') window.showToast(msg, type);
}

document.addEventListener('DOMContentLoaded', () => {
  initForms();
  initPricingTabs();
});
