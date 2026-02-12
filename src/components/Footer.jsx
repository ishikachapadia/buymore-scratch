import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <div className="footer-col">
          <Link to="/legal">Terms & Conditions</Link>
          <Link to="/legal">Privacy Policy</Link>
          <Link to="/legal">Content Rules</Link>
          <Link to="/legal">Data Usage</Link>
        </div>
        <div className="footer-col">
          <a href="#">About Us</a>
          <a href="#">Contact Us</a>
          <a href="#">Manage Account</a>
          <a href="#">Careers</a>
        </div>
      </div>
      <div className="footer-copy">Buy More Dollars Inc. All Rights Reserved</div>
    </footer>
  );
}