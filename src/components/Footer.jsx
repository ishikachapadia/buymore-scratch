import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* SPONSOR SECTION */}
      <div className="footer-sponsors">
        <span className="sponsor-label">OFFICIAL PARTNERS:</span>
        <div className="sponsor-logos">
          <span className="sponsor-name">GLORBOTRONIC BURGERS</span>
          <span className="sponsor-divider"> |</span>
          <span className="sponsor-name">TACO SUPERSTORE</span>
          <span className="sponsor-divider">|</span>
          <span className="sponsor-name">Fresh Kicks-o-matic Dispenso Booth</span>         
          <span className="sponsor-divider">|</span>
          <span className="sponsor-name">Raw-Cabbage-on-a-stick Hut</span>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-links">
          <div className="footer-col">
            <h4>LEGAL</h4>
            <Link to="/legal">Terms & Conditions</Link>
            <Link to="/legal">Privacy Policy</Link>
            <Link to="/legal">Content Rules</Link>
            <Link to="/legal">Data Usage</Link>
          </div>
          <div className="footer-col">
            <h4>SUPPORT</h4>
            <a href="#">About Us</a>
            <a href="#">Contact Us</a>
            <a href="#">Manage Account</a>
            <a href="#">Careers</a>
          </div>
          
          <div className="footer-col social-col">
            <h4>CONNECT WITH US!</h4>
            <div className="social-icons">
              <a href="#" className="social-icon">IG</a>
              <a href="#" className="social-icon">TK</a>
              <a href="#" className="social-icon">X</a>
              <a href="#" className="social-icon">YT</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">© 2026 Buy More Dollars Inc. // ALL RIGHTS RESERVED</div>
      </div>
    </footer>
  );
}