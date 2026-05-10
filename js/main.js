/* ═══════════════════════════════════════════════════════════
   Simply Green and Garden Spray — Main Script
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── EMAILJS CONFIG ────────────────────────────────────────
   Fill in your three values from emailjs.com.
   Until values match your template, forms show success locally.
   ─────────────────────────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY  = 'HvCOz4BRnHZyvtdGI';
const EMAILJS_SERVICE_ID  = 'service_p4wpjoj';
const EMAILJS_TEMPLATE_ID = 'template_kght31o';

if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const customerReviews = [
  {
    stars: 5,
    name:  'Linda T.',
    text:  "Switched from another company and couldn't be happier. The Program 2 package covers everything I need. My neighbours keep asking what I'm doing differently!"
  },
  {
    stars: 5,
    name:  'Marcus B.',
    text:  'The aeration service made a huge difference. Fertilizer is really getting in now. Highly recommend combining it with any program.'
  },
  {
    stars: 4,
    name:  'John A.',
    text:  'Really happy with the treatment. Noticed a big improvement in the colour and density of the grass.'
  },
  {
    stars: 5,
    name:  'Priya S.',
    text:  'Program 3 was absolutely worth it. The crabgrass is completely under control and the visits give real peace of mind.'
  }
];

const ownerPosts = [
  {
    text:   "All spring fertilizer applications are being scheduled now.",
    photos: []
  },
  {
    text:   'Featuring bad crab grass, 6 months later Vs the nieghbours lot',
    photos: []
  }
];

/* ═══════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════ */

function starsHTML(rating, size) {
  size = size || 16;
  let html = '';

  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.round(rating);
    html += `<span style="color:${filled ? '#f5c518' : '#ddd'};font-size:${size}px;line-height:1">&#9733;</span>`;
  }

  return html;
}

function calcAvgRating() {
  if (!customerReviews.length) return 0;
  return customerReviews.reduce((a, r) => a + r.stars, 0) / customerReviews.length;
}

function updateHeroStars() {
  const avg     = calcAvgRating();
  const rounded = Math.round(avg * 10) / 10;

  document.getElementById('hero-stars').innerHTML          = starsHTML(avg, 22);
  document.getElementById('hero-rating-num').textContent   = rounded.toFixed(1);
  document.getElementById('hero-review-count').textContent = `Ratings (${customerReviews.length})`;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

function starsText(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n) + ` (${n}/5)`;
}

function lockPage() {
  document.body.style.overflow = 'hidden';
}

function unlockPage() {
  const anyModalOpen = document.querySelector('.modal-overlay.open');
  if (!anyModalOpen) document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════════════════
   DRAG-TO-SCROLL
   ═══════════════════════════════════════════════════════════ */

function enableDragScroll(el) {
  let isDown   = false;
  let startX   = 0;
  let scrollLeft = 0;

  el.addEventListener('mousedown', (e) => {
    isDown = true;
    el.classList.add('dragging');
    startX     = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
    e.preventDefault();
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
    el.classList.remove('dragging');
  });

  el.addEventListener('mouseleave', () => {
    isDown = false;
    el.classList.remove('dragging');
  });

  el.addEventListener('mousemove', (e) => {
    if (!isDown) return;

    e.preventDefault();

    const x    = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.2;
    el.scrollLeft = scrollLeft - walk;
  });

  el.addEventListener('click', (e) => {
    if (Math.abs(el.scrollLeft - scrollLeft) > 4) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   HAMBURGER / MOBILE MENU
   ═══════════════════════════════════════════════════════════ */

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.menu-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const target = link.getAttribute('href');

    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');

    setTimeout(() => {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  });
});

const heroReviewCount = document.getElementById('hero-review-count');

if (heroReviewCount) {
  heroReviewCount.addEventListener('click', (e) => {
    e.preventDefault();

    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) reviewsSection.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════════════════
   PROGRAMS CAROUSEL DOTS
   ═══════════════════════════════════════════════════════════ */

const progTrack = document.getElementById('programs-track');
const progDots  = document.querySelectorAll('#programs-dots .dot');

progTrack.addEventListener('scroll', () => {
  const cards     = progTrack.querySelectorAll('.program-card');
  const cardWidth = cards[0].offsetWidth + 12;
  const idx       = Math.round(progTrack.scrollLeft / cardWidth);

  progDots.forEach((d, i) => d.classList.toggle('active', i === idx));
});

progDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const i         = parseInt(dot.getAttribute('data-i'), 10);
    const cards     = progTrack.querySelectorAll('.program-card');
    const cardWidth = cards[0].offsetWidth + 12;

    progTrack.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
  });
});

