/* ============================================
   MAIN — Daniel Reyes Portfolio
   Premium Motion-Led System
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initNavigation();
  initHeroKeywords(prefersReducedMotion);
  initScrollReveal(prefersReducedMotion);
  initSideRail(prefersReducedMotion);
  initWorkShowcase();
  initMobileCards();
  initSmoothScroll();
});


/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

  // Scroll glass effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile toggle
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        mobileNav.classList.add('open');
        mobileNav.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      } else {
        closeMobileNav();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  function closeMobileNav() {
    if (!toggle || !mobileNav) return;
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}


/* ============================================
   HERO KEYWORD HOVER
   ============================================ */
function initHeroKeywords(prefersReducedMotion) {
  const keywords = document.querySelectorAll('.hero-keyword');
  if (!keywords.length) return;

  const annotationText = document.getElementById('heroAnnotationText');
  const annotationIcon = document.getElementById('heroAnnotationIcon');
  const defaultAnnotation = 'AI automation, agentic workflows, and structured decision systems.';

  // Color map matching the CSS classes
  const colorMap = {
    'kw-green': '#34d399',
    'kw-blue': '#818cf8',
    'kw-pink': '#f472b6'
  };

  if (prefersReducedMotion) {
    keywords.forEach(kw => kw.classList.add('active'));
    return;
  }

  keywords.forEach(kw => {
    kw.addEventListener('mouseenter', () => {
      const annotation = kw.dataset.annotation;
      // Find which color class this keyword has
      const kwClass = [...kw.classList].find(c => c.startsWith('kw-'));
      const color = colorMap[kwClass] || '#818cf8';

      // Update annotation with fade
      if (annotationText) {
        annotationText.style.opacity = '0';
        setTimeout(() => {
          annotationText.textContent = annotation || defaultAnnotation;
          annotationText.style.color = color;
          annotationText.style.opacity = '0.8';
        }, 200);
      }
      if (annotationIcon) {
        annotationIcon.style.color = color;
      }
    });

    kw.addEventListener('mouseleave', () => {
      // Restore default
      if (annotationText) {
        annotationText.style.opacity = '0';
        setTimeout(() => {
          annotationText.textContent = defaultAnnotation;
          annotationText.style.color = '';
          annotationText.style.opacity = '0.7';
        }, 200);
      }
      if (annotationIcon) {
        annotationIcon.style.color = '';
      }
    });
  });
}


/* ============================================
   SCROLL REVEAL
   ============================================ */
function initScrollReveal(prefersReducedMotion) {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (prefersReducedMotion) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  // Stagger reveals within same parent
  const parentGroups = new Map();
  reveals.forEach(el => {
    const parent = el.parentElement;
    if (!parentGroups.has(parent)) {
      parentGroups.set(parent, []);
    }
    parentGroups.get(parent).push(el);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const parent = el.parentElement;
        const siblings = parentGroups.get(parent) || [el];
        const index = siblings.indexOf(el);

        // Add stagger delay based on sibling index
        const staggerDelay = index * 80;
        el.style.transitionDelay = `${staggerDelay}ms`;

        requestAnimationFrame(() => {
          el.classList.add('visible');
        });

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -80px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}


/* ============================================
   SIDE RAIL — Section Tracking & Progress
   ============================================ */
function initSideRail(prefersReducedMotion) {
  const sideRail = document.querySelector('.side-rail');
  if (!sideRail) return;

  const links = sideRail.querySelectorAll('.side-rail-link');
  const contextText = document.getElementById('sideRailContext');
  const progressBar = document.getElementById('sideRailProgress');

  const sectionIds = ['work', 'experience', 'about', 'capabilities', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const contextMap = {
    hero: '',
    work: 'Selected Work',
    experience: 'Experience',
    about: 'About',
    capabilities: 'Capabilities',
    contact: 'Contact'
  };

  let currentSection = '';

  // Section tracking with IntersectionObserver
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        if (id !== currentSection) {
          currentSection = id;
          updateSideRail(id);
        }
      }
    });
  }, {
    threshold: 0,
    rootMargin: '-30% 0px -50% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));

  function updateSideRail(activeId) {
    // Update nav links
    links.forEach(link => {
      const isActive = link.dataset.section === activeId;
      link.classList.toggle('active', isActive);
    });

    // Update context text
    if (contextText) {
      contextText.style.opacity = '0';
      setTimeout(() => {
        contextText.textContent = contextMap[activeId] || '';
        contextText.style.opacity = '0.5';
      }, 200);
    }
  }

  // Scroll progress
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.height = `${Math.min(progress, 100)}%`;
    }, { passive: true });
  }

  // Side rail smooth scroll
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.section;
      const target = document.getElementById(targetId);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}


/* ============================================
   WORK SHOWCASE — Interactive Preview
   ============================================ */
function initWorkShowcase() {
  const showcase = document.querySelector('.work-showcase');
  if (!showcase) return;

  const items = showcase.querySelectorAll('.work-item');
  const panels = showcase.querySelectorAll('.work-preview-panel');

  if (!items.length || !panels.length) return;

  let activeIndex = 0;

  items.forEach((item, index) => {
    // Hover to change preview
    item.addEventListener('mouseenter', () => {
      if (index === activeIndex) return;
      setActiveProject(index);
    });

    // Click to open link
    item.addEventListener('click', () => {
      const link = item.dataset.link;
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    });

    // Keyboard support
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = item.dataset.link;
        if (link) {
          window.open(link, '_blank', 'noopener,noreferrer');
        }
      }
      // Arrow navigation
      if (e.key === 'ArrowDown' && index < items.length - 1) {
        e.preventDefault();
        items[index + 1].focus();
        setActiveProject(index + 1);
      }
      if (e.key === 'ArrowUp' && index > 0) {
        e.preventDefault();
        items[index - 1].focus();
        setActiveProject(index - 1);
      }
    });

    item.addEventListener('focus', () => {
      if (index !== activeIndex) {
        setActiveProject(index);
      }
    });
  });

  function setActiveProject(index) {
    // Update list items
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    // Crossfade preview panels
    panels.forEach((panel, i) => {
      if (i === index) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    activeIndex = index;
  }
}


/* ============================================
   MOBILE PROJECT CARDS
   ============================================ */
function initMobileCards() {
  const cards = document.querySelectorAll('.project-card-mobile');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const link = card.dataset.link;
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    });

    // Cursor tracking for glow (if on touchless device)
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}


/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}
