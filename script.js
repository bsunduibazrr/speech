/**
 * NBA RECORDS - INTERACTIVE PRESENTATION CONTROLLER (PPT DECK)
 * Keyboard Navigation, Touch Swiping, Wheel Throttling, Fullscreen
 */

document.addEventListener('DOMContentLoaded', () => {
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

    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev');
      if (idx < newIndex) {
        slide.classList.add('prev');
      }
    });

    currentIndex = newIndex;
    const activeSlide = slides[currentIndex];
    activeSlide.classList.add('active');

    // Update Counter & Topic
    const formattedNum = String(currentIndex + 1).padStart(2, '0');
    if (currentNumEl) currentNumEl.textContent = formattedNum;

    const topic = activeSlide.getAttribute('data-topic') || 'NBA RECORDS';
    if (topicEl) topicEl.textContent = topic;

    // Update Progress Bar
    if (progressBar) {
      const progress = ((currentIndex + 1) / totalSlides) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Update Button Disabled States
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === totalSlides - 1;

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

  // Mobile / Tablet Touch Swipe
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
