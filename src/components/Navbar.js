import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { logout } from '../services/api';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Ana Sayfa</Link></li>
        {user ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><button onClick={handleLogout}>Çıkış Yap</button></li>
          </>
        ) : (
          <>
            <li><Link to="/register">Üye Ol</Link></li>
            <li><Link to="/login">Giriş Yap</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;