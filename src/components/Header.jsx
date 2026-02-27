import { Link, useNavigate } from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser';

function Header() {
  const user = useCurrentUser();
  const navigate = useNavigate();

  const handleContestClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <header className="site-header">
      <div className="site-logo">
          <Link to="/">
            <img src="/scratchwin/images/logo.png" alt="Buy More Dollars Logo" className="logo-img" />
          </Link>
      </div>
      <nav className="site-nav">
        <Link to="/references">REFERENCES</Link>
        <Link to="/legal">LEGAL</Link>
        {user && (
          <Link to="/contest" onClick={handleContestClick}>CONTEST</Link>
        )}
        <Link to="/login">            
          <img src="/scratchwin/images/user.png" alt="User Icon" className="user-img" />
        </Link>
      </nav>
    </header>
  );
}

export default Header;
