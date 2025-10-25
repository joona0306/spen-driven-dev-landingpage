/**
 * Main Application Controller
 * Coordinates all functionality and initializes the app
 */

const AppController = (function () {
  // Private variables
  let state = {
    isLoading: true,
    isOnline: navigator.onLine,
    isMobile: window.innerWidth < 768,
  };

  // Private methods
  function init() {
    console.log("🚀 Initializing Contact Form Landing Page...");

    setupGlobalEventListeners();
    handlePageLoad();
    setupNetworkStatus();
    setupAccessibility();
    checkBrowserSupport();
  }

  /**
   * Setup Global Event Listeners
   */
  function setupGlobalEventListeners() {
    // Page load
    window.addEventListener("load", () => {
      onPageFullyLoaded();
    });

    // Resize
    window.addEventListener(
      "resize",
      Utils.debounce(() => {
        handleResize();
      }, 250)
    );

    // Before unload (save form data)
    window.addEventListener("beforeunload", () => {
      if (window.formController) {
        window.formController.saveFormData();
      }
    });

    // Online/Offline status
    window.addEventListener("online", () => {
      handleOnline();
    });

    window.addEventListener("offline", () => {
      handleOffline();
    });

    // Visibility change (tab focus/blur)
    document.addEventListener("visibilitychange", () => {
      handleVisibilityChange();
    });

    // Error handling
    window.addEventListener("error", (e) => {
      handleError(e.error, e.filename, e.lineno);
    });

    window.addEventListener("unhandledrejection", (e) => {
      handleError(e.reason, "Promise Rejection");
    });
  }

  /**
   * Handle Page Load
   */
  function handlePageLoad() {
    // Preload critical resources
    preloadCriticalResources();

    // Set viewport height for mobile
    setViewportHeight();

    // Initialize components
    initializeComponents();

    // Track page load
    if (window.Analytics) {
      window.Analytics.trackPageView(document.title, window.location.pathname);
    }
  }

  /**
   * Handle Page Fully Loaded
   */
  function onPageFullyLoaded() {
    state.isLoading = false;

    // Remove loading class from body
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");

    // Animation controller is already initialized in animations.js
    // No need to call init() again here

    // Track page fully loaded
    if (window.Analytics) {
      window.Analytics.trackEvent("page_fully_loaded", {
        event_category: "performance",
        load_time: performance.now(),
      });
    }

    console.log("✅ Page fully loaded");
  }

  /**
   * Setup Network Status
   */
  function setupNetworkStatus() {
    // Update network status indicator
    updateNetworkStatus();

    // Listen for network changes
    window.addEventListener("online", () => {
      state.isOnline = true;
      updateNetworkStatus();
      showNotification("인터넷 연결이 복구되었습니다.", "success");
    });

    window.addEventListener("offline", () => {
      state.isOnline = false;
      updateNetworkStatus();
      showNotification("인터넷 연결이 끊어졌습니다.", "warning");
    });
  }

  /**
   * Update Network Status
   */
  function updateNetworkStatus() {
    const statusIndicator = document.getElementById("networkStatus");
    if (statusIndicator) {
      statusIndicator.className = `network-status ${state.isOnline ? "online" : "offline"}`;
      statusIndicator.textContent = state.isOnline ? "온라인" : "오프라인";
    }
  }

  /**
   * Setup Accessibility
   */
  function setupAccessibility() {
    // Skip links
    setupSkipLinks();

    // Focus management
    setupFocusManagement();

    // Keyboard navigation
    setupKeyboardNavigation();

    // Screen reader announcements
    setupScreenReaderAnnouncements();
  }

  /**
   * Setup Skip Links
   */
  function setupSkipLinks() {
    const skipLinks = document.querySelectorAll(".skip-link");
    skipLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  /**
   * Setup Focus Management
   */
  function setupFocusManagement() {
    // Trap focus in modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        const activeElement = document.activeElement;
        const modal = activeElement.closest(".modal");

        if (modal) {
          const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  /**
   * Setup Keyboard Navigation
   */
  function setupKeyboardNavigation() {
    // Escape key handling
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        // Close any open modals or menus
        const openModal = document.querySelector(".modal.active");
        if (openModal) {
          closeModal(openModal);
        }

        const openMenu = document.querySelector(".nav-menu.active");
        if (openMenu && window.animationController) {
          window.animationController.closeMobileMenu();
        }
      }
    });
  }

  /**
   * Setup Screen Reader Announcements
   */
  function setupScreenReaderAnnouncements() {
    // Create live region for announcements
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";
    liveRegion.id = "liveRegion";
    document.body.appendChild(liveRegion);
  }

  /**
   * Check Browser Support
   */
  function checkBrowserSupport() {
    const unsupportedFeatures = [];

    // Check for required features
    if (!window.fetch) {
      unsupportedFeatures.push("Fetch API");
    }

    if (!window.IntersectionObserver) {
      unsupportedFeatures.push("Intersection Observer");
    }

    if (!window.CSS || !window.CSS.supports) {
      unsupportedFeatures.push("CSS.supports");
    }

    if (unsupportedFeatures.length > 0) {
      showBrowserWarning(unsupportedFeatures);
    }
  }

  /**
   * Show Browser Warning
   */
  function showBrowserWarning(features) {
    const warning = document.createElement("div");
    warning.className = "browser-warning";
    warning.innerHTML = `
      <div class="warning-content">
        <h3>⚠️ 브라우저 호환성 경고</h3>
        <p>현재 브라우저에서 일부 기능이 지원되지 않습니다:</p>
        <ul>
          ${features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
        <p>최신 브라우저로 업데이트하시면 더 나은 경험을 제공받을 수 있습니다.</p>
        <button onclick="this.parentElement.parentElement.remove()">확인</button>
      </div>
    `;
    document.body.appendChild(warning);
  }

  /**
   * Preload Critical Resources
   */
  function preloadCriticalResources() {
    // Preload critical CSS
    const criticalCSS = document.createElement("link");
    criticalCSS.rel = "preload";
    criticalCSS.href = "css/base.css";
    criticalCSS.as = "style";
    document.head.appendChild(criticalCSS);

    // Preload critical images (주석 처리 - 이미지 파일이 추가되면 활성화)
    // const criticalImages = ["assets/images/hero-bg.jpg", "assets/images/logo.png"];
    //
    // criticalImages.forEach((src) => {
    //   const link = document.createElement("link");
    //   link.rel = "preload";
    //   link.href = src;
    //   link.as = "image";
    //   document.head.appendChild(link);
    // });
  }

  /**
   * Set Viewport Height
   */
  function setViewportHeight() {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
  }

  /**
   * Initialize Components
   */
  function initializeComponents() {
    // Initialize form controller
    if (window.formController) {
      window.formController.init();
    }

    // Initialize analytics
    if (window.Analytics) {
      window.Analytics.init();
    }
  }

  /**
   * Handle Resize
   */
  function handleResize() {
    const wasMobile = state.isMobile;
    state.isMobile = window.innerWidth < 768;

    // Handle mobile/desktop transition
    if (wasMobile !== state.isMobile) {
      if (
        window.animationController &&
        typeof window.animationController.closeMobileMenu === "function"
      ) {
        // Close mobile menu if switching to desktop
        if (!state.isMobile) {
          window.animationController.closeMobileMenu();
        }
      }
    }

    // Update viewport height
    setViewportHeight();
  }

  /**
   * Handle Online
   */
  function handleOnline() {
    state.isOnline = true;
    updateNetworkStatus();
    showNotification("인터넷 연결이 복구되었습니다.", "success");
  }

  /**
   * Handle Offline
   */
  function handleOffline() {
    state.isOnline = false;
    updateNetworkStatus();
    showNotification("인터넷 연결이 끊어졌습니다.", "warning");
  }

  /**
   * Handle Visibility Change
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden
      if (window.Analytics) {
        window.Analytics.trackEvent("page_hidden", {
          event_category: "engagement",
        });
      }
    } else {
      // Page is visible
      if (window.Analytics) {
        window.Analytics.trackEvent("page_visible", {
          event_category: "engagement",
        });
      }
    }
  }

  /**
   * Handle Error
   */
  function handleError(error, filename, lineno) {
    console.error("Application Error:", error, filename, lineno);

    // Track error with analytics
    if (window.Analytics) {
      window.Analytics.trackEvent("javascript_error", {
        event_category: "error",
        error_message: error.message || error,
        error_filename: filename,
        error_line: lineno,
      });
    }

    // Show user-friendly error message
    showNotification("예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요.", "error");
  }

  /**
   * Show Notification
   */
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Auto remove
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Close Modal
   */
  function closeModal(modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  /**
   * Debug Mode
   */
  function enableDebugMode() {
    window.appDebug = {
      state: state,
      controllers: {
        form: window.formController,
        animation: window.animationController,
        analytics: window.Analytics,
      },
      utils: Utils,
    };

    console.log("🐛 Debug mode enabled. Access via window.appDebug");
  }

  // Public API
  return {
    init,
    enableDebugMode,
  };
})();

// Auto-initialize
document.addEventListener("DOMContentLoaded", () => {
  AppController.init();

  // Enable debug mode in development
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    AppController.enableDebugMode();
  }
});
