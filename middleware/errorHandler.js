const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Stripe errors
  if (err.type === 'StripeCardError') {
    return res.status(400).json({
      error: 'Card Error',
      message: err.message,
      code: err.code
    });
  }

  if (err.type === 'StripeInvalidRequestError') {
    return res.status(400).json({
      error: 'Invalid Request',
      message: err.message,
      param: err.param
    });
  }

  if (err.type === 'StripeAPIError') {
    return res.status(500).json({
      error: 'Payment Service Error',
      message: 'An error occurred with the payment service. Please try again later.'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.stack : 'An unexpected error occurred'
  });
};

module.exports = errorHandler;
