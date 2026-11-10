/* ===================================================================
   TRAUMURLAUB LANKA – ANIMATIONS JAVASCRIPT
   - Subtle Tropical Floating Leaves Canvas (Optimized 60fps)
   - IntersectionObserver Scroll Reveal
   - Animated Stats Counters
   - Scroll Progress Indicator
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initScrollReveal();
  initCounters();
  initTropicalLeaves();
});

/* 1. Scroll Progress Indicator */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
}

/* 2. Intersection Observer Scroll Reveal */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-slide-left, .reveal-slide-right');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* 3. Animated Statistics Counters */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let started = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        statNumbers.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 2000;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = prefix + target.toLocaleString() + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* 4. Subtle Tropical Floating Leaves Canvas */
function initTropicalLeaves() {
  // Check reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.getElementById('tropical-leaves-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Adaptive leaf count based on screen width
  const isMobile = width < 768;
  const leafCount = isMobile ? 12 : 26;

  const leafColors = [
    'rgba(111, 175, 101, 0.45)', // Natural leaf green
    'rgba(78, 142, 68, 0.40)',
    'rgba(46, 98, 56, 0.35)',   // Forest green tint
    'rgba(161, 225, 150, 0.45)'  // Tender palm shoot
  ];

  class Leaf {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 12 + 10; // 10px to 22px
      this.speedY = Math.random() * 0.7 + 0.4;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() * 0.02 - 0.01);
      this.oscillation = Math.random() * Math.PI * 2;
      this.oscSpeed = Math.random() * 0.02 + 0.01;
      this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
    }

    update() {
      this.y += this.speedY;
      this.oscillation += this.oscSpeed;
      this.x += Math.sin(this.oscillation) * 0.8 + this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      // Draw stylized Ceylon tropical leaf shape
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.5, this.size * 0.7, this.size * 0.5, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.7, this.size * 0.5, -this.size * 0.6, -this.size * 0.5, 0, -this.size);
      ctx.fillStyle = this.color;
      ctx.fill();

      // Delicate central leaf vein
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.85);
      ctx.lineTo(0, this.size * 0.85);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }
  }

  const leaves = Array.from({ length: leafCount }, () => new Leaf());

  let animFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < leaves.length; i++) {
      leaves[i].update();
      leaves[i].draw();
    }
    animFrameId = requestAnimationFrame(animate);
  }

  animate();
}
