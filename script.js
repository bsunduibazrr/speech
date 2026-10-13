/**
 * NBA RECORDS - 20-SLIDE INTERACTIVE PRESENTATION DECK (PPT)
 * Featuring Interactive 3D Basketball (Three.js) & GSAP Slide Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. THREE.JS 3D BASKETBALL ENGINE
  // ==========================================
  const canvas = document.getElementById('three-canvas');
  let scene, camera, renderer, basketball, basketballGroup;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotationX = 0.2;
  let targetRotationY = 0.4;

  function initThree() {
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Basketball Group
    basketballGroup = new THREE.Group();
    scene.add(basketballGroup);

    // Procedural Basketball Texture
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 1024;
    textureCanvas.height = 512;
    const ctx = textureCanvas.getContext('2d');

    // Leather base
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, '#c73b0c');
    grad.addColorStop(0.5, '#e04a1b');
    grad.addColorStop(1, '#b53207');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Pebble noise pattern
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let x = 0; x < 1024; x += 4) {
      for (let y = 0; y < 512; y += 4) {
        if ((x + y) % 8 === 0) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }

    // Black Seams of Basketball
    ctx.strokeStyle = '#181818';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';

    // Horizontal equator
    ctx.beginPath();
    ctx.moveTo(0, 256);
    ctx.lineTo(1024, 256);
    ctx.stroke();

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 512);
    ctx.moveTo(768, 0);
    ctx.lineTo(768, 512);
    ctx.stroke();

    // Curved ribs
    ctx.beginPath();
    ctx.ellipse(256, 256, 160, 220, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(768, 256, 160, 220, 0, 0, Math.PI * 2);
    ctx.stroke();

    const ballTexture = new THREE.CanvasTexture(textureCanvas);
    ballTexture.wrapS = THREE.RepeatWrapping;
    ballTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Bump texture
    const bumpTexture = new THREE.CanvasTexture(textureCanvas);

    // Sphere Geometry & Material
    const geometry = new THREE.SphereGeometry(1.4, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      map: ballTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.03,
      roughness: 0.5,
      metalness: 0.08
    });

    basketball = new THREE.Mesh(geometry, material);
    basketballGroup.add(basketball);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Dramatic Red Rim Spotlight
    const redLight = new THREE.PointLight(0xe10600, 3.5, 15);
    redLight.position.set(-4, -2, 3);
    scene.add(redLight);

    // Subtle White Backlight
    const backLight = new THREE.PointLight(0xffffff, 1.2, 10);
    backLight.position.set(0, 3, -4);
    scene.add(backLight);

    // Position ball on Hero slide
    updateBallPosition(0);

    // Mouse Drag Interaction on 3D Ball
    window.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !basketball) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Resize Handling
    window.addEventListener('resize', () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);

      if (basketball) {
        if (!isDragging) {
          targetRotationY += 0.004;
          targetRotationX += Math.sin(Date.now() * 0.001) * 0.0005;
        }

        basketball.rotation.y += (targetRotationY - basketball.rotation.y) * 0.08;
        basketball.rotation.x += (targetRotationX - basketball.rotation.x) * 0.08;

        // Gentle floating bounce
        basketball.position.y = Math.sin(Date.now() * 0.002) * 0.08;
      }

      renderer.render(scene, camera);
    }
    animate();
  }

  function updateBallPosition(slideIndex) {
    if (!basketballGroup) return;

    if (slideIndex === 0) {
      // Hero slide: Right center, prominent
      gsap.to(basketballGroup.position, {
        x: window.innerWidth > 900 ? 1.6 : 0,
        y: window.innerWidth > 900 ? 0 : -0.4,
        z: 0,
        duration: 1,
        ease: 'power3.out'
      });
      gsap.to(basketballGroup.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: 'power3.out'
      });
      gsap.to(canvas, { opacity: 0.95, duration: 0.6 });
    } else {
      // Other slides: Subtly in ambient background corner
      gsap.to(basketballGroup.position, {
        x: 2.8,
        y: -1.8,
        z: -2,
        duration: 1.2,
        ease: 'power3.out'
      });
      gsap.to(basketballGroup.scale, {
        x: 0.6,
        y: 0.6,
        z: 0.6,
        duration: 1.2,
        ease: 'power3.out'
      });
      gsap.to(canvas, { opacity: 0.15, duration: 0.6 });
    }
  }

  initThree();

  // ==========================================
  // 2. 20-SLIDE DECK CONTROLLER (PPT LOGIC)
  // ==========================================
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const currentNumEl = document.getElementById('current-slide-num');
  const topicEl = document.getElementById('deck-topic');
  const progressBar = document.getElementById('deck-progress-bar');
  const fullscreenBtn = document.getElementById('fullscreen-btn');

  let currentIndex = 0;
  const totalSlides = slides.length;
  let isAnimating = false;

  function updateDeck(newIndex) {
    if (newIndex < 0 || newIndex >= totalSlides || isAnimating) return;
    isAnimating = true;

    const previousSlide = slides[currentIndex];
    currentIndex = newIndex;
    const activeSlide = slides[currentIndex];

    // Update Slide Classes
    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev');
      if (idx < currentIndex) {
        slide.classList.add('prev');
      }
    });
    activeSlide.classList.add('active');

    // Update 3D Ball Position
    updateBallPosition(currentIndex);

    // Update Counter & Topic
    const formattedNum = String(currentIndex + 1).padStart(2, '0');
    if (currentNumEl) currentNumEl.textContent = formattedNum;

    const topic = activeSlide.getAttribute('data-topic') || 'NBA RECORDS';
    if (topicEl) {
      topicEl.innerHTML = `<i class="ph-bold ph-sparkle"></i> <span>${topic}</span>`;
    }

    // Update Progress Bar
    if (progressBar) {
      const progress = ((currentIndex + 1) / totalSlides) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Update Button Disabled States
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === totalSlides - 1;

    // Trigger GSAP Stagger Entrance Animations for elements on the active slide
    if (typeof gsap !== 'undefined') {
      const animTargets = activeSlide.querySelectorAll(
        '.slide-badge-title, .slide-huge-num, .slide-heading, .slide-bullet-item, .slide-image-card, .deck-mini-card, .height-deck-stage, .hero-tag, .hero-main-title, .hero-subtitle-text, .hero-stats-row, .outro-big-quote, .outro-body-text, .outro-question-tag, .outro-thanks-box'
      );

      gsap.fromTo(animTargets,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.55, ease: 'power3.out' }
      );
    }

    setTimeout(() => {
      isAnimating = false;
    }, 450);
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      updateDeck(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      updateDeck(currentIndex - 1);
    }
  }

  // Button Listeners
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ': // Spacebar
      case 'Enter':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
      case 'Backspace':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        updateDeck(0);
        break;
      case 'End':
        e.preventDefault();
        updateDeck(totalSlides - 1);
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
    }
  });

  // Trackpad / Mousewheel Navigation (Throttled)
  let wheelTimeout = null;
  window.addEventListener('wheel', (e) => {
    if (wheelTimeout) return;

    if (Math.abs(e.deltaY) > 30) {
      if (e.deltaY > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 700);
    }
  }, { passive: true });

  // Touch Swipe on Mobile/Tablet
  let touchStartX = 0;
  let touchStartY = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, { passive: true });

  // Fullscreen Handler
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  // Initialize First Slide
  updateDeck(0);
});
