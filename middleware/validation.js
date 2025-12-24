const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      errors: errors.array()
    });
  }
  next();
};

const validateCreatePaymentIntent = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .isLength({ min: 3, max: 3 })
    .isUppercase()
    .withMessage('Currency must be a 3-letter uppercase code (e.g., USD)'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object'),
  handleValidationErrors
];

const validateConfirmPayment = [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment Intent ID is required'),
  handleValidationErrors
];

const validateRefund = [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment Intent ID is required'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number if provided'),
  handleValidationErrors
];

module.exports = {
  validateCreatePaymentIntent,
  validateConfirmPayment,
  validateRefund
};
