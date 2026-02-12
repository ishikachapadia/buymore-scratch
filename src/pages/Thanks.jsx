import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function thanks() {
  const location = useLocation();
  const customerName = location.state?.customerName || 'Customer';

  return (
    <div className="thank-you-page">
      <h1>Thank You, {customerName}!</h1>
      <p>Your order has been received and is being processed.</p>
      <Link to="/" className="home-link-button">
        Continue Shopping
      </Link>
    </div>
  );
}
