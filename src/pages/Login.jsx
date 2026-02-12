import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
    const navigate = useNavigate();
    const [fields, setFields] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        firebase: ''
    });
    const [userName, setUserName] = useState('');
    const [isRemembered, setIsRemembered] = useState(false);

    // ! We are storing greet name (first) in local storage to remember the user and display the appropriate message.
    useEffect(() => {
        const greetName = sessionStorage.getItem('loginGreetName');
        if (greetName) {
            setUserName(greetName);
            localStorage.setItem('greetName', greetName);
            sessionStorage.removeItem('loginGreetName');
            setIsRemembered(true);
            return;
        }
        const storedName = localStorage.getItem('greetName');
        if (storedName) {
            setUserName(storedName);
            setIsRemembered(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({
            email: '',
            password: '',
            firebase: ''
        });
        try {
            const userCredential = await signInWithEmailAndPassword(auth, fields.email, fields.password);
            let greet = userCredential.user.displayName;
            localStorage.setItem('greetName', greet);
            navigate('/contest');
        } catch (err) {
            setErrors({
                email: '',
                password: '',
                firebase: err.message
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('greetName');
        setUserName('');
        setIsRemembered(false);
    };

    // ! we are making it so that if the user is registered they will have a welcome back display and if not, a normal log in page that will lead you to registration
    return (
        <section className="login-page">
            <div className="login-box">
                {isRemembered ? (
                    <>
                        <h1 className="login-title">Hello, {userName}!</h1>
                        <p className="login-subtitle">Welcome back! You are already signed in.</p>
                        <button className="login-btn" onClick={handleLogout}>Log out</button>
                    </>
                ) : (
                    <>
                        <h1 className="login-title">HI!</h1>
                        <p className="login-subtitle">Welcome! Ready for a chance to win?</p>
                        <form onSubmit={handleLogin} className="login-form">
                            <label className="login-label">Email Address</label>
                            <input type="email" className="login-input" value={fields.email} onChange={(e) => setFields({...fields, email: e.target.value})} required />
                            <label className="login-label">Password</label>
                            <input type="password" className="login-input" value={fields.password} onChange={(e) => setFields({...fields, password: e.target.value})} required />
                            <button type="submit" className="login-btn">Log in</button>
                            <div className="login-forgot">
                                <a onClick={() => navigate('/forgot')}>Forgot your password?</a>
                            </div>
                            {errors.firebase && <span className="error-text">{errors.firebase}</span>}
                        </form>
                        <div className="login-signup">Don't have an account? <a onClick={() => navigate('/register')}>Sign up here.</a></div>
                    </>
                )}
            </div>
        </section>
    );
}