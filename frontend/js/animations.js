/**
 * Animation Controller
 * Manages all animations, scroll effects, and interactive elements
 */

const AnimationController = (function () {
  // Private variables
  let elements = {};
  let state = {
    isScrolling: false,
    lastScrollTop: 0,
    hasAnimatedCounters: false,
  };

  // Private methods
  function init() {
    elements = {
      progressBar: document.getElementById("progressBar"),
      navbar: document.getElementById("navbar"),
      backToTop: document.getElementById("backToTop"),
      hamburger: document.getElementById("hamburger"),
      navMenu: document.getElementById("navMenu"),
      benefitNumbers: document.querySelectorAll(".benefit-number"),
      aosElements: document.querySelectorAll("[data-aos]"),
    };

    setupEventListeners();
    setupIntersectionObserver();
    setupParallax();
    setupSmoothScroll();
    setupMobileMenu();
    initCounterAnimation();
  }

  /**
   * Setup Event Listeners
   */
  function setupEventListeners() {
    // Scroll events
    window.addEventListener(
      "scroll",
      Utils.throttle(() => {
        updateProgressBar();
        updateNavbar();
        toggleBackToTop();
      }, 16)
    );

    // Resize events
    window.addEventListener(
      "resize",
      Utils.debounce(() => {
        handleResize();
      }, 250)
    );

    // Navigation links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        Utils.scrollToElement(targetId);

        // Close mobile menu if open
        if (elements.navMenu.classList.contains("active")) {
          closeMobileMenu();
        }
      });
    });

    // Back to top button
    if (elements.backToTop) {
      elements.backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Ripple effect for buttons
    setupRippleEffect();
  }

  /**
   * Update Progress Bar
   */
  function updateProgressBar() {
    if (!elements.progressBar) return;

    const progress = Utils.getScrollProgress();
    elements.progressBar.style.width = `${progress}%`;
  }

  /**
   * Update Navbar on Scroll
   */
  function updateNavbar() {
    if (!elements.navbar) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      elements.navbar.classList.add("scrolled");
    } else {
      elements.navbar.classList.remove("scrolled");
    }

    state.lastScrollTop = scrollTop;
  }

  /**
   * Toggle Back to Top Button
   */
  function toggleBackToTop() {
    if (!elements.backToTop) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 300) {
      elements.backToTop.classList.add("visible");
    } else {
      elements.backToTop.classList.remove("visible");
    }
  }

  /**
   * Setup Intersection Observer for AOS (Animate On Scroll)
   */
  function setupIntersectionObserver() {
    if (!Utils.supports.intersectionObserver()) {
      // Fallback: show all elements
      elements.aosElements.forEach((el) => el.classList.add("aos-animate"));
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-aos-delay") || 0;
          setTimeout(() => {
            entry.target.classList.add("aos-animate");
          }, delay);

          // Trigger counter animation for benefit numbers
          if (entry.target.classList.contains("benefit-item") && !state.hasAnimatedCounters) {
            animateCounters();
            state.hasAnimatedCounters = true;
          }
        }
      });
    }, observerOptions);

    elements.aosElements.forEach((el) => observer.observe(el));

    // Observe benefit items for counter animation
    document.querySelectorAll(".benefit-item").forEach((el) => observer.observe(el));
  }

  /**
   * Animate Counters
   */
  function animateCounters() {
    elements.benefitNumbers.forEach((element) => {
      const target = parseInt(element.getAttribute("data-count"));
      Utils.animateCounter(element, target, 2000);
    });
  }

  /**
   * Initialize Counter Animation (backup)
   */
  function initCounterAnimation() {
    if (!Utils.supports.intersectionObserver()) {
      // Fallback: animate on page load
      setTimeout(() => {
        animateCounters();
      }, 1000);
    }
  }

  /**
   * Setup Parallax Effect
   */
  function setupParallax() {
    const heroBackground = document.querySelector(".hero-background");
    if (!heroBackground) return;

    window.addEventListener(
      "scroll",
      Utils.throttle(() => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;

        const orbs = heroBackground.querySelectorAll(".gradient-orb");
        orbs.forEach((orb, index) => {
          const speed = parallaxSpeed * (index + 1) * 0.3;
          orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
      }, 16)
    );
  }

  /**
   * Setup Smooth Scroll
   */
  function setupSmoothScroll() {
    // Global smooth scroll function
    window.scrollToSection = (sectionId) => {
      Utils.scrollToElement(sectionId);

      // Track with analytics
      if (window.Analytics) {
        window.Analytics.trackEvent("scroll_to_section", {
          section: sectionId,
        });
      }
    };
  }

  /**
   * Setup Mobile Menu
   */
  function setupMobileMenu() {
    if (!elements.hamburger || !elements.navMenu) return;

    elements.hamburger.addEventListener("click", () => {
      const isActive = elements.navMenu.classList.contains("active");

      if (isActive) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".nav-container") && elements.navMenu.classList.contains("active")) {
        closeMobileMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && elements.navMenu.classList.contains("active")) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    elements.navMenu.classList.add("active");
    elements.hamburger.classList.add("active");
    elements.hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    elements.navMenu.classList.remove("active");
    elements.hamburger.classList.remove("active");
    elements.hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  /**
   * Setup Ripple Effect for Buttons
   */
  function setupRippleEffect() {
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: translate(-50%, -50%);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;

        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  /**
   * Handle Resize Events
   */
  function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 1023 && elements.navMenu.classList.contains("active")) {
      closeMobileMenu();
    }
  }

  /**
   * Animate Element In (utility method)
   */
  function animateIn(element, animationType = "fadeInUp", delay = 0) {
    setTimeout(() => {
      element.style.opacity = "1";
      element.classList.add(animationType);
    }, delay);
  }

  /**
   * Add Hover Effects to Feature Cards
   */
  function setupFeatureCardEffects() {
    const featureCards = document.querySelectorAll(".feature-card");

    featureCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px) scale(1.02)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
      });
    });
  }

  /**
   * Animate Section On Scroll
   */
  function animateSectionOnScroll(section, animation = "fadeInUp") {
    if (!Utils.supports.intersectionObserver()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated", animation);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
  }

  /**
   * Reset Animations (for development)
   */
  function resetAnimations() {
    elements.aosElements.forEach((el) => {
      el.classList.remove("aos-animate");
    });

    elements.benefitNumbers.forEach((el) => {
      el.textContent = "0";
    });

    state.hasAnimatedCounters = false;
  }

  // Public API
  return {
    init,
    animateIn,
    setupFeatureCardEffects,
    animateSectionOnScroll,
    resetAnimations,
  };
})();

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.animationController = AnimationController;
    AnimationController.init();
  });
} else {
  window.animationController = AnimationController;
  AnimationController.init();
}
