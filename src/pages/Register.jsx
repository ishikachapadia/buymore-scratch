import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

// ! regex validation and checkers
function hasCharsCheck(value) {
    let pat2 = /^[a-zA-Z]+$/;
    return pat2.test(value.trim());
}

function hasEmailCheck(value) {
    let pat2 = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return pat2.test(value.trim());
}

function hasPasswordCheck(value) {
    let pat2 = /^.{6,}$/;
    return pat2.test(value);
}

function hasPhoneCheck(value) {
    let pat2 = /^[\d\s\-\+\(\)]{10,}$/;
    return pat2.test(value.trim());
}

function hasValueCheck(value) {
    return value.trim().length > 0;
}

function hasDateCheck(value) {
    return value.length > 0;
}

function hasCheckedCheck(value) {
    return value === true;
}


export default function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [fields, setFields] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        dob: '',
        street: '',
        city: '',
        province: '',
        postalCode: '',
        country: '',
        agreeRules: false,
        agreePromo: false,
    });
    // ! we used a nbsp or else the form kept jumping
    const [errors, setErrors] = useState({
        firstName: '\u00A0',
        lastName: '\u00A0',
        email: '\u00A0',
        password: '\u00A0',
        confirmPassword: '\u00A0',
        phone: '\u00A0',
        dob: '\u00A0',
        street: '\u00A0',
        city: '\u00A0',
        province: '\u00A0',
        postalCode: '\u00A0',
        country: '\u00A0',
        agreeRules: '\u00A0',
        firebase: '',
    });

    // ! validate only step 1 fields
    function validateStep1() {
        let newErrors = { ...errors };
        let valid = true;
        if (!hasCharsCheck(fields.firstName)) {
            newErrors.firstName = 'Please enter a valid first name';
            valid = false;
        } else newErrors.firstName = '\u00A0';
        if (!hasCharsCheck(fields.lastName)) {
            newErrors.lastName = 'Please enter a valid last name';
            valid = false;
        } else newErrors.lastName = '\u00A0';
        if (!hasEmailCheck(fields.email)) {
            newErrors.email = 'Please enter a valid email';
            valid = false;
        } else newErrors.email = '\u00A0';
        if (!hasPasswordCheck(fields.password)) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        } else newErrors.password = '\u00A0';
        if (fields.confirmPassword !== fields.password || fields.confirmPassword.length === 0) {
            newErrors.confirmPassword = 'Passwords do not match';
            valid = false;
        } else newErrors.confirmPassword = '\u00A0';
        if (!hasPhoneCheck(fields.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
            valid = false;
        } else newErrors.phone = '\u00A0';
        if (!hasDateCheck(fields.dob)) {
            newErrors.dob = 'Date of birth is required';
            valid = false;
        } else newErrors.dob = '\u00A0';
        setErrors(newErrors);
        return valid;
    }

    // ! validate only step 2 fields
    function validateStep2() {
        let newErrors = { ...errors };
        let valid = true;
        if (!hasValueCheck(fields.street)) {
            newErrors.street = 'Street address is required';
            valid = false;
        } else newErrors.street = '\u00A0';
        if (!hasCharsCheck(fields.city)) {
            newErrors.city = 'Please enter a valid city';
            valid = false;
        } else newErrors.city = '\u00A0';
        if (!hasCharsCheck(fields.province)) {
            newErrors.province = 'Please enter a valid province';
            valid = false;
        } else newErrors.province = '\u00A0';
        if (!hasValueCheck(fields.postalCode)) {
            newErrors.postalCode = 'Postal code is required';
            valid = false;
        } else newErrors.postalCode = '\u00A0';
        if (!hasCharsCheck(fields.country)) {
            newErrors.country = 'Please enter a valid country';
            valid = false;
        } else newErrors.country = '\u00A0';
        if (!hasCheckedCheck(fields.agreeRules)) {
            newErrors.agreeRules = 'You must agree to the contest rules';
            valid = false;
        } else newErrors.agreeRules = '\u00A0';
        newErrors.firebase = '';
        setErrors(newErrors);
        return valid;
    }

    // ! go to next step after validating step 1
    function handleNext() {
        if (validateStep1()) {
            setStep(2);
        }
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFields(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateStep2()) {
            return;
        }
        try {
            let userCredential = await createUserWithEmailAndPassword(auth, fields.email, fields.password);
            await updateProfile(userCredential.user, {
                displayName: `${fields.firstName} ${fields.lastName}`
            });
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                uid: userCredential.user.uid,
                firstName: fields.firstName,
                lastName: fields.lastName,
                email: fields.email,
                phone: fields.phone,
                dob: fields.dob,
                street: fields.street,
                city: fields.city,
                province: fields.province,
                postalCode: fields.postalCode,
                country: fields.country,
                agreeRules: fields.agreeRules,
                agreePromo: fields.agreePromo,
                createdAt: new Date().toISOString()
            });
            navigate('/login');
        } catch (error) {
            setErrors(prev => ({ ...prev, firebase: error.message }));
            console.log('Firebase error:', error);
        }
    }

    return (
        <main className="register-container">
            <div className="register-wrapper">
                <section className="register-form-section">
                    <span className="free-entry-badge">FREE ENTRY</span>
                    <h2 className="register-title">GET YOUR FREE SCRATCH CARD</h2>

                    {/* Step indicator */}
                    <div className="step-indicator">
                        <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                        <div className="step-line"></div>
                        <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                    </div>

                    <form className="register-form" onSubmit={handleSubmit}>
                        <span className="error-text">{errors.firebase}</span>

                        {/* ===== STEP 1: Account & Personal Info ===== */}
                        {step === 1 && (
                            <>
                                <div className="form-row">
                                    <article className="form-group">
                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                        <input id="firstName" name="firstName" type="text" className={`form-input${errors.firstName !== '\u00A0' ? ' error' : ''}`} value={fields.firstName} onChange={handleChange} />
                                        <span className="error-text">{errors.firstName}</span>
                                    </article>
                                    <article className="form-group">
                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                        <input id="lastName" name="lastName" type="text" className={`form-input${errors.lastName !== '\u00A0' ? ' error' : ''}`} value={fields.lastName} onChange={handleChange} />
                                        <span className="error-text">{errors.lastName}</span>
                                    </article>
                                </div>

                                <article className="form-group">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input id="email" name="email" type="email" className={`form-input${errors.email !== '\u00A0' ? ' error' : ''}`} value={fields.email} onChange={handleChange} />
                                    <span className="error-text">{errors.email}</span>
                                </article>

                                <div className="form-row">
                                    <article className="form-group">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input id="password" name="password" type="password" className={`form-input${errors.password !== '\u00A0' ? ' error' : ''}`} value={fields.password} onChange={handleChange} />
                                        <span className="error-text">{errors.password}</span>
                                    </article>
                                    <article className="form-group">
                                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                        <input id="confirmPassword" name="confirmPassword" type="password" className={`form-input${errors.confirmPassword !== '\u00A0' ? ' error' : ''}`} value={fields.confirmPassword} onChange={handleChange} />
                                        <span className="error-text">{errors.confirmPassword}</span>
                                    </article>
                                </div>

                                <div className="form-row">
                                    <article className="form-group">
                                        <label htmlFor="phone" className="form-label">Phone Number</label>
                                        <input id="phone" name="phone" type="tel" className={`form-input${errors.phone !== '\u00A0' ? ' error' : ''}`} value={fields.phone} onChange={handleChange} />
                                        <span className="error-text">{errors.phone}</span>
                                    </article>
                                    <article className="form-group">
                                        <label htmlFor="dob" className="form-label">Date of Birth</label>
                                        <input id="dob" name="dob" type="date" className={`form-input${errors.dob !== '\u00A0' ? ' error' : ''}`} value={fields.dob} onChange={handleChange} />
                                        <span className="error-text">{errors.dob}</span>
                                    </article>
                                </div>

                                <p className="helper-text">Must be 16+ to play, or require guardian's permission</p>

                                <button type="button" className="register-button" onClick={handleNext}>
                                    Next
                                </button>
                            </>
                        )}

                        {/* ===== STEP 2: Address & Agreements ===== */}
                        {step === 2 && (
                            <>
                                <article className="form-group">
                                    <label htmlFor="street" className="form-label">Street Address</label>
                                    <input id="street" name="street" type="text" className={`form-input${errors.street !== '\u00A0' ? ' error' : ''}`} value={fields.street} onChange={handleChange} />
                                    <span className="error-text">{errors.street}</span>
                                </article>

                                <div className="form-row">
                                    <article className="form-group">
                                        <label htmlFor="city" className="form-label">City</label>
                                        <input id="city" name="city" type="text" className={`form-input${errors.city !== '\u00A0' ? ' error' : ''}`} value={fields.city} onChange={handleChange} />
                                        <span className="error-text">{errors.city}</span>
                                    </article>
                                    <article className="form-group">
                                        <label htmlFor="province" className="form-label">Province</label>
                                        <input id="province" name="province" type="text" className={`form-input${errors.province !== '\u00A0' ? ' error' : ''}`} value={fields.province} onChange={handleChange} />
                                        <span className="error-text">{errors.province}</span>
                                    </article>
                                </div>

                                <div className="form-row">
                                    <article className="form-group">
                                        <label htmlFor="postalCode" className="form-label">Postal Code</label>
                                        <input id="postalCode" name="postalCode" type="text" className={`form-input${errors.postalCode !== '\u00A0' ? ' error' : ''}`} value={fields.postalCode} onChange={handleChange} />
                                        <span className="error-text">{errors.postalCode}</span>
                                    </article>
                                    <article className="form-group">
                                        <label htmlFor="country" className="form-label">Country</label>
                                        <input id="country" name="country" type="text" className={`form-input${errors.country !== '\u00A0' ? ' error' : ''}`} value={fields.country} onChange={handleChange} />
                                        <span className="error-text">{errors.country}</span>
                                    </article>
                                </div>

                                <div className="checkbox-group">
                                    <input type="checkbox" id="agreeRules" name="agreeRules" checked={fields.agreeRules} onChange={handleChange} />
                                    <label htmlFor="agreeRules" className="checkbox-label">
                                        Agree to contest rules and terms and conditions
                                    </label>
                                </div>
                                <span className="error-text">{errors.agreeRules}</span>

                                <div className="checkbox-group">
                                    <input type="checkbox" id="agreePromo" name="agreePromo" checked={fields.agreePromo} onChange={handleChange} />
                                    <label htmlFor="agreePromo" className="checkbox-label">
                                        Receive promotional emails from BuyMore Dollars
                                    </label>
                                </div>

                                <div className="form-buttons">
                                    <button type="button" className="back-button" onClick={() => setStep(1)}>
                                        Back
                                    </button>
                                    <button type="submit" className="register-button">
                                        Reveal my prize
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                    <footer className="register-link">
                        Have an account? <a onClick={() => navigate('/login')}>Log in here</a>
                    </footer>
                </section>

                <aside className="prize-section">
                    <h3 className="prize-title">YOU COULD WIN</h3>
                    <section className="prize-amount-bg">       
                    <div className="prize-amount">10,000</div>
                    <p className="prize-currency">BuyMore Dollars</p>
                    </section>

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

                    <div className="prize-info-texts">
                        <p className="prize-info">115+ winners every week!</p>
                        <p className="prize-info">Play every 72 hours</p>
                        <p className="prize-info">Easy question to claim your prize!</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
