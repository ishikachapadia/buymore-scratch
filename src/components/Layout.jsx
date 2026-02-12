import { Outlet } from 'react-router-dom';
import Header from './Header'; 
import Footer from './Footer'; 

export default function Layout() {
  return (
    <section className="site-wrapper">
      <Header />

      <main className="page-content">
        <Outlet /> 
      </main>

      <Footer />
    </section>
  );
}
