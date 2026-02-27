import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LAST_PLAY_KEY = "bm_last_play_ts";
const COOLDOWN_MS = 72 * 60 * 60 * 1000; // 72 hours (match Contest page)

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

export default function LosePage() {
  const navigate = useNavigate();
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const tick = () => {
      const last = Number(localStorage.getItem(LAST_PLAY_KEY) || "0");
      const diff = Date.now() - last;
      const remaining = Math.max(0, COOLDOWN_MS - diff);
      setLeft(remaining);
    };

    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const time = formatDHMS(left);

  const goBack = () => {
navigate("/");
  };

  return (
    <div className="lose-page">
      {/* Pink loss card */}
      <div className="lose-card">
        <h1 className="lose-title">Aw, better luck next time..</h1>
        <p className="lose-message">
          It's not over yet, you can try again. But you will miss out on getting life-changing prizes, if you didn't play again soon.
        </p>
      </div>

      {/* Thanks heading */}
      <h2 className="lose-thanks">BUT DON'T LEAVE EMPTY HANDED!</h2>

      {/* Coupon image */}
      <div className="lose-coupon">
<img src="/scratchwin/images/coupon.png" alt="Better luck next time coupon"  />
      </div>

      {/* Countdown */}
      <h2 className="lose-comeback">COME BACK IN</h2>

      <div className="lose-timer">
        <div className="timer-box">{time.days}</div>
        <div className="timer-sep">:</div>
        <div className="timer-box">{pad(time.hours)}</div>
        <div className="timer-sep">:</div>
        <div className="timer-box">{pad(time.mins)}</div>
        <div className="timer-sep">:</div>
        <div className="timer-box timer-box-last">{pad(time.secs)}</div>
      </div>

      {/* Go Back button */}
      <button className="lose-back-btn" onClick={goBack}>
        GO BACK TO HOME
      </button>
    </div>
  );
}