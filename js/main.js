/*
============================================================
Simply Green and Garden Spray - Main Script
============================================================
*/

'use strict';

const EMAILJS_PUBLIC_KEY  = 'HvCOz4BRnHZyvtdGI';
const EMAILJS_SERVICE_ID  = 'service_p4wpjoj';
const EMAILJS_TEMPLATE_ID = 'template_kght31o';

if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

function lockPage() {
  document.body.style.overflow = 'hidden';
}

function unlockPage() {
  const anyModalOpen = document.querySelector('.modal-overlay.open');
  if (!anyModalOpen) document.body.style.overflow = '';
}

function enableDragScroll(el) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  el.addEventListener('mousedown', (e) => {
    isDown = true;
    el.classList.add('dragging');
    startX = e.pageX - el.offsetLeft;
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

    const x = e.pageX - el.offsetLeft;
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

const progTrack = document.getElementById('programs-track');
const progDots = document.querySelectorAll('#programs-dots .dot');

if (progTrack) {
  progTrack.addEventListener('scroll', () => {
    const cards = progTrack.querySelectorAll('.program-card');
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth + 12;
    const idx = Math.round(progTrack.scrollLeft / cardWidth);

    progDots.forEach((d, i) => d.classList.toggle('active', i === idx));
  });

  progDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const i = parseInt(dot.getAttribute('data-i'), 10);
      const cards = progTrack.querySelectorAll('.program-card');
      if (!cards.length) return;

      const cardWidth = cards[0].offsetWidth + 12;
      progTrack.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
    });
  });

  enableDragScroll(progTrack);
}

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

document.querySelectorAll('.profile-field input').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('profile-invalid');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitProfileForm();
  });
});

document.addEventListener('keydown', (e) => {
  if (profileModal && profileModal.classList.contains('open') && e.key === 'Escape') {
    closeProfileModal();
  }
});

/*
Website launch popup removed.

Old launch trigger:
window.addEventListener('load', () => {
  setTimeout(openProfileModal, 350);
});
*/