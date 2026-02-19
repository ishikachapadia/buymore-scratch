import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contest() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Initialize Foil
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some "scratchable" texture
    ctx.fillStyle = '#A0A0A0';
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    const scratch = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
      
      // Calculate how much is gone
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let count = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) count++;
      }
      const p = Math.round((count / (pixels.length / 4)) * 100);
      setPercentage(p);
    };

    const handleMouseMove = (e) => {
      if (e.buttons === 1) scratch(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    };

    // Attach directly to the element
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Trigger Navigation
  useEffect(() => {
    if (percentage >= 50 && !isFinished) {
      setIsFinished(true);
      // Determine win/loss - this usually comes from the form state/backend
      const win = Math.random() < 0.2; 
      
      setTimeout(() => {
        navigate(win ? '/win' : '/lose');
      }, 500);
    }
  }, [percentage, isFinished, navigate]);

  return (
    <div className="contest-page">
      {/* <h1 className="brand-logo">BUYMORE<span className="cyan-text">$</span></h1>
      <div className="status-tag">SCRATCHED: {percentage}%</div>

      <div className="scratch-card-container">
        <div className="prize-hidden-layer">
          <h2 className="revealing-msg">REVEALING...</h2>
        </div>

        <canvas 
          ref={canvasRef} 
          width={350} 
          height={450} 
          className={`scratch-canvas ${isFinished ? 'fade-out' : ''}`}
          style={{ touchAction: 'none' }} 
        />
      </div> */}
    </div>
  );
}