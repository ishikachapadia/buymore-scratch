import { Link } from 'react-router-dom';

export default function Footer() {

  return (
    <footer className="site-footer">
      <div className="footer-content">
        
        <div className="footer-column brand-info">
          <h3>L'Éclat Co.</h3>
          <p>&copy; 2025 L'Éclat Co.</p>
          <div className="social-links">

            <a href="#facebook" aria-label="Facebook">Facebook</a>
            <a href="#instagram" aria-label="Instagram">Instagram</a>
            <a href="#tiktok" aria-label="TikTok">Tiktok</a>
          </div>
        </div>

        <div className="footer-column navigation">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">Shop All</Link>
          <Link to="/cart">My Cart</Link>
        </div>

        <div className="footer-column service">
          <h4>Help & Contact</h4>
          <a href="#faq">FAQ</a>
          <a href="#returns">Returns & Exchanges</a>
          <a href="#contact">Contact Us</a>
        </div>
        
        <div className="footer-column newsletter-signup">
          <h4>Stay Radiant!</h4>
          <p>Subscribe for exclusive deals and new product launches.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your Email Address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
        
      </div>
    </footer>
  );
}