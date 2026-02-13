import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Thanks() {
  const location = useLocation();
  const navigate = useNavigate();
  const customerName = location.state?.customerName || 'Customer';

  return (
    <main className="thank-you-page">
        <section className="thankyou-card">
          <div className="thankyou-card-inner">
          <img src="/scratchwin/images/thanks.png" alt="Success" className="thankyou-tick" />
          <h1 className="thankyou-title">Thank you, {customerName}!</h1>
          <p className="thankyou-desc">We appreciate the time you took in completing the form, now this is where the fun begins!</p>
          <button className="thankyou-btn" onClick={() => navigate('/')}>
            CONTINUE
          </button>
          </div>
        </section>
      </main>
  );
}
