/**
 * Analytics Controller
 * Handles Google Analytics 4 event tracking
 */

const Analytics = (function () {
  // Private variables
  let isGALoaded = false;

  // Private methods
  function init() {
    isGALoaded = false; // Disabled

    if (!isGALoaded) {
      return;
    }

    setupAutoTracking();
  }

  /**
   * Setup Automatic Event Tracking
   */
  function setupAutoTracking() {
    // Track button clicks with data-event attribute
    document.querySelectorAll("[data-event]").forEach((button) => {
      button.addEventListener("click", () => {
        const eventName = button.getAttribute("data-event");
        const eventLabel = button.textContent.trim();
        trackEvent(eventName, {
          event_label: eventLabel,
        });
      });
    });

    // Track external links
    document.querySelectorAll('a[href^="http"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const url = link.href;
        if (!url.includes(window.location.hostname)) {
          trackEvent("external_link_click", {
            link_url: url,
            link_text: link.textContent.trim(),
          });
        }
      });
    });

    // Track scroll depth
    trackScrollDepth();

    // Track time on page
    trackTimeOnPage();

    // Track form interactions
    trackFormInteractions();
  }

  /**
   * Track Scroll Depth
   */
  function trackScrollDepth() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 90, 100];
    const trackedMilestones = new Set();

    const trackScroll = Utils.throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        milestones.forEach((milestone) => {
          if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
            trackedMilestones.add(milestone);
            trackEvent("scroll_depth", {
              scroll_percentage: milestone,
            });
          }
        });
      }
    }, 1000);

    window.addEventListener("scroll", trackScroll);
  }

  /**
   * Track Time on Page
   */
  function trackTimeOnPage() {
    const startTime = Date.now();

    // Track time intervals
    const intervals = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
    const trackedIntervals = new Set();

    intervals.forEach((interval) => {
      setTimeout(() => {
        if (!trackedIntervals.has(interval)) {
          trackedIntervals.add(interval);
          trackEvent("time_on_page", {
            time_seconds: interval,
          });
        }
      }, interval * 1000);
    });

    // Track total time on page unload
    window.addEventListener("beforeunload", () => {
      const totalTime = Math.round((Date.now() - startTime) / 1000);
      trackEvent("page_exit", {
        time_on_page_seconds: totalTime,
      });
    });
  }

  /**
   * Track Form Interactions
   */
  function trackFormInteractions() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    // Track form start
    let formStarted = false;
    const formFields = form.querySelectorAll("input, textarea");

    formFields.forEach((field) => {
      field.addEventListener("focus", () => {
        if (!formStarted) {
          formStarted = true;
          trackEvent("form_start", {
            form_name: "contact_form",
          });
        }
      });
    });

    // Track field interactions
    formFields.forEach((field) => {
      field.addEventListener("blur", () => {
        trackEvent("form_field_interaction", {
          field_name: field.name || field.id,
          field_type: field.type || "textarea",
        });
      });
    });
  }

  /**
   * Track Event
   */
  function trackEvent(eventName, parameters = {}) {
    if (!isGALoaded) return;

    try {
      gtag("event", eventName, {
        event_category: parameters.event_category || "engagement",
        event_label: parameters.event_label || "",
        ...parameters,
      });
    } catch (error) {
      console.error("Error tracking event:", error);
    }
  }

  /**
   * Track Form Submit
   */
  function trackFormSubmit() {
    trackEvent("form_submit", {
      event_category: "form",
      form_name: "contact_form",
    });
  }

  /**
   * Track Form Error
   */
  function trackFormError(errorType, errorMessage) {
    trackEvent("form_error", {
      event_category: "form",
      error_type: errorType,
      error_message: errorMessage,
    });
  }

  /**
   * Track Button Click
   */
  function trackButtonClick(buttonText, buttonLocation) {
    trackEvent("button_click", {
      event_category: "engagement",
      button_text: buttonText,
      button_location: buttonLocation,
    });
  }

  /**
   * Track Section View
   */
  function trackSectionView(sectionName) {
    trackEvent("section_view", {
      event_category: "engagement",
      section_name: sectionName,
    });
  }

  /**
   * Track Custom Event
   */
  function trackCustomEvent(eventName, eventCategory, eventLabel, value) {
    trackEvent(eventName, {
      event_category: eventCategory,
      event_label: eventLabel,
      value: value,
    });
  }

  /**
   * Track Page View
   */
  function trackPageView(pageTitle, pagePath) {
    if (!isGALoaded) return;

    try {
      gtag("config", "G-XXXXXXXXXX", {
        page_title: pageTitle,
        page_location: pagePath,
      });
    } catch (error) {
      console.error("Error tracking page view:", error);
    }
  }

  /**
   * Track User Engagement
   */
  function trackUserEngagement(action, details = {}) {
    trackEvent("user_engagement", {
      event_category: "engagement",
      action: action,
      ...details,
    });
  }

  /**
   * Track Performance
   */
  function trackPerformance(metric, value, unit = "ms") {
    trackEvent("performance_metric", {
      event_category: "performance",
      metric_name: metric,
      metric_value: value,
      metric_unit: unit,
    });
  }

  // Public API
  return {
    init,
    trackEvent,
    trackFormSubmit,
    trackFormError,
    trackButtonClick,
    trackSectionView,
    trackCustomEvent,
    trackPageView,
    trackUserEngagement,
    trackPerformance,
  };
})();

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.Analytics = Analytics;
    Analytics.init();
  });
} else {
  window.Analytics = Analytics;
  Analytics.init();
}
