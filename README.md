# @billgangcom/frontend-lib

## Overview

`@billgangcom/frontend-lib` is a comprehensive library designed to streamline the integration and interaction with the Billgang e-commerce platform. This library provides an assortment of hooks, components, and utility functions to simplify tasks such as handling shopping carts, interacting with customers, managing reCaptcha, and fetching data related to products, orders, settings, etc.

## Installation

To install `@billgangcom/frontend-lib`, run:

```sh
npm install @billgangcom/frontend-lib
```

## Features

- **BillgangProvider**: Context provider for initializing the Billgang environment.
- **CustomerDashboard**: Pre-built dashboard component that integrates various customer-related functionalities.
- **ReCaptchaProvider & useReCaptcha**: Components and hooks for integrating Google reCaptcha.
- **useCart**: Hook for managing cart operations like adding/removing products, applying coupons, etc.
- **Methods for fetching data**: Utility methods for fetching settings, products, orders, announcements, etc.

## Usage

### Initial Setup

To get started, wrap your top-level component with the `BillgangProvider`. This ensures that the Billgang context is available throughout your application.

```jsx
import { BillgangProvider } from '@billgangcom/frontend-lib';

const shopDomain = 'my-shop-domain';
const shopId = 'my-shop-id';
const shopPassword = 'my-password';

function App() {
  return (
    <BillgangProvider
      shopDomain={shopDomain}
      shopId={shopId}
      shopPassword={shopPassword}
    >
      {/* Your application components go here */}
    </BillgangProvider>
  );
}
export default App;
```

### Customer Dashboard

You can use the pre-built `CustomerDashboard` component to quickly set up a customer interface:

```jsx
import { CustomerDashboard } from '@billgangcom/frontend-lib';

function App() {
  return (
    <BillgangProvider
      shopDomain={'my-shop-domain'}
      shopId={'my-shop-id'}
      shopPassword={''}
    >
      <CustomerDashboard />
    </BillgangProvider>
  );
}
export default App;
```

### ReCaptcha Integration

To integrate Google reCaptcha in your forms or components:

1. Wrap your component tree with the `ReCaptchaProvider`.
2. Use the `useReCaptcha` hook to interact with reCaptcha (e.g., executing the captcha challenge).

```jsx
import { ReCaptchaProvider, useReCaptcha } from '@billgangcom/frontend-lib';

const MyComponent = () => {
  const { executeRecaptcha } = useReCaptcha();

  const handleSubmit = async () => {
    const recaptchaToken = await executeRecaptcha();
    // Use recaptchaToken for further actions
  };

  return (
    <button onClick={handleSubmit}>Submit</button>
  );
};

function App() {
  return (
    <BillgangProvider
      shopDomain={'my-shop-domain'}
      shopId={'my-shop-id'}
      shopPassword={''}
    >
      <ReCaptchaProvider>
        <MyComponent />
      </ReCaptchaProvider>
    </BillgangProvider>
  );
}
export default App;
```

### Cart Management

The `useCart` hook simplifies managing cart operations like adding/removing products, applying coupons, etc.

```jsx
import { useCart } from '@billgangcom/frontend-lib';

const MyCartComponent = () => {
  const {
    cart,
    products,
    coupon,
    pending,
    addProductToCart,
    applyCoupon,
    getTotalAndDiscount,
    submitCart,
    reset,
    removeProduct,
    getPossibleGateways,
    setRecapcha,
    updateQuantityOfProduct,
    setPaymentMethod,
    setDiscordSocialConnectId,
    setCustomFields,
  } = useCart('customer-email@example.com');

  const handleAddProduct = async () => {
    if (!pending && products.length) {
      try {
        addProductToCart({
          productId: 100000098,
          productVariantId: 100000125,
          quantity: 1,
        });
        await applyCoupon('MY_COUPON');
        await submitCart();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <button onClick={handleAddProduct}>
      Add Product
    </button>
  );
};
```

### Fetching Data

Use the provided utility methods to fetch various types of data:

```jsx
import {
  fetchSettings,
  fetchProducts,
  fetchOrder,
  fetchAnnouncements,
} from '@billgangcom/frontend-lib/methods';

useEffect(() => {
  const fetchData = async () => {
    try {
      const [settings, products, order, announcements] = await Promise.all([
        fetchSettings(),
        fetchProducts(),
        fetchOrder('order_id'),
        fetchAnnouncements(),
      ]);
      console.log({ settings, products, order, announcements });
    } catch (error) {
      console.error(error);
    }
  };
  fetchData();
}, []);
```

## API Reference

### Components

#### BillgangProvider
Props:
- `shopDomain`: The domain of the shop.
- `shopId`: Unique identifier of the shop.
- `shopPassword?`: Optional password for the shop.

#### CustomerDashboard
Pre-built dashboard component that integrates various customer-related functionalities.

#### ReCaptchaProvider
Wraps components to provide reCaptcha functionality.

### Hooks

#### useCart(customerEmail: string)
Returns:
- **cart**: Current state of the shopping cart.
- **products**: Array of products available.
- **coupon**: Applied coupon details.
- **pending**: Boolean indicating if there are any pending operations.
- **getProducts(ids?)**: Function to fetch products, optionally filtered by IDs.
- **applyCoupon(coupon)**: Function to apply a coupon to the cart.
- **addProductToCart(cartItem)**: Function to add a product item to the cart.
- **getTotalAndDiscount()**: Function to get total price and discount details.
- **submitCart()**: Function to submit the current cart as an order.
- **reset()**: Function to reset the cart.
- **removeProduct(partOrder)**: Function to remove a product from the cart.
- **getPossibleGateways()**: Function to get available payment gateways for the current cart items.
- **setRecapcha(recaptcha)**: Function to set reCaptcha token for the cart.
- **updateQuantityOfProduct(cartItem)**: Function to update the quantity of a specific product in the cart.
- **setPaymentMethod(gateway)**: Function to set the payment method for the cart.
- **setDiscordSocialConnectId(discordSocialConnectId)**: Function to set Discord Social Connect ID for the cart.
- **setCustomFields(customFields)**: Function to set custom fields for the cart submission.

#### useReCaptcha()
Returns:
- An object with method `executeRecaptcha`.

### Methods

Utility methods for fetching data provided by `@billgangcom/frontend-lib/methods`:

- **fetchAnnouncements()**
  - Fetches announcements from the store.

- **fetchGatewaysDetail(gateways)**
  - Fetches details of specified payment gateways.

- **fetchListings(ids?)**
  - Fetches product listings, optionally filtered by IDs.

- **fetchMetadata(body)**
  - Fetches metadata based on specified parameters.

- **fetchOrder(orderId)**
  - Fetches order details by order ID.

- **fetchOrderWithToken(orderId, token)**
  - Fetches order details by order ID and token.

- **fetchPrivacyPolicy()**
  - Fetches privacy policy details from the store.

- **fetchProducts(ids?)**
  - Fetches product details, optionally filtered by IDs.

- **fetchRefundPolicy()**
  - Fetches refund policy details from the store.

- **fetchSettings()**
  - Fetches store settings.

- **fetchTerms()**
  - Fetches terms and conditions from the store.

- **postOrder(orderRequest)**
  - Submits a new order with specified order details.

- **validateCoupon(coupon)**
  - Validates a coupon for specified products and gateway.
