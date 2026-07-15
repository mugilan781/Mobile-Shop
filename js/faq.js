/* ================================================================
   MR CODERS HUB — Mobile Repair Shop
   faq.js — FAQ Accordion
   ================================================================ */

'use strict';

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });

    // Handle window resize (recalculate height)
    window.addEventListener('resize', () => {
      if (item.classList.contains('open')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    }, { passive: true });
  });

  // Open first item by default
  const firstItem = faqItems[0];
  if (firstItem) {
    const firstAnswer = firstItem.querySelector('.faq-answer');
    firstItem.classList.add('open');
    if (firstAnswer) firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
  }
}

document.addEventListener('DOMContentLoaded', initFAQ);