enableDragScroll(progTrack);

/* ═══════════════════════════════════════════════════════════
   BUILD REVIEW CARDS
   ═══════════════════════════════════════════════════════════ */

function buildCustomerCards() {
  const track = document.getElementById('customer-track');
  track.innerHTML = '';

  customerReviews.forEach(rv => {
    const initials = rv.name.split(' ')
      .map(w => w[0] || '').join('').slice(0, 2).toUpperCase();

    const card = document.createElement('div');
    card.className = 'review-card';

    card.innerHTML =
      `<div class="rv-stars">${starsHTML(rv.stars, 17)}</div>` +
      `<div class="rv-header">` +
        `<div class="rv-avatar">${initials}</div>` +
        `<div class="rv-name">${escapeHTML(rv.name)}</div>` +
      `</div>` +
      `<div class="rv-text">${escapeHTML(rv.text)}</div>`;

    track.appendChild(card);
  });

  attachScrollCounter(track, 'customer-counter', 14);
}

function buildOwnerCards() {
  const track = document.getElementById('owner-track');
  track.innerHTML = '';

  ownerPosts.forEach((post, postIndex) => {
    const card = document.createElement('div');
    card.className = 'review-card';

    const hasPhotos = Array.isArray(post.photos) && post.photos.length > 0;

    card.innerHTML =
      `<div class="rv-header">` +
        `<div class="rv-avatar owner-av">SG</div>` +
        `<div>` +
          `<div class="rv-name">Simply Green</div>` +
          `<div class="rv-label">Owner</div>` +
        `</div>` +
      `</div>` +
      `<div class="rv-text">${escapeHTML(post.text)}</div>` +
      (hasPhotos
        ? `<a class="rv-photos-link open-gallery" data-post="${postIndex}" role="button" tabindex="0">View photos &rarr;</a>`
        : '');

    track.appendChild(card);
  });

  track.querySelectorAll('.open-gallery').forEach(link => {
    link.addEventListener('click', () => {
      const idx = parseInt(link.getAttribute('data-post'), 10);
      openGallery(ownerPosts[idx].photos);
    });
  });

  attachScrollCounter(track, 'owner-counter', 14);
}

