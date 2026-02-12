import { Link } from 'react-router-dom';
export default function LandingPage() {
  return (
    <div className="landing-page">
      
      <section className="hero-section">
        <img 
            src="../public/img/hero.jpg" 
            className="hero-image"
        />
        <div className="hero-text">
        </div>
        
        <Link to="/products" className="shop-all-button">
            Shop Products
        </Link>
      </section>

      <section className="company-info">
        <h2>Our Promise to You</h2>
        <p>
            At L'eclat, we believe beauty should never come at the expense of our planet or animals. 
            We are dedicated to sustainable sourcing, cruelty-free ftesting, and crafting vegan formulas that deliver professional results right to your vanity.
        </p>
      </section>

      <section className="cta-deals">
        <h2>Limited Time Offers</h2>
        <div className="cta-grid">
            
            <div className="cta-item">
                <Link to="/special-deal-1">
                    <img src="../public/img/specialProduct1.png" alt="25% Off Lipstick Kit" />
                    <h4>Deal 1: 25% Off Foundation Purchase</h4>
                    <p>Shop Now →</p>
                </Link>
            </div>

            <div className="cta-item">
                <Link to="/special-deal-2">
                    <img src="../public/img/specialProduct2.png" alt="Free Primer with Foundation" />
                    <h4>Deal 2: Free serum with a purchase of $40</h4>
                    <p>Shop Now →</p>
                </Link>
            </div>

            <div className="cta-item">
                <Link to="/special-deal-3">
                    <img src="../public/img/specialProduct3.png" alt="Eyeshadow Palette Bundle" />
                    <h4>Deal 3: Lipgloss half off!</h4>
                    <p>Shop Now →</p>
                </Link>
            </div>
            
        </div>
      </section>

      <section className="brand-values">
        <h2>Why Choose L'eclat?</h2>
        
        <div className="values-grid">
          
          <div className="value-item">
            <h4>100% Vegan</h4>
            <p>No animal-derived ingredients, ever.</p>
          </div>
          
          <div className="value-item">
            <h4>Cruelty Free</h4>
            <p>Never tested on animals at any stage.</p>
          </div>
          
          <div className="value-item">
            <h4>Sustainable Packaging</h4>
            <p>Recyclable and ecoconscious materials.</p>
          </div>
          
          <div className="value-item">
            <h4>Amazing Quality</h4>
            <p>High performance formulas made for everyday wear.</p>
          </div>
          
        </div>
      </section>
    
    <section className="reviews">
  <h2>What Our Customers Are Saying</h2>

  <div className="reviews-grid">
    <div className="review-card">
      <p className="review-text">
        “The Velvet Lip Kit is hands down the best lipstick I've ever owned. 
        It lasts all day and feels amazing.”
      </p>
      <h4>— Maya R.</h4>
      <span className="stars">★★★★★</span>
    </div>

    <div className="review-card">
      <p className="review-text">
        “I love that L'eclat is cruelty-free and vegan without compromising on quality. 
        The foundation looks flawless.”
      </p>
      <h4>— Sophia L.</h4>
      <span className="stars">★★★★★</span>
    </div>

    <div className="review-card">
      <p className="review-text">
        “Beautiful packaging, incredible pigmentation, and fast shipping. 
        I'll definitely be ordering again.”
      </p>
      <h4>— Emma K.</h4>
      <span className="stars">★★★★☆</span>
    </div>
  </div>
</section>

    </div>
  );
}
