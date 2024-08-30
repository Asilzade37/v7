import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaShoppingCart, FaList, FaPlus } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import '../styles/DashboardLayout.scss';

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`dashboard-layout ${collapsed ? 'collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          {!collapsed && <h3>Satış Yönetimi</h3>}
          <FiMenu className="menu-icon" onClick={toggleSidebar} />
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/dashboard" end>
                <FaTachometerAlt /> {!collapsed && <span>Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/satis-yap">
                <FaShoppingCart /> {!collapsed && <span>Satış Yap</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/urun-listesi">
                <FaList /> {!collapsed && <span>Ürün Listesi</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/urun-ekle">
                <FaPlus /> {!collapsed && <span>Ürün Ekle</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;