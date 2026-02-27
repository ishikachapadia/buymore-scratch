import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const OUTCOME_KEY = "bm_outcome";

function randInt(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Result() {
const navigate = useNavigate();
const [answer, setAnswer] = useState("");
const [msg, setMsg] = useState("");
const [prize, setPrize] = useState(0);

const q = useMemo(() => {
    const a = randInt(3, 12);
    const b = randInt(3, 12);
    return { a, b, ans: a + b };
}, []);

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
    } catch {
        navigate("/contest");
    }
}, [navigate]);

const onSubmit = (e) => {
    e.preventDefault();
    const user = Number(answer);
    if (!Number.isFinite(user)) {
        setMsg("Enter a number.");
        return;
    }
    if (user !== q.ans) {
        setMsg("Wrong answer. Try again.");
        return;
    }
    navigate("/win");
};

return (
<div className="bm-page bm-result">
    {/* The Title is moved outside the shell to allow it to "explode" over the top */}
    <div className="bm-result-title">OH MY!</div>

    <div className="bm-shell">
        <div className="bm-result-prize-img">
            <div className="bm-result-subtitle">
                CONGRATULATIONS! LOOKS LIKE YOU WON 
                <span> {prize ? `$${Number(prize).toLocaleString()}` : ''} </span> 
                DOLLARS!
            </div>
            
            <img
                src={
                    prize === 20 ? "/scratchwin/images/20.png"
                    : prize === 100 ? "/scratchwin/images/100.png"
                    : prize === 750 ? "/scratchwin/images/750.png"
                    : prize === 10000 ? "/scratchwin/images/10000.png"
                    : ""
                }
                alt={`You won ${prize} BuyMore Dollars`}
                className="prize-display-image"
            />
        </div>

        <div className="bm-verification-card">
            <h1 className="bm-title">Winner Verification</h1>
            <div className="bm-result-instructions">
                To claim your prize, please answer the math question below correctly!
            </div>

            <div className="bm-q">
                {q.a} + {q.b} =
            </div>

            <form className="bm-form" onSubmit={onSubmit}>
                <input
                    className="bm-input"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="ENTER ANSWER"
                    inputMode="numeric"
                />
                <button className="bm-btn" type="submit">
                    SUBMIT & CLAIM 
                </button>
            </form>
        </div>

        {msg && (
            <div className={`bm-msg ${msg.includes('Wrong') ? 'bm-msg-error' : ''}`}>
                {msg}
            </div>
        )}
    </div>
</div>
);
}