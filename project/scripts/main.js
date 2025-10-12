// scripts/main.js
// FreshSpin - main script

document.addEventListener('DOMContentLoaded', init);

// -------------------- init --------------------
function init() {
  setupNav();
  setFooterDates();
  setupPricingCalculator();
  setupContactForm();
  setupServicesFilter(); // renders services and wires filter buttons (if on services page)
  highlightActiveNav();
  accessibilityHelpers();
}

// -------------------- NAV --------------------
function setupNav() {
  const menuBtn = document.getElementById('menu');
  const nav = document.getElementById('navmenu');
  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });
}

// -------------------- Footer --------------------
function setFooterDates() {
  const yearEl = document.getElementById('year');
  const lastModEl = document.getElementById('lastModified');
  if (yearEl) yearEl.textContent = `${new Date().getFullYear()}`;
  if (lastModEl) lastModEl.textContent = document.lastModified || '—';
}

// -------------------- PRICING CALCULATOR --------------------
function setupPricingCalculator() {
  const calcBtn = document.getElementById('calcBtn');
  const serviceSelect = document.getElementById('serviceSelect');
  const weightInput = document.getElementById('weightInput');
  const totalResult = document.getElementById('totalResult');

  if (!calcBtn || !serviceSelect || !weightInput || !totalResult) return;

  function computeTotal() {
    const rate = Number(serviceSelect.value) || 0;
    const kg = Number(weightInput.value) || 0;
    const total = Math.max(0, Math.round(rate * kg));
    totalResult.textContent = `Estimated total: ₦${total.toLocaleString()}`;
    if (total >= 5000) totalResult.textContent += ' — Eligible for pickup & delivery';
  }

  calcBtn.addEventListener('click', (e) => {
    e.preventDefault();
    computeTotal();
    // store last estimate in localStorage (object)
    const snapshot = { service: serviceSelect.options[serviceSelect.selectedIndex].text, kg: weightInput.value, total: totalResult.textContent };
    localStorage.setItem('lastEstimate', JSON.stringify(snapshot));
  });

  // live update
  weightInput.addEventListener('input', computeTotal);
  serviceSelect.addEventListener('change', computeTotal);

  // restore snapshot if exists
  const saved = localStorage.getItem('lastEstimate');
  if (saved) {
    try {
      const snap = JSON.parse(saved);
      // harmless restore attempt - only set text
      totalResult.textContent = snap.total || totalResult.textContent;
    } catch (err) { /* ignore parse errors */ }
  }
}

// -------------------- CONTACT FORM --------------------
function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const phoneEl = document.getElementById('phone');
  const messageEl = document.getElementById('message');
  const msgBox = document.getElementById('formMsg');

  // Load draft if present
  loadContactDraft();

  // Save draft on input (debounced)
  let draftTimer;
  contactForm.addEventListener('input', () => {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(saveContactDraft, 700);
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation with conditional branching
    if (!nameEl.value.trim()) {
      showFormMessage('Please enter your name.', 'error');
      nameEl.focus();
      return;
    }
    if (!emailEl.value.trim() || !/^\S+@\S+\.\S+$/.test(emailEl.value)) {
      showFormMessage('Please enter a valid email address.', 'error');
      emailEl.focus();
      return;
    }
    if (!messageEl.value.trim()) {
      showFormMessage('Please enter a message.', 'error');
      messageEl.focus();
      return;
    }

    // Compose submission object (useful for future API or localStorage)
    const submission = {
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      phone: phoneEl.value.trim(),
      message: messageEl.value.trim(),
      timestamp: new Date().toISOString()
    };

    // Save last submission in localStorage (objects & JSON)
    try {
      const prev = JSON.parse(localStorage.getItem('submissions') || '[]');
      prev.unshift(submission); // array method push/unshift used
      localStorage.setItem('submissions', JSON.stringify(prev.slice(0, 10))); // keep last 10
    } catch (err) {
      localStorage.setItem('lastSubmission', JSON.stringify(submission));
    }

    // Clear draft & form
    localStorage.removeItem('contactDraft');
    contactForm.reset();
    showFormMessage('Thanks! Your message has been received. We will contact you shortly.', 'success');
  });

  function saveContactDraft() {
    const draft = {
      name: nameEl.value || '',
      email: emailEl.value || '',
      phone: phoneEl.value || '',
      message: messageEl.value || ''
    };
    localStorage.setItem('contactDraft', JSON.stringify(draft));
  }

  function loadContactDraft() {
    const draft = localStorage.getItem('contactDraft');
    if (!draft) return;
    try {
      const obj = JSON.parse(draft);
      if (obj.name) nameEl.value = obj.name;
      if (obj.email) emailEl.value = obj.email;
      if (obj.phone) phoneEl.value = obj.phone;
      if (obj.message) messageEl.value = obj.message;
      showFormMessage('Draft loaded from your device.', 'info');
    } catch (err) { /* ignore */ }
  }

  function showFormMessage(text, type) {
    if (!msgBox) return;
    // use template literal exclusively for inner text building
    msgBox.innerHTML = `${text}`;
    msgBox.style.color = (type === 'error') ? '#c62828' : (type === 'success') ? '#1b5e20' : '#2C7BE5';
  }
}

