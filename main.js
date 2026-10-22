// ===== THREE.js BACKGROUND SCENE =====
let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);

  const canvas = document.getElementById('bg-canvas');
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Particle system (floating dots forming a subtle grid)
  const particleCount = 500;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const color = new THREE.Color();

  const groupCount = 3;
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const group = i % groupCount;

    // Distribute particles in 3 layers at different depths
    positions[i3] = (Math.random() - 0.5) * 20;
    positions[i3 + 1] = (Math.random() - 0.5) * 20;
    positions[i3 + 2] = group * 5 - 5;

    // Color varies per layer
    color.setHSL(0.6 + group * 0.1, 0.7, 0.7);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Resize handler
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animateThree() {
  requestAnimationFrame(animateThree);

  if (particles) {
    // Gentle rotation based on mouse
    particles.rotation.y += (mouseX * 0.0005 - particles.rotation.y) * 0.1;
    particles.rotation.x += (mouseY * 0.0003 - particles.rotation.x) * 0.1;

    // Slow pulse animation
    particles.material.opacity = 0.5 + Math.sin(Date.now() * 0.0005) * 0.1;
  }

  renderer.render(scene, camera);
}

// ===== GSAP SCROLL ANIMATIONS =====
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero title stagger
  gsap.utils.toArray('.hero__title span').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: "power3.out",
      delay: i * 0.15
    });
  });

  // Subtitle fade-up
  gsap.from('.hero__subtitle', {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power3.out",
    delay: 0.5
  });

  // CTA fade-in
  gsap.from('.hero__cta', {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: "power3.out",
    delay: 0.7
  });

  // Section titles
  gsap.utils.toArray('.section__title').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
      }
    });
  });

  // Parallax for data-parallax elements
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const depth = parseFloat(el.getAttribute('data-parallax'));
    gsap.to(el, {
      y: depth * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest('section, .hero') || el.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });
  });

  // Project cards stagger
  gsap.utils.toArray('.project-card').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        delay: i * 0.1
      }
    });
  });

  // Service cards
  gsap.utils.toArray('.service-card').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        delay: i * 0.1
      }
    });
  });
}

// ===== CURSOR DOT =====
function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  let posX = 0, posY = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor following
  function animate() {
    posX += (mouseX - posX) * 0.1;
    posY += (mouseY - posY) * 0.1;
    dot.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  }
  animate();

  // Hover detection
  const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
  });
}

// ===== NAVIGATION =====
function initNavigation() {
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');

  navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close menu on scroll
  let scrollTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    navMenu.classList.remove('active');
    nav.classList.add('scrolled');
    scrollTimer = setTimeout(() => nav.classList.remove('scrolled'), 1000);
  });

  // Update links
  const links = document.querySelectorAll('.nav__link');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = e.target.getAttribute('href');
      if (target.startsWith('#')) {
        const section = document.querySelector(target);
        if (section) {
          e.preventDefault();
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;

  toggle?.addEventListener('click', () => {
    if (body.classList.contains('dark')) {
      body.classList.remove('dark');
      body.classList.add('light');
    } else if (body.classList.contains('light')) {
      body.classList.remove('light');
      body.classList.add('dark');
    } else {
      body.classList.add('dark');
    }
  });
}

// ===== PRELOADER =====
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Hide preloader after all content is loaded
  window.addEventListener('load', () => {
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        preloader.style.display = 'none';
      }
    });
  });
}

// ===== PROJECT CARDS =====
const projects = [
  {
    tags: ['WebGL', 'React'],
    title: 'Nebula Interactive',
    desc: 'An immersive cosmic exploration experience built with Three.js and React.'
  },
  {
    tags: ['Vue.js', 'GSAP'],
    title: 'Lumen Studios',
    desc: 'A bold visual identity with interactive 3D product showcases.'
  },
  {
    tags: ['Svelte', 'Three.js'],
    title: 'Astrum Labs',
    desc: 'A futuristic dashboard with real-time 3D data visualizations.'
  }
];

function renderProjects() {
  const container = document.getElementById('projects');
  if (!container) return;

  container.innerHTML = projects.map(p => `
    <div class="project-card">
      <div class="project-card__tags">
        ${p.tags.map(tag => `<span class="project-card__tag">${tag}</span>`).join('')}
      </div>
      <h3 class="project-card__title">${p.title}</h3>
      <p class="project-card__desc">${p.desc}</p>
    </div>
  `).join('');
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simple submission feedback
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Sending...';
    setTimeout(() => {
      button.textContent = 'Sent!';
      form.reset();
      setTimeout(() => button.textContent = originalText, 2000);
    }, 800);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Set dark theme by default
  document.body.classList.add('dark');

  initThree();
  animateThree();
  gsap.registerPlugin(ScrollTrigger);
  initScrollAnimations();
  initCursor();
  initNavigation();
  initThemeToggle();
  initPreloader();
  initContactForm();
  renderProjects();
});

// ===== DEBUG: Show current date =====
function showDate() {
  const date = new Date();
  console.log(`Apricode Agency - Page loaded on ${date.toLocaleDateString()}`);
}
showDate();
