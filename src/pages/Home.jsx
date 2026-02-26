import { Link } from 'react-router-dom';
import React from "react";
import { useNavigate } from 'react-router-dom';
import Sponsors from '../components/sponsors';
export default function LandingPage() {

      const navigate = useNavigate();

    const getTarget = () => {
    try {
      if (typeof window !== 'undefined' && window.CONTEST_END) {
        const d = new Date(window.CONTEST_END);
        if (!isNaN(d)) return d;
      }
    } catch {}
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  };

  const calc = (end) => {
    const now = new Date();
    const diff = Math.max(0, end - now);
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);
    return { days, hours, minutes, seconds };
  };

  
  const [endTime] = React.useState(getTarget);
  const [timeLeft, setTimeLeft] = React.useState(() => calc(endTime));

  React.useEffect(() => {
    const id = setInterval(() => setTimeLeft(calc(endTime)), 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return (
    <section className="home">
      {/* Hero with CTA */}
      <section className="hero pad-y">
        <img src="/scratchwin/images/hero.png" className="hero-img" alt="Hero" />
<button 
        className="hero-button hero-play-btn" 
        onClick={() => navigate('/login')}
      >
        Play Now!
      </button>      </section>

      {/* Who are we */}
<section class="about-us">
  <div class="bg-watermark">BUYMORE DOLLARS BUYMORE DOLLARS</div>
  
  <h2 class="comic-title">About Us</h2>
  
  <div class="info-grid">
    <div class="info-card">
      <h3>Who?</h3>
      <p>We are a virtual currency designed to make shopping and everyday spending fun and rewarding and a little unpredictable BUT in the best way!</p>
    </div>
    
    <div class="info-card">
      <h3>What?</h3>
      <p>Our mission is simple, connect you guys with promotions that are actually fun, and discounts that make you feel like a VIP!</p>
    </div>
    
    <div class="info-card">
      <h3>How?</h3>
      <p>Whether it's scratch to win, spin to win, match to win, or surprise rewards, we transform everyday purchases into moments of excitement.</p>
    </div>

    <div class="info-card">
      <h3>Why?</h3>
      <p>We're about making spending something you look forward to, a little boost of fun in your day where rewards and experiences meet.</p>
    </div>
  </div>
</section>

      {/* Feature block with bars, image, and copy */}
 <Sponsors />

      {/* Free entry banner */}
<div className="ticker-wrapper">
      <div className="ticker-content">
        <span>FREE ENTRY • PLAY EVERY 72 HOURS • NO PURCHASE NECESSARY • FREE ENTRY • PLAY EVERY 72 HOURS • NO PURCHASE NECESSARY • FREE ENTRY • PLAY EVERY 72 HOURS • NO PURCHASE NECESSARY • </span>
        <span>FREE ENTRY • PLAY EVERY 72 HOURS • NO PURCHASE NECESSARY • FREE ENTRY • PLAY EVERY 72 HOURS • NO PURCHASE NECESSARY • FREE ENTRY • PLAY EVERY 72 HOURS • NO PURCHASE NECESSARY • </span>
      </div>
    </div>


    <section className="steps-section">
      <h2 className="sponsors-heading win-title">
        IT'S <span className="highlight">EASY</span> TO WIN
      </h2>
      
      <div className="steps-container">
        {/* STEP 1 */}
        <div className="step-card step-cyan">
          <div className="step-number">1</div>
          <h3>SIGN UP</h3>
          <p>Create your BuyMore account in seconds. It's 100% free, no purchase necessary!</p>
        </div>

        {/* STEP 2 */}
        <div className="step-card step-pink">
          <div className="step-number">2</div>
          <h3>SCRATCH</h3>
          <p>Scratch away at your card and reveal your prize. Yes, it is that easy!</p>
        </div>

        {/* STEP 3 */}
        <div className="step-card step-yellow">
          <div className="step-number">3</div>
          <h3>WIN!</h3>
          <p>Claim your amazing prize after answering a quick question!</p>
        </div>
      </div>

      <div className="steps-cta-wrapper">
        <button className="steps-cta-button">
          PLAY NOW ➔
        </button>
      </div>
    </section>

      {/* Prizes */}
<section className="prize-stack-section">
  <div className="container">
    <h2 className="sponsors-heading prize-main-title">
      THE <span className="highlight">PRIZES</span>
    </h2>

    <div className="ticket-stack">
      {/* 10,000 - THE GOLDEN TICKET */}
      <div className="ticket-item ticket-yellow">
        <div className="ticket-left">
          <span className="ticket-qty">ONLY 1</span>
        </div>
        <div className="ticket-center">
          <h3 className="ticket-amount">10,000</h3>
          <p className="ticket-label">BuyMore Dollars</p>
        </div>
        <div className="ticket-right">
          <span className="ticket-tag">GRAND PRIZE</span>
        </div>
      </div>

      {/* 750 - CYAN TICKET */}
      <div className="ticket-item ticket-cyan">
        <div className="ticket-left">
          <span className="ticket-qty">5 WINNERS</span>
        </div>
        <div className="ticket-center">
          <h3 className="ticket-amount">750</h3>
          <p className="ticket-label">BuyMore Dollars</p>
        </div>
        <div className="ticket-right">
        </div>
      </div>

      {/* 100 - CYAN TICKET */}
      <div className="ticket-item ticket-cyan">
        <div className="ticket-left">
          <span className="ticket-qty">10 WINNERS</span>
        </div>
        <div className="ticket-center">
          <h3 className="ticket-amount">100</h3>
          <p className="ticket-label">BuyMore Dollars</p>
        </div>
        <div className="ticket-right">
        </div>
      </div>

      {/* 20 - CYAN TICKET */}
      <div className="ticket-item ticket-cyan">
        <div className="ticket-left">
          <span className="ticket-qty">100 WINNERS</span>
        </div>
        <div className="ticket-center">
          <h3 className="ticket-amount">20</h3>
          <p className="ticket-label">BuyMore Dollars</p>
        </div>
        <div className="ticket-right">
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Countdown */}
<section className="countdown-section">
  <div className="container">
    {/* Title follows the "WTF" style: Slanted and Outlined */}
    <h2 className="countdown-title">
      HURRY! <span className="highlight-cyan">CONTEST ENDS IN</span>
    </h2>

    <div className="timer-container">
      <div className="timer-pill">
        <span className="time-val">{timeLeft.days}</span>
        <span className="time-label">DAYS</span>
      </div>

      <div className="timer-separator">:</div>

      <div className="timer-pill">
        <span className="time-val">{String(timeLeft.hours).padStart(2,'0')}</span>
        <span className="time-label">HRS</span>
      </div>

      <div className="timer-separator">:</div>

      <div className="timer-pill">
        <span className="time-val">{String(timeLeft.minutes).padStart(2,'0')}</span>
        <span className="time-label">MINS</span>
      </div>

      <div className="timer-separator">:</div>

      <div className="timer-pill pink-pill">
        <span className="time-val">{String(timeLeft.seconds).padStart(2,'0')}</span>
        <span className="time-label">SECS</span>
      </div>

      
    </div>
<div className="cta-wrapper">
  <button className="main-cta-btn">
 LET'S GO!
  </button>
</div>
  </div>
</section>

    </section>
  );
}



