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
/* ── Lightbox ─────────────────────────────────────────────────── */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item[data-full]');
  if (!galleryItems.length) return;

  // Create interactive lightbox overlay
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.style.display = 'flex';
  lightbox.style.alignItems = 'center';
  lightbox.style.justifyContent = 'center';
  lightbox.innerHTML = `
    <div style="background:var(--clr-bg-card); border:1px solid var(--clr-border-glow); border-radius:var(--r-md); padding:1.5rem; max-width:440px; width:90%; position:relative; display:flex; flex-direction:column; gap:1rem; box-shadow:var(--shadow-xl); transform:translateY(20px); transition:transform 0.3s ease;" id="lightboxCard">
      <button class="lightbox-close" aria-label="Close" style="position:absolute; top:0.75rem; right:0.75rem; background:rgba(255,255,255,0.03); border:1px solid var(--clr-border-md); width:28px; height:28px; border-radius:var(--r-xs); color:var(--clr-white); cursor:pointer; display:flex; align-items:center; justify-content:center;">&times;</button>
      <div style="aspect-ratio:1.2; overflow:hidden; border-radius:var(--r-sm); border:1px solid var(--clr-border); background:var(--clr-void); display:flex; align-items:center; justify-content:center;">
        <img src="" alt="Gallery image" id="lightboxImg" style="width:100%; height:100%; object-fit:cover; border:none; border-radius:0;" />
      </div>
      <div style="text-align:center;">
        <h3 id="lightboxTitle" style="font-family:var(--font-display); font-size:var(--fs-md); margin-bottom:0.25rem; color:var(--clr-white);">Product Name</h3>
        <p id="lightboxCat" style="font-family:monospace; font-size:var(--fs-xs); color:var(--clr-red-light); text-transform:uppercase; margin-bottom:1rem; letter-spacing:0.05em;">Category</p>
        <div id="lightboxActionContainer">
          <button id="lightboxBuyBtn" class="btn btn-primary" style="width:100%; justify-content:center;">Buy Accessory</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCat = document.getElementById('lightboxCat');
  const lightboxActionContainer = document.getElementById('lightboxActionContainer');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const card = document.getElementById('lightboxCard');

  let currentItem = null;

  function openLightbox(item) {
    currentItem = item;
    const fullSrc = item.getAttribute('data-full');
    const name = item.querySelector('.gallery-item-name')?.textContent || 'Premium Tech Asset';
    const category = item.getAttribute('data-category') || 'accessories';

    lightboxImg.src = fullSrc;
    lightboxImg.alt = name;
    lightboxTitle.textContent = name;
    
    // Set category text
    let catDisplayText = category;
    if (category === 'before-after') catDisplayText = 'Before / After repair';
    lightboxCat.textContent = catDisplayText;

    // Reset button container
    lightboxActionContainer.innerHTML = '';

    if (category === 'repairs' || category === 'before-after') {
      // It's a repair - Book Repair CTA
      const bookBtn = document.createElement('a');
      bookBtn.href = `services.html#book-${name.toLowerCase().replace(/\s+/g, '-')}`;
      bookBtn.className = 'btn btn-primary';
      bookBtn.style.width = '100%';
      bookBtn.style.justifyContent = 'center';
      bookBtn.textContent = 'Book Repair Service';
      bookBtn.addEventListener('click', () => {
        closeLightbox();
      });
      lightboxActionContainer.appendChild(bookBtn);
    } else {
      // It's an accessory - Buy CTA (triggers check out modal)
      const buyBtn = document.createElement('button');
      buyBtn.className = 'btn btn-primary';
      buyBtn.style.width = '100%';
      buyBtn.style.justifyContent = 'center';
      buyBtn.textContent = 'Buy Accessory';
      buyBtn.addEventListener('click', () => {
        closeLightbox();
        // Trigger buy flow via global custom checkout modal
        const buyTrigger = document.createElement('button');
        buyTrigger.className = 'buy-btn';
        buyTrigger.style.display = 'none';
        
        const dummyCard = document.createElement('div');
        dummyCard.className = 'product-card';
        dummyCard.innerHTML = `<h3 class="product-name">${name}</h3><span class="product-price">₹1,299</span>`;
        dummyCard.appendChild(buyTrigger);
        document.body.appendChild(dummyCard);
        
        buyTrigger.click();
        dummyCard.remove();
      });
      lightboxActionContainer.appendChild(buyBtn);
    }

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      card.style.transform = 'translateY(0)';
    }, 50);
  }

  function closeLightbox() {
    card.style.transform = 'translateY(20px)';
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { 
      lightboxImg.src = ''; 
    }, 300);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      openLightbox(item);
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
