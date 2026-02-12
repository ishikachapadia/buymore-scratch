import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/contest');
        } catch (err) {
            setError('Invalid email or password.');
        }
    };

    return (
        <section className="login-page">
            <div className="login-box">
                <h1 className="login-title">HI, John!</h1>
                <p className="login-subtitle">Welcome back ! Ready to have a chance to win?</p>
                <form onSubmit={handleLogin} className="login-form">
                    <label className="login-label">Email Address</label>
                    <input type="email" className="login-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label className="login-label">Password</label>
                    <input type="password" className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="login-btn">Log in</button>
                    {error && <span className="error-text">{error}</span>}
                </form>
                <div className="login-signup">Don't have an account? <a onClick={() => navigate('/register')}>Sign up here.</a></div>
            </div>
        </section>
    );
}