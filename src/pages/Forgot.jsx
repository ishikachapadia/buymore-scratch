import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Forgot() {
	const [email, setEmail] = useState('');
	const [msg, setMsg] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleReset = async (e) => {
		e.preventDefault();
		setMsg('');
		setError('');
		if (!email) {
			setError('Please enter your email address.');
			return;
		}
		try {
			await sendPasswordResetEmail(auth, email);
			setMsg('Password reset email sent! Check your inbox.');
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<section className="login-page forgot-bg">
			<div className="login-box forgot-box">
				<div className="login-box2">
				<h2 className="register-title forgot-title">Reset Your Password</h2>
				<p className="login-subtitle forgot-subtitle">Enter your email address and we'll send you a reset link.</p>
				<form className="register-form" onSubmit={handleReset} noValidate>
					<article className="form-group">
						<label className="login-label">Email Address</label>
						<input
							type="email"
							className={`login-input${error ? ' error' : ''}`}
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						{error && <span className="error-text">{error}</span>}
					</article>
					<button type="submit" className="login-btn forgot-btn">Send Reset Link</button>
					{msg && <span className="forgot-success">{msg}</span>}
				</form>
				<div className="login-signup forgot-link">Remembered your password? <a onClick={() => navigate('/login')}>Log in here.</a></div>
				</div>
			</div>
		</section>
	);
}
