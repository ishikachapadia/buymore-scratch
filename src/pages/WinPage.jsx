import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OUTCOME_KEY = "bm_outcome";
const LAST_PLAY_KEY = "bm_last_play_ts";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDHMS(ms) {
  const t = Math.max(0, ms);
  const days = Math.floor(t / (24 * 60 * 60 * 1000));
  const hours = Math.floor((t % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const mins = Math.floor((t % (60 * 60 * 1000)) / (60 * 1000));
  const secs = Math.floor((t % (60 * 1000)) / 1000);
  return { days, hours, mins, secs };
}

// Simple confetti component
function Confetti() {
  const pieces = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 3,
    // Using your brand colors: Cyan, Pink, Lime, Yellow, White
    color: ['#22cbd3', '#f21197', '#a8d823', '#ffda00', '#ffffff'][Math.floor(Math.random() * 5)],
    width: 8 + Math.random() * 12 + 'px',
    height: 5 + Math.random() * 10 + 'px',
    rotation: Math.random() * 360 + 'deg'
  }));

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left + '%',
            backgroundColor: p.color,
            width: p.width,
            height: p.height,
            animationDelay: p.delay + 's',
            animationDuration: p.duration + 's',
            transform: `rotate(${p.rotation})`
          }}
        />
      ))}
    </div>
  );
}



export default function WinPage() {
  const navigate = useNavigate();
  const [prize, setPrize] = useState(0);
  // const [isGrandPrize, setIsGrandPrize] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const [winTime, setWinTime] = useState(null);
  useEffect(() => {
    const raw = localStorage.getItem(OUTCOME_KEY);
    const last = localStorage.getItem(LAST_PLAY_KEY);
    if (!raw) {
      navigate("/contest");
      return;
    }
    try {
      const o = JSON.parse(raw);
      if (o.type !== "win") {
        navigate("/lose");
        return;
      }
      setPrize(o.prize || 0);
      // setIsGrandPrize(o.prize === 10000);
      if (last) setWinTime(new Date(Number(last)));
    } catch {
      navigate("/contest");
    }
  }, [navigate]);

  // Countdown timer
  return (
    <div className="win-page-final win-page-party">
      <Confetti />
      {/* The "Exploding" Header */}
      <div className="bm-result-title">SUCCESS!</div>

      <div className="bm-shell">
        {/* Prize Visual Section */}
        <div className="win-coin-card">
          <div className="win-badge">VERIFIED WINNER</div>
          <img
            src={
              prize === 20 ? "/scratchwin/images/20.png"
              : prize === 100 ? "/scratchwin/images/100.png"
              : prize === 750 ? "/scratchwin/images/750.png"
              : prize === 10000 ? "/scratchwin/images/10000.png"
              : ""
            }
            alt={`You won ${prize} BuyMore Dollars`}
            className="final-prize-img"
          />
        </div>

        {/* Message Section */}
        <div className="win-message-section">
          <h2 className="win-status-title">CONGRATULATIONS!</h2>
          <p className="win-congrats-text">
            Your skill-testing question was answered correctly. 
            Your <strong>BuyMore Dollars</strong> will be credited to your account within:
          </p>
          <div className="delivery-window">6 TO 8 WEEKS</div>
          {winTime && (
            <div className="win-timestamp">
              WIN DATE: {winTime.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          )}
        </div>

        {/* Final Navigation */}
        <button className="bm-btn win-play-btn" onClick={() => navigate("/")}>
          GO BACK TO HOME
        </button>
      </div>
    </div>

   

      

  );
}