import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";
import { getUserCooldown, setUserCooldown } from "../firebase/cooldown";

const LAST_PLAY_KEY = "bm_last_play_ts";
const OUTCOME_KEY = "bm_outcome";
const COOLDOWN_MS = 72 * 60 * 60 * 1000; // 72 hours
const TEST_MODE = false; // set to true only when testing locally

// Random outcome with tiered prizes (1=highest prob, 5=lowest)
function pickOutcomeClientSide() {
  // Probabilities: lose 60%, 20=20%, 100=10%, 750=5%, 10000=5%
  const r = Math.random();
  if (r < 0.60) return { type: "lose", prize: 0 };
  if (r < 0.80) return { type: "win", prize: 20 };
  if (r < 0.90) return { type: "win", prize: 100 };
  if (r < 0.95) return { type: "win", prize: 750 };
  return { type: "win", prize: 10000 };
}

const PrizeCoins = () => {
  // Array of your 4 PNG paths
  const coinImages = [
    "/scratchwin/images/10000.png",
    "/scratchwin/images/750.png",
    "/scratchwin/images/100.png",
    "/scratchwin/images/20.png"
  ];

  // Create 15-20 coins with random properties
  const [coins] = useState(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // random horizontal start
      delay: Math.random() * 5,  // staggered start
      duration: 6 + Math.random() * 4, // different speeds
      img: coinImages[Math.floor(Math.random() * coinImages.length)],
      size: 30 + Math.random() * 30 // varying sizes
    }))
  );

  return (
    <div className="prize-coins-container">
      {coins.map((c) => (
        <img
          key={c.id}
          src={c.img}
          className="floating-coin"
          style={{
            left: `${c.left}%`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            width: `${c.size}px`,
            height: 'auto'
          }}
          alt=""
        />
      ))}
    </div>
  );
};

function getLastPlay() {
  return Number(localStorage.getItem(LAST_PLAY_KEY) || "0");
}

function canPlayNow() {
  const last = getLastPlay();
  if (!last) return true;
  return Date.now() - last >= COOLDOWN_MS;
}

