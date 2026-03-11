/* ============================================
   MAIN — Daniel Reyes Portfolio
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initProjectCards();
  initSmoothScroll();
  initHeroKeywords();
});

/* ---- Navigation ---- */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile a');

  // Scroll behavior
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // Mobile toggle
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('active');
      if (isOpen) {
        mobileNav.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        closeMobileNav();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });
  }

  function closeMobileNav() {
    toggle.classList.remove('active');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ---- Scroll Reveal ---- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ---- Project Cards (cursor tracking) ---- */
function initProjectCards() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    // Click to open link
    card.addEventListener('click', () => {
      const link = card.dataset.link;
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

/* ---- Smooth Scroll ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ---- Hero Keywords ---- */
function initHeroKeywords() {
  // Keywords are handled via CSS hover.
  // This adds keyboard support for accessibility.
  const keywords = document.querySelectorAll('.hero-keyword');
  keywords.forEach(kw => {
    kw.setAttribute('tabindex', '0');
    kw.setAttribute('role', 'button');

    kw.addEventListener('focus', () => {
      const card = kw.querySelector('.keyword-card');
      if (card) {
        card.style.opacity = '1';
        card.style.transform = 'translateX(-50%) translateY(0)';
      }
    });

    kw.addEventListener('blur', () => {
      const card = kw.querySelector('.keyword-card');
      if (card) {
        card.style.opacity = '';
        card.style.transform = '';
      }
    });
  });
}
