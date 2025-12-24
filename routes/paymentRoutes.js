const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const {
  validateCreatePaymentIntent,
  validateConfirmPayment,
  validateRefund,
} = require('../middleware/validation');

/**
 * @route   POST /api/payments/intent
 * @desc    Create a new payment intent
 * @access  Public
 */
router.post('/intent', validateCreatePaymentIntent, paymentController.createPaymentIntent.bind(paymentController));

/**
 * @route   GET /api/payments/intent/:id
 * @desc    Get payment intent details
 * @access  Public
 */
router.get('/intent/:id', paymentController.getPaymentIntent.bind(paymentController));

/**
 * @route   POST /api/payments/confirm
 * @desc    Confirm a payment intent
 * @access  Public
 */
router.post('/confirm', validateConfirmPayment, paymentController.confirmPayment.bind(paymentController));

/**
 * @route   POST /api/payments/refund
 * @desc    Create a refund for a payment
 * @access  Public
 */
router.post('/refund', validateRefund, paymentController.createRefund.bind(paymentController));

/**
 * @route   GET /api/payments/intents
 * @desc    List payment intents
 * @access  Public
 */
router.get('/intents', paymentController.listPaymentIntents.bind(paymentController));

module.exports = router;
