import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import SatisYap from './pages/SatisYap';
import UrunEkle from './pages/UrunEkle';
import UrunListesi from './pages/UrunListesi';
import { UserProvider, useUser } from './contexts/UserContext';
import { getCurrentUser } from './services/api';
import '@coreui/coreui/dist/css/coreui.min.css';
import '@coreui/icons/css/all.min.css';

const ProtectedRoute = ({ children }) => {
  const { user, setUser } = useUser();

  useEffect(() => {
    if (!user) {
      getCurrentUser()
        .then(response => setUser(response.data))
        .catch(() => {});
    }
  }, [user, setUser]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <UserProvider>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Products />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/satis-yap" element={
            <ProtectedRoute>
              <DashboardLayout>
                <SatisYap />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/urun-ekle" element={
            <ProtectedRoute>
              <DashboardLayout>
                <UrunEkle />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/urun-listesi" element={
            <ProtectedRoute>
              <DashboardLayout>
                <UrunListesi />
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;