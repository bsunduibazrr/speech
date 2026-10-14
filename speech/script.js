/**
 * NBA RECORDS - 15-SLIDE EDITORIAL PRESENTATION DECK (WHITE & RED)
 * Powered by GSAP Kinetic Red Curtain Wipe Transitions & Responsive Controls
 */

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const currentNumEl = document.getElementById("current-slide-num");
  const topicEl = document.getElementById("deck-topic");
  const progressBar = document.getElementById("deck-progress-bar");
  const dotsContainer = document.getElementById("deck-dots-container");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const curtain = document.getElementById("transition-curtain");

  let currentIndex = 0;
  const totalSlides = slides.length;
  let isTransitioning = false;

  // CSS-ийн translateX(-100%)-г GSAP-ийн x-тэй давхцуулахгүйн тулд цэвэрлэнэ
  const hideCurtain = () => {
    if (typeof gsap !== "undefined" && curtain) {
      gsap.killTweensOf(curtain);
      gsap.set(curtain, { x: 0, xPercent: -100 });
    }
  };
  hideCurtain();

  // Build 15 Navigation Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, idx) => {
      const dot = document.createElement("div");
      dot.className = `deck-dot ${idx === 0 ? "active" : ""}`;
      dot.title = `Слайд ${idx + 1}`;
      dot.addEventListener("click", () => {
        if (idx !== currentIndex && !isTransitioning) {
          goToSlide(idx, idx > currentIndex ? "next" : "prev");
        }
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots(index) {
    const dots = document.querySelectorAll(".deck-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
    });
  }

  // Smooth Kinetic Red Curtain Wipe Page Transition
  function goToSlide(newIndex, direction = "next") {
    if (newIndex < 0 || newIndex >= totalSlides || isTransitioning) return;
    isTransitioning = true;

    const fromX = direction === "next" ? -100 : 100;
    const exitX = direction === "next" ? 100 : -100;

    if (typeof gsap !== "undefined" && curtain) {
      // Аюулгүйн хамгаалалт: ямар нэг шалтгаанаар гацвал хөшгийг заавал арилгана
      const failsafe = setTimeout(() => {
        hideCurtain();
        applySlideSwitch(newIndex);
        isTransitioning = false;
      }, 1500);

      const finish = () => {
        clearTimeout(failsafe);
        hideCurtain();
        isTransitioning = false;
      };

      // Step 1: Red Curtain sweeps in
      gsap.fromTo(
        curtain,
        { x: 0, xPercent: fromX },
        {
          x: 0,
          xPercent: 0,
          duration: 0.6,
          ease: "power3.in",
          onComplete: () => {
            // Step 2: Switch active slide while hidden under red curtain
            applySlideSwitch(newIndex);

            // Step 3: Red Curtain sweeps out, revealing the new slide
            gsap.to(curtain, {
              x: 0,
              xPercent: exitX,
              duration: 0.8,
              ease: "power3.out",
              onComplete: finish,
            });

            // Animate incoming slide content with elegant stagger
            animateSlideContent(slides[newIndex]);
          },
        },
      );
    } else {
      applySlideSwitch(newIndex);
      isTransitioning = false;
    }
  }

  function applySlideSwitch(newIndex) {
    slides.forEach((slide, idx) => {
      slide.classList.remove("active", "prev");
      if (idx < newIndex) {
        slide.classList.add("prev");
      }
    });

    currentIndex = newIndex;
    const activeSlide = slides[currentIndex];
    activeSlide.classList.add("active");

    // Update Counter
    const formattedNum = String(currentIndex + 1).padStart(2, "0");
    if (currentNumEl) currentNumEl.textContent = formattedNum;

    // Update Topic
    const topic = activeSlide.getAttribute("data-topic") || "NBA RECORDS";
    if (topicEl) {
      topicEl.innerHTML = `<i class="ph-bold ph-sparkle"></i> <span>${topic}</span>`;
    }

    // Update Progress Bar
    if (progressBar) {
      const progress = ((currentIndex + 1) / totalSlides) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Update Dots
    updateDots(currentIndex);

    // Update Button Disabled States
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === totalSlides - 1;
  }

  function animateSlideContent(slideEl) {
    if (typeof gsap === "undefined" || !slideEl) return;

    const targets = slideEl.querySelectorAll(
      ".slide-pill, .slide-huge-num, .slide-heading, .slide-bullet-item, .slide-image-card, .deck-mini-card, .height-deck-stage, .hero-tag, .hero-main-title, .hero-subtitle-text, .hero-stats-row, .outro-big-quote, .outro-body-text, .outro-question-tag, .outro-thanks-box",
    );

    gsap.fromTo(
      targets,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" },
    );
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1, "next");
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1, "prev");
    }
  }

  // Button Listeners
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  // Keyboard Navigation
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ": // Spacebar
      case "Enter":
        e.preventDefault();
        nextSlide();
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
      case "Backspace":
        e.preventDefault();
        prevSlide();
        break;
      case "Home":
        e.preventDefault();
        goToSlide(0, "prev");
        break;
      case "End":
        e.preventDefault();
        goToSlide(totalSlides - 1, "next");
        break;
      case "f":
      case "F":
        toggleFullscreen();
        break;
    }
  });

  // Trackpad / Mousewheel Navigation (Throttled)
  let wheelTimeout = null;
  window.addEventListener(
    "wheel",
    (e) => {
      if (wheelTimeout || isTransitioning) return;

      if (Math.abs(e.deltaY) > 35) {
        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        wheelTimeout = setTimeout(() => {
          wheelTimeout = null;
        }, 750);
      }
    },
    { passive: true },
  );

  // Mobile / Tablet Touch Swipe
  let touchStartX = 0;
  let touchStartY = 0;

  window.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchend",
    (e) => {
      if (isTransitioning) return;
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
    },
    { passive: true },
  );

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
    fullscreenBtn.addEventListener("click", toggleFullscreen);
  }

  // Initialize First Slide
  applySlideSwitch(0);
});
