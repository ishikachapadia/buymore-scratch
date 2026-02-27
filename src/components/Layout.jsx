import React, { useEffect, useState } from 'react';
import ScrollToTop from '../ScrollToTop';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import RememberUserModal from './RememberUserModal';

export default function Layout() {
  const [showModal, setShowModal] = useState(false);
  const [rememberedUser, setRememberedUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const greetName = localStorage.getItem('greetName');
    if (greetName) {
      setRememberedUser(greetName);
      setShowModal(true);
    }
  }, []);

  const handleLogin = () => {
    setShowModal(false);
    navigate('/login');
  };
  const handleSwitch = () => {
    localStorage.removeItem('greetName');
    setShowModal(false);
    navigate('/login');
  };

  return (
    <section className="site-wrapper">
      <Header />
      <RememberUserModal
        userName={rememberedUser}
        onLogin={handleLogin}
        onSwitch={handleSwitch}
        open={showModal}
      />
      <main className="page-content">
        <ScrollToTop>
          <Outlet />
        </ScrollToTop>
      </main>
      <Footer />
    </section>
  );
}