function attachScrollCounter(track, counterId, gap) {
  const counter = document.getElementById(counterId);
  const cards   = track.querySelectorAll('.review-card');
  const total   = cards.length;

  if (total <= 1) {
    counter.textContent = '';
    return;
  }

  let current = 0;
  counter.textContent = `1 / ${total}`;

  track.addEventListener('scroll', () => {
    if (!cards[0]) return;

    const cardWidth = cards[0].offsetWidth + gap;
    const idx = Math.round(track.scrollLeft / cardWidth);

    if (idx !== current) {
      current = idx;
      counter.textContent = `${idx + 1} / ${total}`;
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   TABS
   ═══════════════════════════════════════════════════════════ */

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const tab        = btn.getAttribute('data-tab');
    const custPanel  = document.getElementById('tab-customers');
    const ownerPanel = document.getElementById('tab-owner');

    if (tab === 'customers') {
      custPanel.removeAttribute('hidden');
      ownerPanel.setAttribute('hidden', '');
      document.getElementById('customer-track').scrollTo({ left: 0, behavior: 'instant' });
    } else {
      ownerPanel.removeAttribute('hidden');
      custPanel.setAttribute('hidden', '');
      document.getElementById('owner-track').scrollTo({ left: 0, behavior: 'instant' });
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   CUSTOMER PROFILE MODAL
   ═══════════════════════════════════════════════════════════ */

const profileModal = document.getElementById('profile-modal');

function openProfileModal() {
  if (!profileModal) return;

  profileModal.classList.add('open');
  showProfileStep('profile-step-intro');
  resetProfileForm();
  lockPage();
}

function closeProfileModal() {
  if (!profileModal) return;

  profileModal.classList.remove('open');
  unlockPage();
}

function showProfileStep(stepId) {
  document.querySelectorAll('.profile-step').forEach(step => {
    step.classList.toggle('active', step.id === stepId);
  });
}

function resetProfileForm() {
  const ids = [
    'profile-first-name',
    'profile-last-name',
    'profile-email',
    'profile-email-confirm'
  ];

  ids.forEach(id => {
    const input = document.getElementById(id);

    if (input) {
      input.value = '';
      input.classList.remove('profile-invalid');
    }
  });

  const errorBox = document.getElementById('profile-error-box');
  const submitBtn = document.getElementById('profile-submit');

  if (errorBox) {
    errorBox.style.display = 'none';
    errorBox.textContent = '';
  }

  if (submitBtn) {
    submitBtn.style.display = 'inline-block';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit your email';
  }
}

function showProfileError(message, invalidIds) {
  const errorBox = document.getElementById('profile-error-box');
  const submitBtn = document.getElementById('profile-submit');

  document.querySelectorAll('.profile-field input').forEach(input => {
    input.classList.remove('profile-invalid');
  });

  invalidIds.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.classList.add('profile-invalid');
  });

  if (submitBtn) submitBtn.style.display = 'none';

  if (errorBox) {
    errorBox.textContent = message;
    errorBox.style.display = 'flex';
  }

  setTimeout(() => {
    if (submitBtn) submitBtn.style.display = 'inline-block';
    if (errorBox) errorBox.style.display = 'none';
  }, 2200);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function submitProfileForm() {
  const firstName = document.getElementById('profile-first-name').value.trim();
  const lastName = document.getElementById('profile-last-name').value.trim();
  const email = document.getElementById('profile-email').value.trim();
  const emailConfirm = document.getElementById('profile-email-confirm').value.trim();

  const emptyIds = [];

  if (!firstName) emptyIds.push('profile-first-name');
  if (!lastName) emptyIds.push('profile-last-name');
  if (!email) emptyIds.push('profile-email');
  if (!emailConfirm) emptyIds.push('profile-email-confirm');

  if (emptyIds.length) {
    showProfileError('Field left empty. Try Again', emptyIds);
    return;
  }

  if (!isValidEmail(email) || !isValidEmail(emailConfirm) || email.toLowerCase() !== emailConfirm.toLowerCase()) {
    showProfileError('Field mismatch. Try Again', ['profile-email', 'profile-email-confirm']);
    return;
  }

  const submitBtn = document.getElementById('profile-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  const templateParams = {
    form_type: 'Customer profile update',
    first_name: firstName,
    last_name: lastName,
    customer_email: email,
    message: `${firstName} ${lastName} submitted ${email} for customer file matching.`
  };

  const sendPromise = (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY')
    ? emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    : new Promise(resolve => setTimeout(resolve, 600));

  sendPromise.then(() => {
    showProfileStep('profile-step-success');
  }).catch(err => {
    console.error('EmailJS profile error:', err);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit your email';

    showProfileError('Submit failed. Try Again', []);
  });
}

document.getElementById('close-profile-modal').addEventListener('click', closeProfileModal);
document.getElementById('profile-close-btn').addEventListener('click', closeProfileModal);
document.getElementById('profile-customer-btn').addEventListener('click', () => showProfileStep('profile-step-form'));
document.getElementById('profile-submit').addEventListener('click', submitProfileForm);
document.getElementById('profile-success-close').addEventListener('click', closeProfileModal);

document.getElementById('profile-success-review').addEventListener('click', () => {
  closeProfileModal();
  setTimeout(openReviewModal, 180);
});

document.querySelectorAll('.profile-field input').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('profile-invalid');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitProfileForm();
  });
});

/* ═══════════════════════════════════════════════════════════
   REVIEW MODAL + EMAILJS
   ═══════════════════════════════════════════════════════════ */

const reviewModal = document.getElementById('review-modal');
let selectedStars = 0;

function openReviewModal() {
  reviewModal.classList.add('open');
  lockPage();
}

function closeReviewModal() {
  reviewModal.classList.remove('open');
  unlockPage();
}

document.getElementById('open-review-modal').addEventListener('click', openReviewModal);
document.getElementById('close-review-modal').addEventListener('click', closeReviewModal);

reviewModal.addEventListener('click', (e) => {
  if (e.target === reviewModal) closeReviewModal();
});

document.getElementById('open-review-modal').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') openReviewModal();
});

const spStars = document.querySelectorAll('.sp-star');

spStars.forEach(star => {
  star.addEventListener('mouseover', () => {
    const v = parseInt(star.getAttribute('data-v'), 10);
    spStars.forEach(s => s.classList.toggle('selected', parseInt(s.getAttribute('data-v'), 10) <= v));
  });

  star.addEventListener('mouseleave', () => {
    spStars.forEach(s => s.classList.toggle('selected', parseInt(s.getAttribute('data-v'), 10) <= selectedStars));
  });

  star.addEventListener('click', () => {
    selectedStars = parseInt(star.getAttribute('data-v'), 10);
    spStars.forEach(s => s.classList.toggle('selected', parseInt(s.getAttribute('data-v'), 10) <= selectedStars));
  });
});

