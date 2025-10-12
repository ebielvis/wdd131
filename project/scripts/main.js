// scripts/main.js

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const menuBtn = document.getElementById('menu');
  const nav = document.getElementById('navmenu');
  const yearEl = document.getElementById('year');
  const lastModEl = document.getElementById('lastModified');

  // Mobile nav toggle
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // Set dynamic year and last modified (if elements exist)
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (lastModEl) lastModEl.textContent = document.lastModified || '—';

  // Highlight active nav link based on body data-page (preferred) or pathname
  try {
    const pageAttr = document.body.getAttribute('data-page');
    const links = document.querySelectorAll('#navmenu a');
    links.forEach(a => {
      const href = a.getAttribute('href') || '';
      if (pageAttr && href.includes(pageAttr)) {
        a.classList.add('active');
      } else {
        // fallback to pathname match
        if (window.location.pathname.endsWith(href)) a.classList.add('active');
      }
    });
  } catch (e) {
    // ignore
  }

    // === SERVICES FILTER FEATURE ===
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active state from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;

        serviceCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
        });
    });
    });

  // Pricing calculator (on pricing page)
  const calcBtn = document.getElementById('calcBtn');
  if (calcBtn) {
    const serviceSelect = document.getElementById('serviceSelect');
    const weightInput = document.getElementById('weightInput');
    const totalResult = document.getElementById('totalResult');

    function computeTotal() {
      const rate = parseFloat(serviceSelect.value) || 0;
      const kg = parseFloat(weightInput.value) || 0;
      const total = Math.max(0, rate * kg);
      totalResult.textContent = `Estimated total: ₦${total.toLocaleString()}`;
      // optionally show delivery note
      const deliveryNote = 5000;
      if (total >= deliveryNote) {
        totalResult.textContent += ' — Eligible for pickup & delivery';
      }
    }

    // calculate on button click and live on input change
    calcBtn.addEventListener('click', (e) => {
      e.preventDefault();
      computeTotal();
    });
    weightInput.addEventListener('input', computeTotal);
    serviceSelect.addEventListener('change', computeTotal);
  }

  // Contact form validation (on contact page)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const formMsg = document.getElementById('formMsg');

      // Basic validation
      if (!name.value.trim()) {
        formMsg.textContent = 'Please enter your name.';
        name.focus();
        return;
      }
      if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) {
        formMsg.textContent = 'Please enter a valid email address.';
        email.focus();
        return;
      }
      if (!message.value.trim()) {
        formMsg.textContent = 'Please enter a message.';
        message.focus();
        return;
      }

      // Fake "submit" - since no backend
      formMsg.style.color = 'green';
      formMsg.textContent = 'Thanks! Your message has been received. We will contact you shortly.';
      contactForm.reset();

      // Optionally, scroll the message into view
      formMsg.scrollIntoView({behavior: 'smooth', block: 'center'});
    });
  }

  // Accessibility: Close nav when clicking outside on small screens
  document.addEventListener('click', (e) => {
    const isClickInsideNav = nav && nav.contains(e.target);
    const isMenuBtn = menuBtn && menuBtn.contains(e.target);
    if (!isClickInsideNav && !isMenuBtn && window.innerWidth < 700) {
      if (nav) nav.style.display = 'none';
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
});
