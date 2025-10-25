/**
 * Utility Functions
 * Common helper functions used throughout the application
 */

const Utils = {
  /**
   * Debounce function - limits the rate at which a function can fire
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function - ensures a function is only called once per specified time period
   */
  throttle(func, limit = 100) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Sanitize HTML to prevent XSS attacks
   */
  sanitizeHTML(str) {
    const temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  },

  /**
   * Format phone number to Korean format
   */
  formatPhoneNumber(value) {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length >= 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (cleaned.length >= 7) {
      return cleaned.replace(/(\d{3})(\d{4})/, "$1-$2");
    } else if (cleaned.length >= 3) {
      return cleaned.replace(/(\d{3})/, "$1-");
    }

    return cleaned;
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - offset || document.documentElement.clientHeight - offset) &&
      rect.bottom >= 0
    );
  },

  /**
   * Smooth scroll to element
   */
  scrollToElement(elementId, offset = 70) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  },

  /**
   * Get scroll progress (0-100)
   */
  getScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  },

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  /**
   * Validate phone number (Korean format)
   */
  isValidPhone(phone) {
    const re = /^(\d{3}-\d{4}-\d{4}|\d{11}|01\d-\d{3,4}-\d{4})$/;
    return re.test(phone);
  },

  /**
   * Local storage helper
   */
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error("Error saving to localStorage:", e);
        return false;
      }
    },

    get(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error("Error reading from localStorage:", e);
        return null;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error("Error removing from localStorage:", e);
        return false;
      }
    },
  },

  /**
   * Show notification/toast message
   */
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: var(--bg-secondary);
      color: var(--text-primary);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-xl);
      z-index: 10000;
      transform: translateX(120%);
      transition: transform 0.3s ease;
      max-width: 320px;
    `;

    // Add color based on type
    const colors = {
      success: "var(--color-success)",
      error: "var(--color-error)",
      warning: "var(--color-warning)",
      info: "var(--color-info)",
    };

    if (colors[type]) {
      notification.style.borderLeft = `4px solid ${colors[type]}`;
    }

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(120%)";
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 5000);
  },

  /**
   * Animate counter from 0 to target value
   */
  animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      element.textContent = Math.floor(current);

      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      }
    }, 16);
  },

  /**
   * Get current date/time in Korean format
   */
  getCurrentDateTime() {
    return new Date().toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  },

  /**
   * Check if browser supports a feature
   */
  supports: {
    intersectionObserver() {
      return "IntersectionObserver" in window;
    },
    localStorage() {
      try {
        const test = "__test__";
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    },
    serviceWorker() {
      return "serviceWorker" in navigator;
    },
  },
};

// Make available globally
window.Utils = Utils;
