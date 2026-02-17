import { useState, useEffect } from 'react';
import TermsModal from '../components/TermsModal';
import ContestRulesModal from '../components/ContestRulesModal';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

// ! regex validation and checkers
function hasCharsCheck(value) {
    let pat2 = /^[a-zA-Z]+$/;;
    return pat2.test(value.trim());
}

function hasEmailCheck(value) {
    let pat2 = /^[a-zA-Z0-9_-]{2,}[.]?[a-zA-Z0-9_-]*[@]{1}[a-zA-Z0-9_-]{2,}[.]{1}(ca|com)$/;
    return pat2.test(value.trim());
}

function hasPasswordCheck(value) {
    let pat2 = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    return pat2.test(value);
}

function hasPhoneFormatCheck(value) {
    let pat2 = /^[0-9]{3}[-]?[0-9]{3}[-]?[0-9]{4}$/;
    return pat2.test(value.trim());
}

function hasPostalCodeCheck(value) {
    let pat2 = /^[a-zA-Z]{1}[0-9]{1}[a-zA-Z]{1}[ ]?[0-9]{1}[a-zA-Z]{1}[0-9]{1}$/
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

function isAtLeast16(dateStr) {
    let dob = new Date(dateStr);
    let today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    let monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age >= 16;
}

// ! tried to use floaters repo, and the floaters were supposed to represent coins, but it did not look good so i removed it
export default function Register() {
    const [showRules, setShowRules] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
        useEffect(() => {
            let goldBuffer = '';
            let goldTimeout = null;
            function handleGoldKey(e) {
                goldBuffer += e.key.toLowerCase();
                if (!'gold'.startsWith(goldBuffer)) {
                    goldBuffer = e.key.toLowerCase() === 'g' ? 'g' : '';
                }
                if (goldBuffer === 'gold') {
                    goldBuffer = '';
                    document.body.classList.add('gold-easter-egg');
                    setTimeout(() => {
                        document.body.classList.add('gold-easter-egg-fade');
                        goldTimeout = setTimeout(() => {
                            document.body.classList.remove('gold-easter-egg');
                            document.body.classList.remove('gold-easter-egg-fade');
                        }, 1500);
                    }, 2000);
                }
            }
            window.addEventListener('keydown', handleGoldKey);
            return () => {
                window.removeEventListener('keydown', handleGoldKey);
                if (goldTimeout) clearTimeout(goldTimeout);
                document.body.classList.remove('gold-easter-egg');
                document.body.classList.remove('gold-easter-egg-fade');
            };
        }, []);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const screenRef = useRef(null);
    const audioRef = useRef(null);

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
        agreePromo: '\u00A0',
        firebase: '',
    });

    // ! validate only step 1 fields
    function validateStep1() {
        let newErrors = { ...errors };
        let valid = true;

        if (!hasValueCheck(fields.firstName)) {
            newErrors.firstName = 'First name is required';
            valid = false;
        } else if (!hasCharsCheck(fields.firstName)) {
            newErrors.firstName = 'First name can only contain letters';
            valid = false;
        } else if (fields.firstName.trim().length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
            valid = false;
        } else {
            newErrors.firstName = '\u00A0';
        }

        if (!hasValueCheck(fields.lastName)) {
            newErrors.lastName = 'Last name is required';
            valid = false;
        } else if (!hasCharsCheck(fields.lastName)) {
            newErrors.lastName = 'Last name can only contain letters';
            valid = false;
        } else if (fields.lastName.trim().length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
            valid = false;
        } else {
            newErrors.lastName = '\u00A0';
        }

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

        if (!hasValueCheck(fields.confirmPassword)) {
            newErrors.confirmPassword = 'Please confirm your password';
            valid = false;
        } else if (fields.confirmPassword !== fields.password) {
            newErrors.confirmPassword = 'Passwords must match';
            valid = false;
        } else {
            newErrors.confirmPassword = '\u00A0';
        }

        if (!hasValueCheck(fields.phone)) {
            newErrors.phone = 'Phone number is required';
            valid = false;
        } else if (!hasPhoneFormatCheck(fields.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
            valid = false;
        } else if (fields.phone.replace(/\D/g, '').length !== 10) {
            newErrors.phone = 'Phone number must be 10 digits';
            valid = false;
        } else {
            newErrors.phone = '\u00A0';
        }

        if (!hasDateCheck(fields.dob)) {
            newErrors.dob = 'Date of birth is required';
            valid = false;
        } else if (isNaN(new Date(fields.dob).getTime())) {
            newErrors.dob = 'Please enter a valid date';
            valid = false;
        } else if (!isAtLeast16(fields.dob)) {
            newErrors.dob = "You must be at least 16 years old to enter without a guardian's permission";
            valid = false;
        } else {
            newErrors.dob = '\u00A0';
        }

        setErrors(newErrors);
        return valid;
    }

    // ! validate step 2 fields
    function validateStep2() {
        let newErrors = { ...errors };
        let valid = true;

        if (!hasValueCheck(fields.street)) {
            newErrors.street = 'Street address is required';
            valid = false;
        } else {
            newErrors.street = '\u00A0';
        }

        if (!hasValueCheck(fields.city)) {
            newErrors.city = 'City is required';
            valid = false;
        } else {
            newErrors.city = '\u00A0';
        }

        if (!hasValueCheck(fields.province)) {
            newErrors.province = 'Province is required';
            valid = false;
        } else {
            newErrors.province = '\u00A0';
        }

        if (!hasValueCheck(fields.country)) {
            newErrors.country = 'Country is required';
            valid = false;
        } else {
            newErrors.country = '\u00A0';
        }

        if (!hasValueCheck(fields.postalCode)) {
            newErrors.postalCode = 'Postal code is required';
            valid = false;
        } else if (!hasPostalCodeCheck(fields.postalCode)) {
            newErrors.postalCode = 'Please enter a valid postal code format (A1B 2C4)';
            valid = false;
        } else {
            newErrors.postalCode = '\u00A0';
        }

        if (!hasCheckedCheck(fields.agreeRules)) {
            newErrors.agreeRules = 'You must agree to the contest rules';
            valid = false;
        } else {
            newErrors.agreeRules = '\u00A0';
        }

        if (!hasCheckedCheck(fields.agreePromo)) {
            newErrors.agreePromo = 'You must agree to receive promotional emails';
            valid = false;
        } else {
            newErrors.agreePromo = '\u00A0';
        }

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
        // ! storing into firebase
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
            sessionStorage.setItem('loginGreetName', fields.firstName);
            navigate('/thanks', { state: { customerName: fields.firstName } });
        } catch (error) {
            setErrors(prev => ({ ...prev, firebase: error.message }));
            console.log('Firebase error:', error);
        }
    }