document.getElementById('submit-review').addEventListener('click', () => {
  document.querySelectorAll('.form-error').forEach(e => e.style.display = 'none');

  let valid = true;

  if (!selectedStars) {
    document.getElementById('err-stars').style.display = 'block';
    valid = false;
  }

  const nameVal = document.getElementById('rv-name').value.trim();

  if (!nameVal) {
    document.getElementById('err-name').style.display = 'block';
    valid = false;
  }

  const textVal = document.getElementById('rv-text').value.trim();

  if (!textVal) {
    document.getElementById('err-text').style.display = 'block';
    valid = false;
  }

  if (!valid) return;

  const submitBtn = document.getElementById('submit-review');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  const templateParams = {
    reviewer_name: nameVal,
    stars: starsText(selectedStars),
    review_text: textVal
  };

  const sendPromise = (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY')
    ? emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    : new Promise(resolve => setTimeout(resolve, 600));

  sendPromise.then(() => {
    document.getElementById('review-form-content').style.display = 'none';
    document.getElementById('review-success').style.display = 'block';

    setTimeout(() => {
      document.getElementById('rv-name').value = '';
      document.getElementById('rv-text').value = '';

      selectedStars = 0;
      spStars.forEach(s => s.classList.remove('selected'));

      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Review';

      document.getElementById('review-form-content').style.display = 'block';
      document.getElementById('review-success').style.display = 'none';

      closeReviewModal();
    }, 2600);
  }).catch(err => {
    console.error('EmailJS error:', err);

    const errEl = document.getElementById('err-submit');
    errEl.textContent = 'Something went wrong. Please try again.';
    errEl.style.display = 'block';

    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Review';
  });
});

/* ═══════════════════════════════════════════════════════════
   GALLERY MODAL
   ═══════════════════════════════════════════════════════════ */

const galleryModal = document.getElementById('gallery-modal');
let galleryImages  = [];
let galleryIdx     = 0;

function openGallery(photos) {
  galleryImages = photos || [];

  if (!galleryImages.length) return;

  galleryIdx = 0;
  renderGallery();

  galleryModal.classList.add('open');
  lockPage();
}

function closeGallery() {
  galleryModal.classList.remove('open');
  unlockPage();
}

document.getElementById('close-gallery-modal').addEventListener('click', closeGallery);

galleryModal.addEventListener('click', (e) => {
  if (e.target === galleryModal) closeGallery();
});

function renderGallery() {
  const total = galleryImages.length;

  document.getElementById('gallery-counter').textContent = `${galleryIdx + 1} / ${total}`;

  const wrap = document.getElementById('gallery-img-wrap');
  const src  = galleryImages[galleryIdx];

  wrap.innerHTML = src
    ? `<img src="${src}" alt="Gallery photo ${galleryIdx + 1}">`
    : `<div class="gallery-placeholder">&#127807;</div>`;

  const dotsRow = document.getElementById('gallery-dots-row');
  dotsRow.innerHTML = '';

  galleryImages.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'gallery-dot' + (i === galleryIdx ? ' active' : '');
    dotsRow.appendChild(d);
  });
}

document.getElementById('gallery-prev').addEventListener('click', () => {
  galleryIdx = (galleryIdx - 1 + galleryImages.length) % galleryImages.length;
  renderGallery();
});

document.getElementById('gallery-next').addEventListener('click', () => {
  galleryIdx = (galleryIdx + 1) % galleryImages.length;
  renderGallery();
});

document.addEventListener('keydown', (e) => {
  if (profileModal.classList.contains('open') && e.key === 'Escape') {
    closeProfileModal();
    return;
  }

  if (galleryModal.classList.contains('open')) {
    if (e.key === 'ArrowRight') {
      galleryIdx = (galleryIdx + 1) % galleryImages.length;
      renderGallery();
    } else if (e.key === 'ArrowLeft') {
      galleryIdx = (galleryIdx - 1 + galleryImages.length) % galleryImages.length;
      renderGallery();
    } else if (e.key === 'Escape') {
      closeGallery();
    }

    return;
  }

  if (reviewModal.classList.contains('open') && e.key === 'Escape') closeReviewModal();
});

/* ═══════════════════════════════════════════════════════════
   ENABLE DRAG SCROLL ON REVIEW TRACKS
   ═══════════════════════════════════════════════════════════ */

function initReviewDrag() {
  const ct = document.getElementById('customer-track');
  const ot = document.getElementById('owner-track');

  if (ct) enableDragScroll(ct);
  if (ot) enableDragScroll(ot);
}

/* ═══════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════ */

updateHeroStars();
buildCustomerCards();
buildOwnerCards();
initReviewDrag();

window.addEventListener('load', () => {
  setTimeout(openProfileModal, 350);
});