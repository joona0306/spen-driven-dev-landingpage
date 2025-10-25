const { body, validationResult } = require("express-validator");

const contactValidationRules = () => {
  return [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("이름은 2자 이상이어야 합니다.")
      .matches(/^[가-힣a-zA-Z\s]+$/)
      .withMessage("이름은 한글 또는 영문만 입력 가능합니다.")
      .escape(),

    body("email")
      .trim()
      .isEmail()
      .withMessage("올바른 이메일 주소를 입력해주세요.")
      .normalizeEmail(),

    body("phone")
      .optional({ checkFalsy: true })
      .trim()
      .matches(/^(\d{3}-\d{4}-\d{4}|\d{11}|01\d-\d{3,4}-\d{4})$/)
      .withMessage("올바른 전화번호 형식을 입력해주세요."),

    body("company")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 100 })
      .withMessage("회사명은 100자 이하로 입력해주세요.")
      .escape(),

    body("message")
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage("메시지는 10자 이상 500자 이하로 입력해주세요.")
      .escape(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  contactValidationRules,
  validate,
};