function msRemaining() {
  const last = getLastPlay();
  if (!last) return 0;
  return Math.max(0, COOLDOWN_MS - (Date.now() - last));
}

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
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("bm_active_tab") || "howto");

  useEffect(() => {
    localStorage.setItem("bm_active_tab", activeTab);
  }, [activeTab]);

  const [isScratching, setIsScratching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const [locked, setLocked] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [outcome, setOutcome] = useState(null);

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

  // Determine outcome and prepare image
  useEffect(() => {
    if (locked) return;
    // Always generate a new outcome for each play (ignore localStorage)
    const newOutcome = pickOutcomeClientSide();
    setOutcome(newOutcome);
  }, [locked]);

  // Initialize canvas with gray scratch layer only
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const w = 392;
    const h = 300;

    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawScratchLayer(ctx, w, h);

    setProgress(0);
    setDone(false);
    setIsScratching(false);
  }, [activeTab]);

  function drawScratchLayer(ctx, w, h) {
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, "#d0d0d0");
    gradient.addColorStop(0.5, "#e8e8e8");
    gradient.addColorStop(1, "#c0c0c0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.font = "700 16px 'Nunito', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH HERE", w / 2, h / 2);
  }

  const lastScratchRef = useRef({ x: 0, y: 0 });
  const lastScratchTimeRef = useRef(0);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const scratchAt = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.globalCompositeOperation = "source-over";

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

    if (pct >= 60 && !done) {
      setDone(true);
      setIsScratching(false);

      // Use the current outcome state, not a new random one
      localStorage.setItem(LAST_PLAY_KEY, String(Date.now()));
      localStorage.setItem(OUTCOME_KEY, JSON.stringify(outcome));

      // Set cooldown in Firestore
      if (!TEST_MODE && user) {
        setUserCooldown(user.uid, Date.now());
      }

      setTimeout(() => {
        if (outcome && outcome.type === "win") navigate("/result");
        else navigate("/lose");
      }, 200);
    }
  };

  const onDown = (e) => {
    if (locked || done) return;
    if (e.cancelable) e.preventDefault();
    setIsScratching(true);
    const p = getPos(e);
    lastScratchRef.current = { x: p.x, y: p.y };
    lastScratchTimeRef.current = Date.now();
    scratchAt(p.x, p.y);
  };

  const onMove = (e) => {
    if (locked || done) return;
    if (e.cancelable) e.preventDefault();
    const p = getPos(e);
    scratchAt(p.x, p.y);
  };

  // Touch events still need the hold-and-drag behavior
  const onTouchStart = (e) => {
    if (locked || done) return;
    if (e.cancelable) e.preventDefault();
    setIsScratching(true);
    const p = getPos(e);
    scratchAt(p.x, p.y);
  };

  const onTouchMove = (e) => {
    if (locked || done) return;
    if (!isScratching) return;
    if (e.cancelable) e.preventDefault();
    const p = getPos(e);
    scratchAt(p.x, p.y);
  };

  const onTouchEnd = () => setIsScratching(false);

  // Floating Prize Coins Animation Component

  return (
    <div className="contest-page">
      <PrizeCoins />
      {/* Tabbed content area */}
      <div className="contest-tabs-container">
        {/* Vertical tabs on the left */}
        <div className="contest-tabs">
          <button
            className={`contest-tab ${activeTab === "howto" ? "active" : ""}`}
            onClick={() => setActiveTab("howto")}
          >
            How to Play
          </button>
          <button
            className={`contest-tab ${activeTab === "scratch" ? "active" : ""}`}
            onClick={() => setActiveTab("scratch")}
          >
            Scratch Card
          </button>
        </div>

        {/* Content area */}
        <div className="contest-tab-content">
          {activeTab === "howto" ? (
<div className="howto-panel">
      <div className="howto-head">How to play?</div>
      
      <div className="howto-steps-grid">
        <div className="howto-step-card step-cyan">
          <div className="step-number">1</div>
          <p>Scratch the card to reveal your result.</p>
        </div>
        
        <div className="howto-step-card step-pink">
          <div className="step-number">2</div>
          <p>Win? Fill the form & answer the math question!</p>
        </div>
        
        <div className="howto-step-card step-yellow">
          <div className="step-number">3</div>
          <p>Get your BuyMore Dollars in 6-8 weeks.</p>
        </div>
        
        <div className="howto-step-card step-green">
          <div className="step-number">4</div>
          <p>Play again every 72 hours!</p>
        </div>
      </div>

      <div className="howto-actions">
        <button
          className="bm-btn start-scratch-btn"
          onClick={() => setActiveTab("scratch")}
        >
          START SCRATCHING →
        </button>
        <Link to="/legal" className="legal-link">
          VIEW RULES & REGULATIONS
        </Link>
      </div>
    </div>
          ) : (
            <div className="scratch-panel">
              <div className="card-frame-image">
                <img
                  src={
                    locked
                      ? "/scratchwin/images/scratch-default.png"
                      : outcome && outcome.prize === 0
                        ? "/scratchwin/images/scratch-lose.png"
                        : outcome && outcome.prize === 20
                          ? "/scratchwin/images/scratch-20.png"
                          : outcome && outcome.prize === 100
                            ? "/scratchwin/images/scratch-100.png"
                            : outcome && outcome.prize === 750
                              ? "/scratchwin/images/scratch-750.png"
                              : outcome && outcome.prize === 10000
                                ? "/scratchwin/images/scratch-10000.png"
                                : "/scratchwin/images/scratch-lose.png"
                  }
                  alt="Scratch Card"
                  className="card-bg-image"
                />

                {locked && (
                  <div className="lock-box-overlay">
                    <div className="lock-title">Come back in</div>
                    <div className="lock-timer">{formatHMS(remaining)}</div>
                  </div>
                )}

                {!locked && (
                  <div className="scratch-area-overlay">
                    <div className="progress">Scratch progress: {progress}%</div>
                    <div className="canvas-wrap">
                      <canvas
                        ref={canvasRef}
                        className="canvas"
                        onMouseDown={onDown}
                        onMouseMove={onMove}
                        onMouseUp={() => setIsScratching(false)}
                        onMouseLeave={() => setIsScratching(false)}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}