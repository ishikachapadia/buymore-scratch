import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";
import { getUserCooldown, setUserCooldown } from "../firebase/cooldown";

const OUTCOME_KEY = "bm_outcome";
const COOLDOWN_MS = 72 * 60 * 60 * 1000; // 72 hours (3 days)
const TEST_MODE = false; // set to true only when testing locally

// Random outcome logic
function pickOutcomeClientSide() {
  const r = Math.random();
  if (r < 0.60) return { type: "lose", prize: 0 }; // 60% lose
  if (r < 0.80) return { type: "win", prize: 20 }; // 20% win $20
  if (r < 0.93) return { type: "win", prize: 100 }; // 13% win $100
  if (r < 0.98) return { type: "win", prize: 750 }; // 5% win $750
  return { type: "win", prize: 10000 }; // 2% win $10,000
}

// Helper to format remaining time
function formatHMS(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function Contest() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const user = useCurrentUser();

  const [isScratching, setIsScratching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [locked, setLocked] = useState(false);
  const [remaining, setRemaining] = useState(0);

  // Firestore & Local Cooldown logic
  useEffect(() => {
    if (TEST_MODE) {
      setLocked(false);
      setRemaining(0);
      return;
    }

    let interval;
    async function checkCooldown() {
      if (!user) return;
      
      // Get last play timestamp from Firestore
      const last = await getUserCooldown(user.uid);
      const diff = Date.now() - last;
      
      const isStillLocked = diff < COOLDOWN_MS;
      setLocked(isStillLocked);
      setRemaining(Math.max(0, COOLDOWN_MS - diff));
    }

    checkCooldown();
    interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [user]);

  // Canvas Initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const w = 340;
    const h = 210;

    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Initial Scratch Cover
    ctx.fillStyle = "rgba(180,180,180,0.95)";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.font = "700 18px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH HERE", w / 2, h / 2);

    setProgress(0);
    setDone(false);
    setIsScratching(false);
  }, [locked]); // Re-init if it unlocks

  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const scratchAt = async (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || done) return;
    const ctx = canvas.getContext("2d");

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.globalCompositeOperation = "source-over";

    // Progress calculation
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    let total = 0;
    const step = Math.max(12, Math.floor((window.devicePixelRatio || 1) * 18));
    
    for (let y2 = 0; y2 < canvas.height; y2 += step) {
      for (let x2 = 0; x2 < canvas.width; x2 += step) {
        const idx = (y2 * canvas.width + x2) * 4;
        const a = img[idx + 3];
        total++;
        if (a < 50) cleared++;
      }
    }

    const pct = Math.round((cleared / total) * 100);
    setProgress(pct);

    // Finish logic
    if (pct >= 55 && !done) {
      setDone(true);
      setIsScratching(false);

      const outcome = pickOutcomeClientSide();
      
      if (!TEST_MODE && user) {
        await setUserCooldown(user.uid, Date.now());
      }

      localStorage.setItem(OUTCOME_KEY, JSON.stringify(outcome));
      
      setTimeout(() => {
        if (outcome.type === "win") navigate("/result");
        else navigate("/lose");
      }, 200);
    }
  };

  // Event Handlers
  const handleDown = (e) => {
    if (locked || done) return;
    setIsScratching(true);
    const p = getPos(e);
    scratchAt(p.x, p.y);
  };

  const handleMove = (e) => {
    if (locked || done) return;
    if (e.cancelable) e.preventDefault();
    const p = getPos(e);
    scratchAt(p.x, p.y);
  };

  const handleEnd = () => setIsScratching(false);

  return (
    <div className="contest-page">
      <div className="contest-banner">
        <div className="ticket-band">
          <div className="ticket-cell">A chance to win</div>
          <div className="ticket-prize">
            <div className="amount">10,000</div>
            <div className="label">BUYMORE DOLLARS</div>
          </div>
          <div className="ticket-cell">Grand Prize</div>
        </div>
      </div>

      <div className="contest-grid">
        <aside className="howto">
          <div className="howto-head">How to Play</div>
          <p className="howto-text">
            You scratch a card and either earn a prize or lose, after which you
            have to wait according to your countdown to play again.
          </p>
        </aside>

        <div className="scratch-card">
          <div className="card-frame">
            <div className="card-head">BuyMore Dollars Inc</div>
            <div className="card-title">
              <span className="super">SUPER</span>
              <span className="prize">PRIZE</span>
              <span className="burst">10000<br/>BMD</span>
            </div>

            {locked ? (
              <div className="lock-box">
                <div className="lock-title">Already Played</div>
                <div className="lock-timer">{formatHMS(remaining)}</div>
              </div>
            ) : (
              <div className="scratch-area">
                <div className="progress">Scratch progress: {progress}%</div>
                <div className="canvas-wrap">
                  <canvas
                    ref={canvasRef}
                    className="canvas"
                    onMouseEnter={handleDown}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={handleDown}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}