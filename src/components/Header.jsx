import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="site-header">
      
      <section className="logo-section">
        <Link to="/" className="brandmark">
          <h1 className="brand-name">L'Éclat</h1>
        </Link>
      </section>

      <nav className="main-nav desktop-nav">
        <Link to="/">Home</Link>
        <Link to="/login">Enter</Link>

      </nav>

      {/* <section className="utility-nav">
        <button className="utility-icon" aria-label="Search">
          <Search size={22} strokeWidth={2} />
        </button>

          <Link to="/login" className="utility-icon" aria-label="Login / Profile">
          <User size={22} strokeWidth={2} />
        </Link>
      </section> */}

    </header>
  );
}

export default Header;
