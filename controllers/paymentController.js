const stripeService = require('../services/stripeService');

class PaymentController {
  /**
   * Create a new payment intent
   * POST /api/payments/intent
   */
  async createPaymentIntent(req, res, next) {
    try {
      const { amount, currency, description, metadata } = req.body;

      const paymentIntent = await stripeService.createPaymentIntent({
        amount,
        currency,
        description,
        metadata,
      });

      res.status(201).json({
        success: true,
        data: paymentIntent,
        message: 'Payment intent created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Confirm a payment intent
   * POST /api/payments/confirm
   */
  async confirmPayment(req, res, next) {
    try {
      const { paymentIntentId } = req.body;

      const paymentIntent = await stripeService.confirmPaymentIntent(paymentIntentId);

      res.json({
        success: true,
        data: paymentIntent,
        message: 'Payment confirmed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment intent details
   * GET /api/payments/intent/:id
   */
  async getPaymentIntent(req, res, next) {
    try {
      const { id } = req.params;

      const paymentIntent = await stripeService.getPaymentIntent(id);

      res.json({
        success: true,
        data: paymentIntent,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a refund
   * POST /api/payments/refund
   */
  async createRefund(req, res, next) {
    try {
      const { paymentIntentId, amount } = req.body;

      const refund = await stripeService.createRefund(paymentIntentId, amount);

      res.status(201).json({
        success: true,
        data: refund,
        message: amount 
          ? `Refund of ${amount} ${refund.currency} processed successfully`
          : 'Full refund processed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List payment intents
   * GET /api/payments/intents
   */
  async listPaymentIntents(req, res, next) {
    try {
      const { limit = 10, starting_after } = req.query;

      const paymentIntents = await stripeService.listPaymentIntents({
        limit: parseInt(limit),
        starting_after,
      });

      res.json({
        success: true,
        data: paymentIntents,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
