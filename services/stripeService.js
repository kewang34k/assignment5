const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeService {
  /**
   * Create a payment intent
   * @param {Object} params - Payment intent parameters
   * @param {number} params.amount - Amount in cents
   * @param {string} params.currency - Currency code (e.g., 'usd')
   * @param {string} params.description - Payment description
   * @param {Object} params.metadata - Additional metadata
   * @returns {Promise<Object>} Payment intent object
   */
  async createPaymentIntent({ amount, currency = 'usd', description, metadata = {} }) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        description,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        status: paymentIntent.status,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Confirm a payment intent
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Confirmed payment intent
   */
  async confirmPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          created: paymentIntent.created,
        };
      }

      const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      
      return {
        id: confirmedIntent.id,
        status: confirmedIntent.status,
        amount: confirmedIntent.amount / 100,
        currency: confirmedIntent.currency.toUpperCase(),
        created: confirmedIntent.created,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieve a payment intent
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Payment intent details
   */
  async getPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        description: paymentIntent.description,
        metadata: paymentIntent.metadata,
        created: paymentIntent.created,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a refund
   * @param {string} paymentIntentId - Payment intent ID
   * @param {number} amount - Refund amount (optional, full refund if not provided)
   * @returns {Promise<Object>} Refund object
   */
  async createRefund(paymentIntentId, amount = null) {
    try {
      const refundParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundParams.amount = Math.round(amount * 100); // Convert to cents
      }

      const refund = await stripe.refunds.create(refundParams);

      return {
        id: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency.toUpperCase(),
        status: refund.status,
        paymentIntentId: refund.payment_intent,
        created: refund.created,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * List payment intents
   * @param {Object} options - Query options
   * @returns {Promise<Object>} List of payment intents
   */
  async listPaymentIntents(options = {}) {
    try {
      const { limit = 10, starting_after } = options;
      
      const paymentIntents = await stripe.paymentIntents.list({
        limit: Math.min(limit, 100),
        starting_after,
      });

      return {
        data: paymentIntents.data.map(intent => ({
          id: intent.id,
          status: intent.status,
          amount: intent.amount / 100,
          currency: intent.currency.toUpperCase(),
          description: intent.description,
          created: intent.created,
        })),
        hasMore: paymentIntents.has_more,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new StripeService();