// ! easter egg 1 (im sorry)
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === '6') {
                window.__sixPressed = true;
            } else if (e.key === '7' && window.__sixPressed) {
                window.__sixPressed = false;
                if (screenRef.current) {
                    screenRef.current.classList.add('sixseven');
                    if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play();
                    }
                    setTimeout(() => {
                        screenRef.current.classList.remove('sixseven');
                        if (audioRef.current) {
                            audioRef.current.pause();
                            audioRef.current.currentTime = 0;
                        }
                    }, 2000);
                }
            } else {
                window.__sixPressed = false;
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // ! https://tuna.voicemod.net/sound/be79329a-ecf9-4db3-8dc2-c6e528f6600d
    return (
        <main className="register-container" ref={screenRef}>
            <audio ref={audioRef} src="/67audio.mp3" preload="auto" />
            <div className="register-wrapper">
                <section className="register-form-section">
                  <div className="register-form-section-inner">
				<div className="login-header">
                	{/* <img src="/scratchwin/images/companyHead.png" className="login-company1"></img> */}
                    <img src="/scratchwin/images/registerHead.png" className="register-company"></img>
               </div>


                    <div className="step-indicator">
                        <div className={`step-rect ${step === 1 ? 'active' : ''}`}></div>
                        <div className={`step-rect ${step === 2 ? 'active' : ''}`}></div>
                    </div>

                    <form className="password-form" onSubmit={handleSubmit}>
                        <span className="error-text">{errors.firebase}</span>

                        {step === 1 && (
                            <>
                                <div className="form-row">
                                    <article className="form-group">
                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                        <input id="firstName" name="firstName" type="text" placeholder="Your first name" className={`form-input${errors.firstName !== '\u00A0' ? ' error' : ''}`} value={fields.firstName} onChange={handleChange} />
                                        <span className="error-text">{errors.firstName}</span>
                                    </article>
                                    <article className="form-group">
                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                        <input id="lastName" name="lastName" type="text" placeholder="Your last name" className={`form-input${errors.lastName !== '\u00A0' ? ' error' : ''}`} value={fields.lastName} onChange={handleChange} />
                                        <span className="error-text">{errors.lastName}</span>
                                    </article>
                                </div>

                                <article className="form-group">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input id="email" name="email" type="email" placeholder="Your email address" className={`form-input${errors.email !== '\u00A0' ? ' error' : ''}`} value={fields.email} onChange={handleChange} />
                                    <span className="error-text">{errors.email}</span>
                                </article>

                                <div className="form-row">
                                    <article className="form-group">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input id="password" name="password" type="password" placeholder="Create a password" className={`form-input${errors.password !== '\u00A0' ? ' error' : ''}`} value={fields.password} onChange={handleChange} />
                                        <span className="error-text">{errors.password}</span>
                                    </article>
                                    <article className="form-group">
                                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                        <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" className={`form-input${errors.confirmPassword !== '\u00A0' ? ' error' : ''}`} value={fields.confirmPassword} onChange={handleChange} />
                                        <span className="error-text">{errors.confirmPassword}</span>
                                    </article>
                                </div>

                                <div className="form-row">
                                    <article className="form-group">
                                        <label htmlFor="phone" className="form-label">Phone Number</label>
                                        <input id="phone" name="phone" type="tel" placeholder="Your phone number" className={`form-input${errors.phone !== '\u00A0' ? ' error' : ''}`} value={fields.phone} onChange={handleChange} />
                                        <span className="error-text">{errors.phone}</span>
                                    </article>
                                    <article className="form-group">
                                        <label htmlFor="dob" className="form-label">Date of Birth</label>
                                        <input id="dob" name="dob" type="date" placeholder="MM / DD / YYYY" className={`form-input${errors.dob !== '\u00A0' ? ' error' : ''}`} value={fields.dob} onChange={handleChange} />
                                        <span className="error-text">{errors.dob}</span>
                                    </article>
                                </div>

                                <p className="helper-text">Must be 16+ to play, or require guardian's permission</p>

                                <button type="button" className="register-button" onClick={handleNext}>
                                    Next
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <article className="form-group">
                                    <label htmlFor="street" className="form-label">Street Address</label>
                                    <input id="street" name="street" type="text" placeholder="Your street address" className={`form-input${errors.street !== '\u00A0' ? ' error' : ''}`} value={fields.street} onChange={handleChange} />
                                    <span className="error-text">{errors.street}</span>
                                </article>

                                <div className="form-row">
                                    <article className="form-group">
                                        <label htmlFor="city" className="form-label">City</label>
                                        <input id="city" name="city" type="text" placeholder="Your city" className={`form-input${errors.city !== '\u00A0' ? ' error' : ''}`} value={fields.city} onChange={handleChange} />
                                        <span className="error-text">{errors.city}</span>
                                    </article>
                                    <article className="form-group">
                                        <label htmlFor="province" className="form-label">Province</label>
                                        <input id="province" name="province" type="text" placeholder="Your province" className={`form-input${errors.province !== '\u00A0' ? ' error' : ''}`} value={fields.province} onChange={handleChange} />
                                        <span className="error-text">{errors.province}</span>
                                    </article>
                                </div>

                                <div className="form-row">
                                    <article className="form-group">
                                        <label htmlFor="postalCode" className="form-label">Postal Code</label>
                                        <input id="postalCode" name="postalCode" type="text" placeholder="Your postal code" className={`form-input${errors.postalCode !== '\u00A0' ? ' error' : ''}`} value={fields.postalCode} onChange={handleChange} />
                                        <span className="error-text">{errors.postalCode}</span>
                                    </article>
                                    <article className="form-group">
                                        <label htmlFor="country" className="form-label">Country</label>
                                        <input id="country" name="country" type="text" placeholder="Your country" className={`form-input${errors.country !== '\u00A0' ? ' error' : ''}`} value={fields.country} onChange={handleChange} />
                                        <span className="error-text">{errors.country}</span>
                                    </article>
                                </div>

                                <div className="checkbox-group">
                                    <input type="checkbox" id="agreeRules" name="agreeRules" checked={fields.agreeRules} onChange={handleChange} />
                                    <label htmlFor="agreeRules" className="checkbox-label">
                                        Agree to <span className="terms-link" onClick={() => setShowRules(true)}>contest rules</span> and <span className="terms-link" onClick={() => setShowTerms(true)}>terms and conditions</span>
                                    </label>
                                                        <ContestRulesModal open={showRules} onClose={() => setShowRules(false)} />
                                            <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
                                </div>
                                <span className="error-text">{errors.agreeRules}</span>

                                <div className="checkbox-group">
                                    <input type="checkbox" id="agreePromo" name="agreePromo" checked={fields.agreePromo} onChange={handleChange} />
                                    <label htmlFor="agreePromo" className="checkbox-label">
                                        Receive promotional emails from BuyMore Dollars
                                    </label>
                                </div>
                                <span className="error-text">{errors.agreePromo}</span>

                                <div className="form-buttons">
                                    <button type="button" className="back-button" onClick={() => setStep(1)}>
                                        Back
                                    </button>
                                    <button type="submit" className="register-button">
                                        Sign Up
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                    <footer className="register-link">
                        Have an account? <a onClick={() => navigate('/login')}>Log in here</a>
                    </footer>
                  </div>
                </section>

                <aside className="prize-section">
                  <div className="prize-section-inner">
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
                  </div>
                </aside>
            </div>
        </main>
    );
}
