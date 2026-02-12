import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contest() {
  const navigate = useNavigate();
  useEffect(() => {
    const greetName = localStorage.getItem('greetName');
    if (!greetName) {
      navigate('/login');
    }
  }, [navigate]);
  return (
    <div className="landing-page">
      <section className="hero-section">
        <p>WE ARE WORKING ON IT!!!!</p>
        <div className="hero-text"></div>
      </section>
    </div>
  );
}
