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
    <div className="bm-shell">
    <h1 className="bm-title">Winner Verification</h1>

    <p className="bm-text">Answer the skill-testing question:</p>

    <div className="bm-q">
        {q.a} + {q.b} =
    </div>

    <form className="bm-form" onSubmit={onSubmit}>
        <input
        className="bm-input"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter answer"
        inputMode="numeric"
        />
        <button className="bm-btn" type="submit">
        Submit
        </button>
    </form>

    {msg && <div className={`bm-msg ${msg.includes('Wrong') ? 'bm-msg-error' : ''}`}>{msg}</div>}
    </div>
</div>
);
}