import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

function hasEmailCheck(value) {
    let pat2 = /^[a-zA-Z0-9_-]{2,}[.]?[a-zA-Z0-9_-]*[@]{1}[a-zA-Z0-9_-]{2,}[.]{1}(ca|com)$/;
    return pat2.test(value.trim());
}

function hasPasswordCheck(value) {
    let pat2 = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    return pat2.test(value);
}

function hasValueCheck(value) {
    return value.trim().length > 0;
}


export default function Login() {
    const navigate = useNavigate();
    const [fields, setFields] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '\u00A0',
        password: '\u00A0',
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
        setErrors(prev => ({ ...prev, firebase: '' }));
        if (!validateLogin()) return;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, fields.email, fields.password);
            let greet = userCredential.user.displayName;
            localStorage.setItem('greetName', greet);
            navigate('/contest');
        } catch (err) {
            setErrors(prev => ({ ...prev, firebase: err.message }));
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem('greetName');
        setUserName('');
        setIsRemembered(false);
        await signOut(auth);
        navigate('/login');
    };

    const validateLogin = () => {
        let newErrors = { ...errors };
        let valid = true;

        if (!hasValueCheck(fields.email)) {
            newErrors.email = 'Email address is required';
            valid = false;
        } else if (!hasEmailCheck(fields.email)) {
            newErrors.email = 'Please enter a valid email address';
            valid = false;
        } else {
            newErrors.email = '\u00A0';
        }

        if (!hasValueCheck(fields.password)) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (!hasPasswordCheck(fields.password)) {
            newErrors.password = 'Password must be at least 8 characters and have a capital letter and a symbol';
            valid = false;
        } else {
            newErrors.password = '\u00A0';
        }

        setErrors(newErrors);
        return valid;
    };

    // ! we are making it so that if the user is registered they will have a welcome back display and if not, a normal log in page that will lead you to registration
    return (
        <section className="login-page">
            <div className="login-box">
                <div className="login-box2">
                    {isRemembered ? (
                        <>
                            <h1 className="login-title">Hello, {userName}!</h1>
                            <p className="login-subtitle">Welcome back! You are already signed in.</p>
                            <button className="login-btn" onClick={handleLogout}>Log out</button>
                        </>
                    ) : (
                        <>
                        <div className="login-header">
                            <img src="/scratchwin/images/companyHead.png" className="login-company1"></img>
                            <img src="/scratchwin/images/ticketHead.png" className="login-company2"></img>
                            <img src="/scratchwin/images/companySub.png" className="login-company3"></img>


                        </div>
                            <form onSubmit={handleLogin} className="login-form" noValidate>
                                <label className="login-label">Email Address</label>
                                <input type="email" className={`login-input${errors.email !== '\u00A0' ? ' error' : ''}`} value={fields.email} onChange={(e) => setFields({...fields, email: e.target.value})} />
                                <span className="error-text">{errors.email}</span>

                                <label className="login-label">Password</label>
                                <input type="password" className={`login-input${errors.password !== '\u00A0' ? ' error' : ''}`} value={fields.password} onChange={(e) => setFields({...fields, password: e.target.value})} />
                                <span className="error-text">{errors.password}</span>

                                <button type="submit" className="login-btn">Log in</button>
                                <div className="login-forgot">
                                    <a onClick={() => navigate('/forgot')}>Forgot your password?</a>
                                </div>
                                <span className="error-text">{errors.firebase}</span>
                            </form>
                            <div className="login-signup">Don't have an account? <a onClick={() => navigate('/register')}>Sign up here.</a></div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}