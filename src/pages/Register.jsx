import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';


export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [agreeRules, setAgreeRules] = useState(false);
    const [agreePromo, setAgreePromo] = useState(false);
    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!firstName.trim()) newErrors.firstName = 'First name is required';
        if (!lastName.trim()) newErrors.lastName = 'Last name is required';

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirm password is required';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!dob) {
            newErrors.dob = 'Date of birth is required';
        }

        if (!street.trim()) newErrors.street = 'Street address is required';
        if (!city.trim()) newErrors.city = 'City is required';
        if (!province.trim()) newErrors.province = 'Province is required';
        if (!postalCode.trim()) newErrors.postalCode = 'Postal code is required';
        if (!country.trim()) newErrors.country = 'Country is required';

        if (!agreeRules) {
            newErrors.agreeRules = 'You must agree to the contest rules';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setErrors({});
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, {
                    displayName: `${firstName} ${lastName}`
                });
                // Store extra user info in Firestore
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    uid: userCredential.user.uid,
                    firstName,
                    lastName,
                    email,
                    phone,
                    dob,
                    street,
                    city,
                    province,
                    postalCode,
                    country,
                    agreeRules,
                    agreePromo,
                    createdAt: new Date().toISOString()
                });
                alert('Registration successful! Redirecting to login...');
                navigate('/login');
            } catch (error) {
                setErrors({ firebase: error.message });
                console.error('Firebase error:', error);
            }
        }
    };

    const navigate = useNavigate();

    return (
        <main className="register-container">
            <div className="register-wrapper">
                <section className="register-form-section">
                    <span className="free-entry-badge">FREE ENTRY</span>
                    <h2 className="register-title">GET YOUR SCRATCH CARD</h2>

                        <form className="register-form" onSubmit={handleSubmit}>
                            {/* Name Fields */}
                            <div className="form-row">
                                <article className="form-group">
                                    <label htmlFor="fname" className="form-label">First Name</label>
                                    <input
                                        id="fname"
                                        type="text"
                                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                                        value={firstName}
                                        onChange={(e) => {
                                            setFirstName(e.target.value);
                                            if (errors.firstName) setErrors({ ...errors, firstName: '' });
                                        }}
                                        required
                                    />
                                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                                </article>
                                <article className="form-group">
                                    <label htmlFor="lname" className="form-label">Last Name</label>
                                    <input
                                        id="lname"
                                        type="text"
                                        className={`form-input ${errors.lastName ? 'error' : ''}`}
                                        value={lastName}
                                        onChange={(e) => {
                                            setLastName(e.target.value);
                                            if (errors.lastName) setErrors({ ...errors, lastName: '' });
                                        }}
                                        required
                                    />
                                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                                </article>
                            </div>

                            {/* Email */}
                            <article className="form-group">
                                <label htmlFor="reg-email" className="form-label">Email Address</label>
                                <input
                                    id="reg-email"
                                    type="email"
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrors({ ...errors, email: '' });
                                    }}
                                    required
                                />
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </article>

                            {/* Password Fields */}
                            <div className="form-row">
                                <article className="form-group">
                                    <label htmlFor="reg-password" className="form-label">Password</label>
                                    <input
                                        id="reg-password"
                                        type="password"
                                        className={`form-input ${errors.password ? 'error' : ''}`}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password) setErrors({ ...errors, password: '' });
                                        }}
                                        required
                                    />
                                    {errors.password && <span className="error-text">{errors.password}</span>}
                                </article>
                                <article className="form-group">
                                    <label htmlFor="conf-password" className="form-label">Confirm Password</label>
                                    <input
                                        id="conf-password"
                                        type="password"
                                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                                        }}
                                        required
                                    />
                                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                                </article>
                            </div>

                            {/* Phone & DOB */}
                            <div className="form-row">
                                <article className="form-group">
                                    <label htmlFor="phone" className="form-label">Phone Number</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        className={`form-input ${errors.phone ? 'error' : ''}`}
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                            if (errors.phone) setErrors({ ...errors, phone: '' });
                                        }}
                                        required
                                    />
                                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                                </article>
                                <article className="form-group">
                                    <label htmlFor="dob" className="form-label">Date of Birth</label>
                                    <input
                                        id="dob"
                                        type="date"
                                        className={`form-input ${errors.dob ? 'error' : ''}`}
                                        value={dob}
                                        onChange={(e) => {
                                            setDob(e.target.value);
                                            if (errors.dob) setErrors({ ...errors, dob: '' });
                                        }}
                                        required
                                    />
                                    {errors.dob && <span className="error-text">{errors.dob}</span>}
                                </article>
                            </div>

                            <p className="helper-text">Must be 16+ to play, or require guardian's permission</p>

                            {/* Street Address */}
                            <article className="form-group">
                                <label htmlFor="street" className="form-label">Street Address</label>
                                <input
                                    id="street"
                                    type="text"
                                    className={`form-input ${errors.street ? 'error' : ''}`}
                                    value={street}
                                    onChange={(e) => {
                                        setStreet(e.target.value);
                                        if (errors.street) setErrors({ ...errors, street: '' });
                                    }}
                                    required
                                />
                                {errors.street && <span className="error-text">{errors.street}</span>}
                            </article>

                            {/* City & Province */}
                            <div className="form-row">
                                <article className="form-group">
                                    <label htmlFor="city" className="form-label">City</label>
                                    <input
                                        id="city"
                                        type="text"
                                        className={`form-input ${errors.city ? 'error' : ''}`}
                                        value={city}
                                        onChange={(e) => {
                                            setCity(e.target.value);
                                            if (errors.city) setErrors({ ...errors, city: '' });
                                        }}
                                        required
                                    />
                                    {errors.city && <span className="error-text">{errors.city}</span>}
                                </article>
                                <article className="form-group">
                                    <label htmlFor="province" className="form-label">Province</label>
                                    <input
                                        id="province"
                                        type="text"
                                        className={`form-input ${errors.province ? 'error' : ''}`}
                                        value={province}
                                        onChange={(e) => {
                                            setProvince(e.target.value);
                                            if (errors.province) setErrors({ ...errors, province: '' });
                                        }}
                                        required
                                    />
                                    {errors.province && <span className="error-text">{errors.province}</span>}
                                </article>
                            </div>

                            {/* Postal Code & Country */}
                            <div className="form-row">
                                <article className="form-group">
                                    <label htmlFor="postal" className="form-label">Postal Code</label>
                                    <input
                                        id="postal"
                                        type="text"
                                        className={`form-input ${errors.postalCode ? 'error' : ''}`}
                                        value={postalCode}
                                        onChange={(e) => {
                                            setPostalCode(e.target.value);
                                            if (errors.postalCode) setErrors({ ...errors, postalCode: '' });
                                        }}
                                        required
                                    />
                                    {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
                                </article>
                                <article className="form-group">
                                    <label htmlFor="country" className="form-label">Country</label>
                                    <input
                                        id="country"
                                        type="text"
                                        className={`form-input ${errors.country ? 'error' : ''}`}
                                        value={country}
                                        onChange={(e) => {
                                            setCountry(e.target.value);
                                            if (errors.country) setErrors({ ...errors, country: '' });
                                        }}
                                        required
                                    />
                                    {errors.country && <span className="error-text">{errors.country}</span>}
                                </article>
                            </div>

                            {/* Checkboxes */}
                            <div className={`checkbox-group ${errors.agreeRules ? 'error' : ''}`}>
                                <input
                                    type="checkbox"
                                    id="agree-rules"
                                    checked={agreeRules}
                                    onChange={(e) => {
                                        setAgreeRules(e.target.checked);
                                        if (errors.agreeRules) setErrors({ ...errors, agreeRules: '' });
                                    }}
                                    required
                                />
                                <label htmlFor="agree-rules" className="checkbox-label">
                                    Agree to contest rules and terms and conditions
                                </label>
                            </div>
                            {errors.agreeRules && <span className="error-text">{errors.agreeRules}</span>}
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    id="agree-promo"
                                    checked={agreePromo}
                                    onChange={(e) => setAgreePromo(e.target.checked)}
                                />
                                <label htmlFor="agree-promo" className="checkbox-label">
                                    Receive promotional emails from BuyMore Dollars
                                </label>
                            </div>

                            <button type="submit" className="register-button">
                                Reveal my prize
                            </button>
                        </form>

                    <footer className="register-link">
                            Have an account? <a onClick={() => navigate('/login')}>Log in here</a>
                        </footer>
                    </section>

                    {/* Prize Section */}
                    <aside className="prize-section">
                        <h3 className="prize-title">YOU COULD WIN</h3>
                        <div className="prize-amount">10,000</div>
                        <p className="prize-currency">BuyMore Dollars</p>

                        <div className="prize-item">
                            <span className="prize-count">750</span>
                            <span className="prize-frequency">5/week</span>
                        </div>
                        <div className="prize-item">
                            <span className="prize-count">100</span>
                            <span className="prize-frequency">10/week</span>
                        </div>
                        <div className="prize-item">
                            <span className="prize-count">20</span>
                            <span className="prize-frequency">100/week</span>
                        </div>
                    </aside>
                </div>
            </main>
    );
}
