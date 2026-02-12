
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="site-header">
      <div className="site-logo">
          <Link to="/">
            <img src="/logo.png" alt="Buy More Dollars Logo" className="logo-img" />
          </Link>
      </div>
      <nav className="site-nav">
        <Link to="/contest">CONTEST</Link>
        <Link to="/legal">LEGAL</Link>
        <Link to="/login">            
          <img src="/user.png" alt="User Icon" className="user-img" />
        </Link>
      </nav>
    </header>
  );
}

export default Header;
