
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
        <Link to="/login">ENTER</Link>
        <Link to="/contest">CONTEST</Link>
        <Link to="/legal">LEGAL</Link>
      </nav>
    </header>
  );
}

export default Header;
