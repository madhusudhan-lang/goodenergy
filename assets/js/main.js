// Main JavaScript for Good Energies website

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Trigger logo zoom-in after load
window.addEventListener('load', () => {
  const headerLogo = document.querySelector('.site-header .logo img');
  if (headerLogo) {
    requestAnimationFrame(() => {
      headerLogo.style.transition = 'transform 700ms ease-out, opacity 700ms ease-out';
      headerLogo.style.transform = 'scale(1)';
      headerLogo.style.opacity = '1';
    });
  }
});

// Header elevation on scroll
const header = document.querySelector('.site-header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 100) {
    header.classList.add('elevated');
  } else {
    header.classList.remove('elevated');
  }
  
  lastScrollTop = scrollTop;
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

navToggle.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !isExpanded);
  nav.classList.toggle('active');
  // Prevent background scroll when mobile menu open
  if (nav.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Ensure dropdowns closed on load
document.querySelectorAll('.nav li.has-dropdown').forEach(li => {
  li.classList.remove('open');
  const btn = li.querySelector('.dropdown-toggle');
  if (btn) btn.setAttribute('aria-expanded', 'false');
});

// Dropdown toggles (click for mobile, accessible for keyboard)
document.querySelectorAll('.nav li.has-dropdown .dropdown-toggle').forEach(toggle => {
  toggle.setAttribute('aria-haspopup', 'true');
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const parentLi = toggle.closest('li.has-dropdown');
    const isOpen = parentLi.classList.contains('open');
    document.querySelectorAll('.nav li.has-dropdown').forEach(li => {
      li.classList.remove('open');
      const btn = li.querySelector('.dropdown-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      parentLi.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  const insideDropdown = e.target.closest('.has-dropdown');
  if (!insideDropdown) {
    document.querySelectorAll('.nav li.has-dropdown').forEach(li => {
      li.classList.remove('open');
      const btn = li.querySelector('.dropdown-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }
});

// Close dropdowns with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.nav li.has-dropdown').forEach(li => {
      li.classList.remove('open');
      const btn = li.querySelector('.dropdown-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (!targetElement) {
      // Let platform default behavior handle it (e.g., Wix anchors)
      // On mobile, still close the menu
      nav.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      return;
    }
    e.preventDefault();
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
    const targetPosition = targetElement.offsetTop - headerHeight;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    // Close mobile menu if open
    nav.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Close any open dropdowns
    document.querySelectorAll('.nav li.has-dropdown').forEach(li => {
      li.classList.remove('open');
      const btn = li.querySelector('.dropdown-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    emailjs.sendForm('service_q3e9o0c', 'template_hzx3ecj', this)
      .then(() => {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you! Your message has been sent successfully.';
        successMessage.style.cssText = `
          background: #0a7d4f;
          color: white;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          text-align: center;
        `;

        this.appendChild(successMessage);

        // Reset form
        this.reset();

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Remove success message after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }, (error) => {
        alert('Failed to send message: ' + error.text);

        // Reset button on failure
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });
}


// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.leader-card, .offering-card, .project-card, .news-card, .impact-card, .legal-card, .resource-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Hover effects for cards
document.querySelectorAll('.leader-card, .offering-card, .project-card, .news-card, .impact-card, .legal-card, .resource-item').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

// Active navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const headerHeight = document.querySelector('.site-header').offsetHeight;
    
    if (window.pageYOffset >= (sectionTop - headerHeight - 200)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Parallax effect for hero section
// window.addEventListener('scroll', () => {
//   const scrolled = window.pageYOffset;
//   const heroSection = document.querySelector('.hero-section');
  
//   if (heroSection) {
//     // Disable parallax on small screens to avoid layout issues in Wix
//     if (window.innerWidth >= 1024) {
//       const rate = scrolled * -0.5;
//       heroSection.style.transform = `translateY(${rate}px)`;
//     } else {
//       heroSection.style.transform = '';
//     }
//   }
// });

// Initialize tooltips (if needed)
function initTooltips() {
  // Add tooltip functionality here if needed
  console.log('Tooltips initialized');
}

// Initialize tooltips
initTooltips();

// Leadership image fallback to initials
(function initLeaderFallbacks() {
  document.querySelectorAll('.leader-card').forEach(card => {
    const img = card.querySelector('.leader-photo');
    const nameEl = card.querySelector('.leader-info h3');
    if (!img || !nameEl) return;
    const name = nameEl.textContent.trim();
    const initials = name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const showInitials = () => {
      img.classList.add('fallback-hidden');
      const badge = document.createElement('div');
      badge.className = 'leader-initials';
      badge.textContent = initials || '?';
      const container = card.querySelector('.leader-image');
      if (container) {
        // replace image container content with initials badge
        container.innerHTML = '';
        container.appendChild(badge);
      }
    };
    // If image missing or fails
    if (!img.getAttribute('src')) {
      showInitials();
    } else {
      img.addEventListener('error', showInitials, { once: true });
    }
  });
})();

// Hero carousel
(function initHeroCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const prevBtn = carousel.querySelector('.carousel-control.prev');
  const nextBtn = carousel.querySelector('.carousel-control.next');
  const indicators = Array.from(carousel.querySelectorAll('.carousel-indicators button'));
  let currentIndex = Math.max(0, slides.findIndex(s => s.classList.contains('is-active')));

  const setActive = (index) => {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    indicators.forEach((b, i) => {
      b.classList.toggle('is-active', i === index);
      b.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    currentIndex = index;
  };

  const goNext = () => setActive((currentIndex + 1) % slides.length);
  const goPrev = () => setActive((currentIndex - 1 + slides.length) % slides.length);

  nextBtn?.addEventListener('click', goNext);
  prevBtn?.addEventListener('click', goPrev);
  indicators.forEach((btn, i) => btn.addEventListener('click', () => setActive(i)));

  // Auto-advance every 6 seconds
  let timer = setInterval(goNext, 6000);
  const pause = () => clearInterval(timer);
  const resume = () => { timer = setInterval(goNext, 6000); };
  carousel.addEventListener('mouseenter', pause);
  carousel.addEventListener('mouseleave', resume);
})();

// Generic image fallback for broken images
document.addEventListener('error', function(e) {
  const target = e.target;
  if (target && target.tagName === 'IMG') {
    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" y1="0" x2="1" y2="1"%3E%3Cstop offset="0%25" stop-color="%230a7d4f"/%3E%3Cstop offset="100%25" stop-color="%230d5a3a"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23g)"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Inter, Arial" font-size="20"%3EImage unavailable%3C/text%3E%3C/svg%3E';
    target.alt = target.alt || 'Image unavailable';
  }
}, true);

// After DOM ready, sync mobile nav panel top with header height
window.addEventListener('load', () => {
  const headerEl = document.querySelector('.site-header');
  const navEl = document.querySelector('.nav');
  const updateNavTop = () => {
    if (!headerEl || !navEl) return;
    const h = headerEl.offsetHeight;
    if (window.matchMedia('(max-width: 768px)').matches) {
      navEl.style.top = `${h}px`;
    } else {
      navEl.style.top = '';
    }
  };
  updateNavTop();
  window.addEventListener('resize', updateNavTop);
  // Defensive: ensure body scroll not locked if menu should be closed
  const ensureScrollState = () => {
    if (!window.matchMedia('(max-width: 768px)').matches) {
      nav.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };
  ensureScrollState();
  window.addEventListener('resize', ensureScrollState);
});

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.urlencoded({ extended: true }));

document.getElementById('myContactForm').addEventListener('submit', function(e) {
  var response = grecaptcha.getResponse();
  if(response.length === 0) {
    // reCAPTCHA not solved
    alert("Please complete the reCAPTCHA challenge!");
    e.preventDefault();
    return false;
  }
  // If reCAPTCHA is solved, allow form submission
});
