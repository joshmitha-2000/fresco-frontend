import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './pages/home'; // Import Home page
import Frontpage from './pages/frontpage';
import ShopPage from './pages/shop';
import Blog from './components/blog';
import Contact from './components/contact';
import Wishlist from './pages/wishlist';
import Cart from './pages/cart';
import Login from './pages/login';
import Register from './pages/register';
import ProductDetails from './pages/productdetails';
import BuyNowPage from './pages/buynowpage';
import Orders from './pages/oders';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setCheckingAuth(false);
  }, [location.pathname]);

  const hideNavbarRoutes = ['/', '/login', '/register']; // Home, login, register
  const isNavbarVisible = !hideNavbarRoutes.includes(location.pathname);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    navigate('/frontpage');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (checkingAuth) return <div>Loading...</div>;

  return (
    <>
      {isNavbarVisible && (
        <Navbar onSearch={setSearchQuery} onLogout={handleLogout} />
      )}
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/frontpage" /> : <Home />
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/frontpage" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/frontpage" /> : <Register onLogin={handleLogin} />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/frontpage"
          element={isAuthenticated ? <Frontpage /> : <Navigate to="/login" />}
        />
        <Route
          path="/shop"
          element={isAuthenticated ? <ShopPage searchQuery={searchQuery} /> : <Navigate to="/login" />}
        />
        <Route
          path="/orders"
          element={isAuthenticated ? <Orders /> : <Navigate to="/login" />}
        />
        <Route
          path="/blog"
          element={isAuthenticated ? <Blog /> : <Navigate to="/login" />}
        />
        <Route
          path="/contact"
          element={isAuthenticated ? <Contact /> : <Navigate to="/login" />}
        />
        <Route
          path="/wishlist"
          element={isAuthenticated ? <Wishlist /> : <Navigate to="/login" />}
        />
        <Route
          path="/cart"
          element={isAuthenticated ? <Cart /> : <Navigate to="/login" />}
        />
        <Route
          path="/product/:productId"
          element={isAuthenticated ? <ProductDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/buynowpage"
          element={isAuthenticated ? <BuyNowPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;