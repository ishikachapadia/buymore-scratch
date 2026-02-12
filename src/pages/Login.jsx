import {useNavigate} from 'react-router-dom';
export default function Login() {
    
    const navigate = useNavigate();

    function thanks(e){
        e.preventDefault();
        console.log("Thank you user!");
        navigate('/thanks');
    }

    return (
        <section className="login-bg">

            <main className="login-main">
                <div className="login-box">
                    <h1 className="login-title">HI, John!</h1>
                    <p className="login-subtitle">Welcome back ! Ready to have a chance to win?</p>
                    <form onSubmit={thanks} className="login-form">
                        <label className="login-label">Email Address</label>
                            <input type="email" className="login-input" />
                        <label className="login-label">Password</label>
                            <input type="password" className="login-input" />
                        <button type="submit" value="Submit" className="login-btn">Log in</button>
                    </form>
                    <div className="login-signup">Don't have an account? <a href="/register">Sign up here.</a></div>
                </div>
            </main>
        </section>
    );
}