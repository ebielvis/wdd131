// temples.js
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('primary-nav');
  const navLinks = nav.querySelectorAll('a');

  // Toggle nav open/closed for mobile (adds/removes .open)
  function toggleNav() {
    const isOpen = nav.classList.toggle('open');
    // Update accessible attribute on button
    hamburger.setAttribute('aria-expanded', String(isOpen));
    // change button label/icon (use X to close)
    hamburger.textContent = isOpen ? '✕' : '☰';
    hamburger.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  }

  // Only attach handler if hamburger exists (it does)
  if (hamburger) {
    hamburger.addEventListener('click', toggleNav);
  }

  // Close nav when a link is clicked (useful on mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.textContent = '☰';
        hamburger.setAttribute('aria-label', 'Open navigation');
      }
    });
  });

  // Footer: set copyright year and last modified
  const copyYear = document.getElementById('copy-year');
  if (copyYear) {
    copyYear.textContent = new Date().getFullYear();
  }

  const lastModifiedElem = document.getElementById('last-modified');
  if (lastModifiedElem) {
    // Use document.lastModified (string). Convert to friendly format.
    const lm = document.lastModified;
    if (lm && lm !== '') {
      // Attempt to parse to Date and format
      const d = new Date(lm);
      if (!isNaN(d.getTime())) {
        lastModifiedElem.textContent = d.toLocaleString();
        lastModifiedElem.setAttribute('datetime', d.toISOString());
      } else {
        // Fallback to raw string
        lastModifiedElem.textContent = lm;
      }
    } else {
      lastModifiedElem.textContent = 'Unknown';
    }
  }
});
// End of temples.js