# Payment Processing Backend API

A robust backend API for processing payments using Stripe. This API provides endpoints for creating payment intents, confirming payments, handling refunds, and managing payment transactions.

## Features

- ✅ Create payment intents
- ✅ Confirm payments
- ✅ Retrieve payment details
- ✅ Process refunds (full or partial)
- ✅ List payment intents
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ CORS support
- ✅ Environment-based configuration

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Stripe account with API keys

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd payment-processing-backend-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Stripe API keys:
```env
PORT=3000
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Health Check
- **GET** `/health`
  - Check if the API is running
  - Response:
    ```json
    {
      "status": "ok",
      "message": "Payment API is running",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
    ```

### Create Payment Intent
- **POST** `/api/payments/intent`
  - Create a new payment intent
  - Request Body:
    ```json
    {
      "amount": 100.00,
      "currency": "USD",
      "description": "Payment for order #123",
      "metadata": {
        "orderId": "123",
        "userId": "456"
      }
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "clientSecret": "pi_xxx_secret_xxx",
        "paymentIntentId": "pi_xxx",
        "amount": 100.00,
        "currency": "USD",
        "status": "requires_payment_method"
      },
      "message": "Payment intent created successfully"
    }
    ```

### Get Payment Intent
- **GET** `/api/payments/intent/:id`
  - Retrieve payment intent details
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "id": "pi_xxx",
        "status": "succeeded",
        "amount": 100.00,
        "currency": "USD",
        "description": "Payment for order #123",
        "metadata": {},
        "created": 1234567890,
        "clientSecret": "pi_xxx_secret_xxx"
      }
    }
    ```

### Confirm Payment
- **POST** `/api/payments/confirm`
  - Confirm a payment intent
  - Request Body:
    ```json
    {
      "paymentIntentId": "pi_xxx"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "id": "pi_xxx",
        "status": "succeeded",
        "amount": 100.00,
        "currency": "USD",
        "created": 1234567890
      },
      "message": "Payment confirmed successfully"
    }
    ```

### Create Refund
- **POST** `/api/payments/refund`
  - Create a refund (full or partial)
  - Request Body (full refund):
    ```json
    {
      "paymentIntentId": "pi_xxx"
    }
    ```
  - Request Body (partial refund):
    ```json
    {
      "paymentIntentId": "pi_xxx",
      "amount": 50.00
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "id": "re_xxx",
        "amount": 50.00,
        "currency": "USD",
        "status": "succeeded",
        "paymentIntentId": "pi_xxx",
        "created": 1234567890
      },
      "message": "Refund of 50 USD processed successfully"
    }
    ```

### List Payment Intents
- **GET** `/api/payments/intents?limit=10&starting_after=pi_xxx`
  - List payment intents
  - Query Parameters:
    - `limit` (optional): Number of results (default: 10, max: 100)
    - `starting_after` (optional): Cursor for pagination
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "data": [
          {
            "id": "pi_xxx",
            "status": "succeeded",
            "amount": 100.00,
            "currency": "USD",
            "description": "Payment for order #123",
            "created": 1234567890
          }
        ],
        "hasMore": false
      }
    }
    ```

## Error Responses

All errors follow this format:
```json
{
  "error": "Error Type",
  "message": "Error message"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors, invalid input)
- `404` - Not Found
- `500` - Internal Server Error

## Example Usage

### Using cURL

Create a payment intent:
```bash
curl -X POST http://localhost:3000/api/payments/intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "currency": "USD",
    "description": "Test payment"
  }'
```

Confirm a payment:
```bash
curl -X POST http://localhost:3000/api/payments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "paymentIntentId": "pi_xxx"
  }'
```

### Using JavaScript (Fetch API)

```javascript
// Create payment intent
const response = await fetch('http://localhost:3000/api/payments/intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 100.00,
    currency: 'USD',
    description: 'Payment for order #123',
    metadata: {
      orderId: '123',
      userId: '456'
    }
  })
});

const data = await response.json();
console.log(data.data.clientSecret); // Use this with Stripe.js on frontend
```

## Frontend Integration

To integrate with a frontend application:

1. Install Stripe.js:
```bash
npm install @stripe/stripe-js
```

2. Use the `clientSecret` from the payment intent response:
```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe('pk_test_your_publishable_key');
const { error } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
  }
});
```

## Project Structure

```
payment-processing-backend-api/
├── controllers/
│   └── paymentController.js    # Payment request handlers
├── middleware/
│   ├── errorHandler.js         # Global error handler
│   └── validation.js           # Request validation
├── routes/
│   └── paymentRoutes.js        # Payment routes
├── services/
│   └── stripeService.js        # Stripe API integration
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore file
├── package.json                # Dependencies
├── README.md                   # This file
└── server.js                   # Express server setup
```

## Security Considerations

- ⚠️ **Never expose your Stripe secret key** - Keep it in `.env` and never commit it to version control
- Use HTTPS in production
- Implement authentication/authorization for production use
- Validate and sanitize all inputs
- Rate limiting recommended for production
- Monitor Stripe webhooks for payment status updates

## Testing

For testing, use Stripe's test mode with test API keys:
- Test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC
- Any ZIP code

## Support

For Stripe-related issues, refer to the [Stripe Documentation](https://stripe.com/docs).

## License

ISC
