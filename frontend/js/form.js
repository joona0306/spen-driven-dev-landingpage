/**
 * Form Controller
 * Handles form validation, submission, and API communication
 */

const FormController = (function () {
  // Private variables
  let form, submitBtn, formMessage, btnSpinner, btnText;
  let fields = {};
  let validationRules = {};
  // 배포 시에는 실제 백엔드 URL로 변경
  let apiEndpoint = "https://spen-driven-dev-landingpage-production.up.railway.app/api/contact";
  // 로컬 개발 시: "http://localhost:3000/api/contact"
  let isSubmitting = false; // 중복 제출 방지

  // Private methods
  function init() {
    form = document.getElementById("contactForm");
    submitBtn = document.getElementById("submitBtn");
    formMessage = document.getElementById("formMessage");
    btnSpinner = document.getElementById("btnSpinner");
    btnText = submitBtn?.querySelector(".btn-text");

    fields = {
      name: document.getElementById("name"),
      email: document.getElementById("email"),
      phone: document.getElementById("phone"),
      company: document.getElementById("company"),
      message: document.getElementById("message"),
    };

    validationRules = {
      name: {
        required: true,
        minLength: 2,
        pattern: /^[가-힣a-zA-Z\s]+$/,
        errorMessages: {
          required: "이름을 입력해주세요.",
          minLength: "이름은 2자 이상이어야 합니다.",
          pattern: "이름은 한글 또는 영문만 입력 가능합니다.",
        },
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessages: {
          required: "이메일을 입력해주세요.",
          pattern: "올바른 이메일 형식이 아닙니다.",
        },
      },
      phone: {
        required: false,
        pattern: /^(\d{3}-\d{4}-\d{4}|\d{11}|01\d-\d{3,4}-\d{4})$/,
        errorMessages: {
          pattern: "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)",
        },
      },
      company: {
        required: false,
        maxLength: 100,
        errorMessages: {
          maxLength: "회사명은 100자 이하로 입력해주세요.",
        },
      },
      message: {
        required: true,
        minLength: 10,
        maxLength: 500,
        errorMessages: {
          required: "메시지를 입력해주세요.",
          minLength: "메시지는 10자 이상 입력해주세요.",
          maxLength: "메시지는 500자 이하로 입력해주세요.",
        },
      },
    };

    setupEventListeners();
    loadSavedFormData();
  }

  /**
   * Setup Event Listeners
   */
  function setupEventListeners() {
    if (!form) return;

    // Form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSubmit();
    });

    // Real-time validation
    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      if (field) {
        field.addEventListener("blur", () => validateField(fieldName));
        field.addEventListener("input", () => clearFieldError(fieldName));

        // Phone number formatting
        if (fieldName === "phone") {
          field.addEventListener("input", (e) => {
            e.target.value = Utils.formatPhoneNumber(e.target.value);
          });
        }
      }
    });

    // Auto-save form data
    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      if (field) {
        field.addEventListener("input", () => {
          saveFormData();
        });
      }
    });
  }

  /**
   * Handle Form Submission
   */
  async function handleSubmit() {
    // 중복 제출 방지
    if (isSubmitting) {
      console.log("Form is already being submitted");
      return;
    }

    isSubmitting = true;
    // hideMessage()를 제거 - 성공 메시지가 숨겨지는 것을 방지

    if (!validateForm()) {
      showMessage("모든 필수 항목을 올바르게 입력해주세요.", "error");
      isSubmitting = false;

      // Focus first error field
      const firstError = form.querySelector(".form-group.error input, .form-group.error textarea");
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    const formData = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim() || undefined,
      company: fields.company.value.trim() || undefined,
      message: fields.message.value.trim(),
    };

    // Sanitize input data
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formData[key] = Utils.sanitizeHTML(formData[key]);
      }
    });

    setLoadingState(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // 이전 메시지 완전히 정리
        if (formMessage) {
          formMessage.style.cssText = "";
          formMessage.className = "form-message";
          formMessage.textContent = "";
        }

        // 잠시 대기 후 성공 메시지 표시
        setTimeout(() => {
          showMessage(
            "메일이 성공적으로 전송되었습니다! 입력해주신 이메일 주소로 빠른 시일 내에 답변드리겠습니다.",
            "success"
          );
        }, 100);
        resetForm();

        // Track with analytics (if enabled)
        if (window.Analytics) {
          window.Analytics.trackFormSubmit();
        }

        // Clear saved form data
        clearSavedFormData();
      } else {
        const errorMessage = result.message || "전송 중 오류가 발생했습니다. 다시 시도해주세요.";
        showMessage(errorMessage, "error");

        // Show field-specific errors
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((error) => {
            if (error.field && fields[error.field]) {
              showFieldError(error.field, error.message);
            }
          });
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showMessage(
        "네트워크 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.",
        "error"
      );
    } finally {
      setLoadingState(false);
      isSubmitting = false; // 제출 완료 후 플래그 리셋
    }
  }

  /**
   * Validate Form
   */
  function validateForm() {
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      if (!validateField(fieldName)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate Individual Field
   */
  function validateField(fieldName) {
    const field = fields[fieldName];
    const rules = validationRules[fieldName];

    if (!field || !rules) return true;

    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Required validation
    if (rules.required && !value) {
      isValid = false;
      errorMessage = rules.errorMessages.required;
    }

    // Length validations
    if (isValid && value) {
      if (rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorMessage = rules.errorMessages.minLength;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        isValid = false;
        errorMessage = rules.errorMessages.maxLength;
      }
    }

    // Pattern validation
    if (isValid && value && rules.pattern && !rules.pattern.test(value)) {
      isValid = false;
      errorMessage = rules.errorMessages.pattern;
    }

    // Update UI
    if (isValid) {
      clearFieldError(fieldName);
    } else {
      showFieldError(fieldName, errorMessage);
    }

    return isValid;
  }

  /**
   * Show Field Error
   */
  function showFieldError(fieldName, message) {
    const field = fields[fieldName];
    if (!field) return;

    const formGroup = field.closest(".form-group");
    if (formGroup) {
      formGroup.classList.add("error");
    }

    // Remove existing error message
    const existingError = formGroup?.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    if (formGroup && message) {
      const errorElement = document.createElement("div");
      errorElement.className = "error-message";
      errorElement.textContent = message;
      formGroup.appendChild(errorElement);
    }
  }

  /**
   * Clear Field Error
   */
  function clearFieldError(fieldName) {
    const field = fields[fieldName];
    if (!field) return;

    const formGroup = field.closest(".form-group");
    if (formGroup) {
      formGroup.classList.remove("error");

      const errorMessage = formGroup.querySelector(".error-message");
      if (errorMessage) {
        errorMessage.remove();
      }
    }
  }

  /**
   * Show Form Message
   */
  function showMessage(message, type = "info") {
    if (!formMessage) {
      console.error("formMessage element not found!");
      return;
    }

    console.log("Displaying message:", message, "Type:", type);

    // 메시지 내용 설정
    formMessage.textContent = message;

    // 클래스 적용
    formMessage.className = `form-message ${type}`;

    // 강제로 스타일 적용
    formMessage.style.cssText = `
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: relative !important;
      z-index: 10 !important;
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;
      font-weight: 500;
      min-height: 50px;
      line-height: 1.5;
    `;

    // 성공 메시지인 경우 추가 스타일
    if (type === "success") {
      formMessage.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: relative !important;
        z-index: 10 !important;
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 0.5rem;
        text-align: center;
        font-weight: 500;
        min-height: 50px;
        line-height: 1.5;
        background-color: #d4edda !important;
        color: #155724 !important;
        border: 1px solid #c3e6cb !important;
      `;
    } else if (type === "error") {
      formMessage.style.cssText += `
        background-color: #f8d7da !important;
        color: #721c24 !important;
        border: 1px solid #f5c6cb !important;
      `;
    }

    // 메시지로 스크롤
    setTimeout(() => {
      formMessage.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 100);

    // Auto-hide success messages
    if (type === "success") {
      setTimeout(() => {
        hideMessage();
      }, 8000); // 8초로 연장
    }

    // Scroll to message
    formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /**
   * Hide Form Message
   */
  function hideMessage() {
    if (formMessage) {
      formMessage.style.display = "none";
      formMessage.className = "form-message";
      formMessage.textContent = "";
    }
  }

  /**
   * Set Loading State
   */
  function setLoadingState(isLoading) {
    if (!submitBtn) return;

    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");

      if (btnSpinner) {
        btnSpinner.style.display = "inline-block";
      }

      if (btnText) {
        btnText.textContent = "전송 중...";
      }
    } else {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");

      if (btnSpinner) {
        btnSpinner.style.display = "none";
      }

      if (btnText) {
        btnText.textContent = "문의하기";
      }
    }
  }

  /**
   * Reset Form
   */
  function resetForm() {
    if (!form) return;

    form.reset();

    // Clear all field errors
    Object.keys(fields).forEach((fieldName) => {
      clearFieldError(fieldName);
    });

    // Hide message
    hideMessage();

    // Focus first field
    if (fields.name) {
      fields.name.focus();
    }
  }

  /**
   * Save Form Data to Local Storage
   */
  function saveFormData() {
    if (!form) return;

    const formData = {};
    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      if (field) {
        formData[fieldName] = field.value; // Save even empty values
      }
    });

    try {
      localStorage.setItem("contactFormData", JSON.stringify(formData));
    } catch (error) {
      console.warn("Could not save form data:", error);
    }
  }

  /**
   * Load Saved Form Data
   */
  function loadSavedFormData() {
    if (!form) return;

    try {
      const savedData = localStorage.getItem("contactFormData");
      if (savedData) {
        const formData = JSON.parse(savedData);

        Object.keys(formData).forEach((fieldName) => {
          const field = fields[fieldName];
          if (field) {
            field.value = formData[fieldName] || "";
          }
        });
      }
    } catch (error) {
      console.warn("Could not load saved form data:", error);
    }
  }

  /**
   * Clear Saved Form Data
   */
  function clearSavedFormData() {
    try {
      localStorage.removeItem("contactFormData");
    } catch (error) {
      console.warn("Could not clear saved form data:", error);
    }
  }

  // Public API
  return {
    init,
    validateForm,
    resetForm,
    saveFormData,
    clearSavedFormData,
  };
})();

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.formController = FormController;
    FormController.init();
  });
} else {
  window.formController = FormController;
  FormController.init();
}
