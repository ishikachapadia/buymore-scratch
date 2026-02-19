import { useState } from 'react';

export default function WinPage() {
  const [answer, setAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const checkMath = (e) => {
    e.preventDefault();
    if (parseInt(answer) === 40) { // Simple Math: 15 + 25
      setIsVerified(true);
    } else {
      alert("WRONG! Try the math again.");
    }
  };

  return (
    <div className="result-page win-theme">
      <div className="container">
        {!isVerified ? (
          <div className="skill-test">
            <h1 className="result-title">HOLD UP! YOU WON!</h1>
            <p>Solve this skill-testing question to claim your BuyMore Dollars:</p>
            <form onSubmit={checkMath} className="math-form">
              <label>15 + 25 = ?</label>
              <input 
                type="number" 
                value={answer} 
                onChange={(e) => setAnswer(e.target.value)} 
                placeholder="YOUR ANSWER"
                required 
              />
              <button type="submit" className="claim-btn">VERIFY WIN</button>
            </form>
          </div>
        ) : (
          <div className="win-confirmation">
            <h1 className="result-title">BOOM! CLAIMED.</h1>
            <div className="win-box">
              <p>CONGRATULATIONS ON YOUR WIN!</p>
              <p className="delivery-info">
                Your BuyMore Dollars will be added to your account 
                between <strong>6 to 8 weeks</strong> from now.
              </p>
            </div>
            <button onClick={() => window.location.href='/'} className="back-btn">EXIT</button>
          </div>
        )}
      </div>
    </div>
  );
}