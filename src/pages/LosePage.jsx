export default function LosePage() {
  return (
    <div className="result-page lose-theme">
      <div className="container">
        <h1 className="result-title">OOF... NOT THIS TIME.</h1>
        <p className="result-msg">PLEASE PLAY AGAIN IN 72 HOURS.</p>

        <div className="coupon-card">
          <div className="coupon-header">CONSOLATION PRIZE</div>
          <div className="coupon-body">
            <h3>$2.00 OFF</h3>
            <p>ANY PURCHASE OVER $50</p>
            <div className="shop-tag">RAW-CABBAGE-ON-A-STICK HUT</div>
          </div>
          <div className="coupon-code">CODE: CABBAGE26</div>
        </div>
        
        <button onClick={() => window.location.href='/'} className="back-btn">BACK TO HOME</button>
      </div>
    </div>
  );
}