// -------------------- SERVICES FILTER + RENDERING --------------------
function setupServicesFilter() {
  // only run on services.html (we use body data-page)
  const page = document.body.getAttribute('data-page') || '';
  if (!page.includes('services')) return;

  // 1) define services array (objects)
  const services = [
    { id: 'wash-fold', name: 'Wash & Fold', category: 'laundry', price: 500, desc: 'Fast wash and neat folding.', img: 'images/wash-fold.jpg' },
    { id: 'dry-clean', name: 'Dry Cleaning', category: 'dry-cleaning', price: 700, desc: 'Professional dry cleaning for delicate items.', img: 'images/dry-clean.jpg' },
    { id: 'ironing', name: 'Ironing & Pressing', category: 'laundry', price: 300, desc: 'Perfect press for shirts and uniforms.', img: 'images/ironing.jpg' },
    { id: 'home-clean', name: 'Home Cleaning', category: 'home-cleaning', price: 0, desc: 'Full home cleaning solutions.', img: 'images/house-cleaning.jpg' },
    { id: 'suit-care', name: 'Suit Care', category: 'dry-cleaning', price: 1200, desc: 'Expert care for suits and formal wear.', img: 'images/suit-care.jpg' },
    { id: 'carpet', name: 'Carpet Cleaning', category: 'home-cleaning', price: 0, desc: 'Deep carpet cleaning and restoration.', img: 'images/carpet-cleaning.jpg' }
  ];

  // 2) cache DOM
  const container = document.getElementById('servicesContainer') || document.querySelector('.service-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // 3) render function (template literals exclusively)
  function renderServices(list) {
    if (!container) return;
    // build markup using map + join (array methods)
    const html = list.map(s => `
      <div class="service-card" data-category="${s.category}" data-id="${s.id}">
        <img src="${s.img}" alt="${s.name}" loading="lazy">
        <h3>${s.name}</h3>
        <p>${s.desc}</p>
        <p class="price">${s.price > 0 ? `₦${s.price} / kg` : ''}</p>
        <p><a class="btn" href="contact.html">Book Now</a></p>
      </div>
    `).join('');
    container.innerHTML = html;
  }

  // initial render
  renderServices(services);
  

  // 4) applyFilter uses array.filter
  function applyFilter(category) {
    // store last filter in localStorage
    localStorage.setItem('lastServiceFilter', category);

    let filtered = [];
    if (category === 'all') filtered = services;
    else filtered = services.filter(s => s.category === category);

    renderServices(filtered);
  }

  // 5) restore last filter if any
  const last = localStorage.getItem('lastServiceFilter') || 'all';
  // set active button
  filterBtns.forEach(b => {
    b.classList.toggle('active', b.dataset.category === last);
  });
  applyFilter(last);

  // 6) wire up buttons (delegation)
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category || 'all';
      applyFilter(cat);
    });
  });
}

// -------------------- NAV HIGHLIGHT --------------------
function highlightActiveNav() {
  const pageAttr = document.body.getAttribute('data-page') || '';
  const links = document.querySelectorAll('#navmenu a');
  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (pageAttr && href.includes(pageAttr)) a.classList.add('active');
    else if (window.location.pathname.endsWith(href)) a.classList.add('active');
  });
}

// -------------------- ACCESSIBILITY HELPERS --------------------
function accessibilityHelpers() {
  // Close nav on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const nav = document.getElementById('navmenu');
      const menuBtn = document.getElementById('menu');
      if (nav && menuBtn && window.innerWidth < 700) {
        nav.style.display = 'none';
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });
}
