import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.scss';

const Home = () => {
  return (
    <div className="home">
      <header>
        <nav>
          <ul>
            <li><Link to="/">Ana Sayfa</Link></li>
            <li><Link to="/login">Giriş Yap</Link></li>
            <li><Link to="/register">Üye Ol</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <h1>Hızlı Satış Sistemine Hoş Geldiniz</h1>
        <p>Satışlarınızı hızlı ve kolay bir şekilde yönetin.</p>
        <Link to="/register" className="cta-button">Hemen Başlayın</Link>
      </main>
      <footer>
        <p>&copy; 2023 Hızlı Satış. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};

export default Home;