/* ===================================================================
   TRAUMURLAUB LANKA – MAIN JAVASCRIPT
   - Sticky Header & Dynamic Shadow
   - Mobile Navigation Hamburger Toggle
   - Active Navigation Link State
   - Back-to-Top Button
   - Itinerary Accordions
   - Robust Image Error Fallback Handler
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initActiveNavLink();
  initBackToTop();
  initItineraryAccordions();
  initImageFallbacks();
});

/* 1. Sticky Header & Dynamic Shadow */
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* 2. Mobile Navigation Toggle */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.hamburger-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('active')) {
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });

  // Close on nav link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

/* 3. Active Nav Link Detector */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* 4. Back to Top Button */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* 5. Itinerary Accordions */
function initItineraryAccordions() {
  const headers = document.querySelectorAll('.itinerary-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isOpen = content.classList.contains('open');

      // Close other accordions in the same card if desired
      const card = header.closest('.tour-card');
      if (card) {
        card.querySelectorAll('.itinerary-content').forEach(c => c.classList.remove('open'));
        card.querySelectorAll('.itinerary-header').forEach(h => h.classList.remove('active'));
      }

      if (!isOpen) {
        content.classList.add('open');
        header.classList.add('active');
      }
    });
  });
}

/* 6. Image Error Fallback Handler */
function initImageFallbacks() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      // If logo fails, keep standard text or SVG
      if (this.classList.contains('nav-logo-img') || this.classList.contains('footer-logo-img')) {
        return;
      }
      // Use clean branded background placeholder
      this.style.backgroundColor = '#123D2A';
      this.style.opacity = '0.9';
      this.alt = 'Traumurlaub Lanka - Sri Lanka Destination';
    });
  });
}
