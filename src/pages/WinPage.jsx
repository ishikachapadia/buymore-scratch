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
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)]
  }));

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundColor: p.color
          }}
        />
      ))}
    </div>
  );
}

export default function WinPage() {
  const navigate = useNavigate();
  const [prize, setPrize] = useState(0);
  const [isGrandPrize, setIsGrandPrize] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(OUTCOME_KEY);
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
      setIsGrandPrize(o.prize === 10000);
    } catch {
      navigate("/contest");
    }
  }, [navigate]);

  // Countdown timer
  useEffect(() => {
    const tick = () => {
      const last = Number(localStorage.getItem(LAST_PLAY_KEY) || "0");
      const diff = Date.now() - last;
      const remaining = Math.max(0, COOLDOWN_MS - diff);
      setTimeLeft(remaining);
    };

    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const time = formatDHMS(timeLeft);

  return (
    <div className={`win-page ${isGrandPrize ? 'win-page-party' : ''}`}>
      {isGrandPrize && <Confetti />}
      
      {/* Gold coin with prize */}
      <div className={`win-coin ${isGrandPrize ? 'win-coin-grand' : ''}`}>
        <div className="coin-inner">
          <div className="win-text">{isGrandPrize ? '🎉 GRAND PRIZE 🎉' : 'You just won'}</div>
          <div className="win-amount">${Number(prize).toLocaleString()}</div>
          {isGrandPrize && <div className="win-subtext">BUYMORE DOLLARS</div>}
        </div>
      </div>

      {/* Come back timer */}
      <div className="win-timer-section">
        <h3 className="win-timer-title">COME BACK IN</h3>
        <div className="win-timer">
          <div className="timer-box">{time.days}</div>
          <div className="timer-sep">:</div>
          <div className="timer-box">{pad(time.hours)}</div>
          <div className="timer-sep">:</div>
          <div className="timer-box">{pad(time.mins)}</div>
          <div className="timer-sep">:</div>
          <div className="timer-box timer-box-last">{pad(time.secs)}</div>
        </div>
      </div>

      {/* Play Again button */}
      <button className="win-play-btn" onClick={() => navigate("/contest")}>
        {isGrandPrize ? 'PLAY AGAIN 🎊' : 'Play Again'}
      </button>
    </div>
  );
}