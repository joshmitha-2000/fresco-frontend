import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInitial, setUserInitial] = useState("U");

  const location = useLocation();
  const navigate = useNavigate();

  const isShopPage = location.pathname === "/shop";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    setIsAuthenticated(!!token);

    if (email && email.length > 0) {
      setUserInitial(email[0].toUpperCase());
    } else {
      setUserInitial("U");
    }

    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (onSearch) onSearch(value);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/frontpage"
          className="flex items-center text-3xl font-[Dancing_Script] lowercase tracking-tight text-[#6b4f3a]"
          style={{ letterSpacing: "-0.02em" }}
        >
          <span>fr</span>
          <span className="w-5 h-5 -mx-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#a67c52"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#6b4f3a"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v12m0 0l-3-3m3 3l3-3m-6 6h6m-6 3h6"
              />
            </svg>
          </span>
          <span>esco</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/frontpage" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Shop</Link>
          {isAuthenticated && (
            <Link to="/orders" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Orders</Link>
          )}

          {/* Shop Search */}
          {isOpen && (
  <div className="md:hidden bg-white shadow-md px-2 pt-2 pb-3 space-y-1">
    <Link to="/frontpage" className="block px-3 py-2 rounded-md text-base text-gray-600 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Home</Link>
    <Link to="/shop" className="block px-3 py-2 rounded-md text-base text-gray-600 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Shop</Link>
    {isAuthenticated && (
      <Link to="/orders" className="block px-3 py-2 rounded-md text-base text-gray-600 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Orders</Link>
    )}
    {isAuthenticated && (
      <>
        {["blog", "contact", "profile", "settings", "wishlist", "cart"].map((path) => (
          <Link
            key={path}
            to={`/${path}`}
            className="block px-3 py-2 rounded-md text-base text-gray-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            {path.charAt(0).toUpperCase() + path.slice(1)}
          </Link>
        ))}
        <button
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
          className="w-full text-left px-3 py-2 rounded-md text-base text-gray-600 hover:bg-gray-50"
        >
          Logout
        </button>
      </>
    )}
  </div>
)}


          {/* Profile Dropdown */}
          {isAuthenticated ? (
            <div className="relative ml-4">
              <button
                onClick={toggleProfile}
                className="flex items-center focus:outline-none rounded-full bg-gray-200 h-8 w-8 justify-center"
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
              >
                <span className="sr-only">Open user menu</span>
                <span className="font-semibold text-gray-700 select-none">{userInitial}</span>
              </button>

              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5" role="menu">
                  {["blog", "contact", "profile", "settings", "wishlist", "cart"].map((path) => (
                    <Link
                      key={path}
                      to={`/${path}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {path.charAt(0).toUpperCase() + path.slice(1)}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
              <Link to="/register" className="bg-[#6b4f3a] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#a67c52]">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle + Profile */}
        <div className="md:hidden flex items-center space-x-2">
          {isAuthenticated ? (
            <button onClick={toggleProfile} className="p-1 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center h-8 w-8">
              <span className="font-semibold">{userInitial}</span>
            </button>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md text-sm font-medium">Login</Link>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-2 pt-2 pb-3 space-y-1">
          <Link to="/frontpage" className="block px-3 py-2 rounded-md text-base text-gray-600 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/shop" className="block px-3 py-2 rounded-md text-base text-gray-600 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Shop</Link>
          {isAuthenticated && (
            <Link to="/orders" className="block px-3 py-2 rounded-md text-base text-gray-600 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Orders</Link>
          )}
          {isShopPage && (
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="block w-full px-3 py-2 mt-2 border rounded-md"
              aria-label="Search products"
            />
          )}
          {isAuthenticated && (
            <>
              {["blog", "contact", "profile", "settings", "wishlist", "cart"].map((path) => (
                <Link
                  key={path}
                  to={`/${path}`}
                  className="block px-3 py-2 rounded-md text-base text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {path.charAt(0).toUpperCase() + path.slice(1)}
                </Link>
              ))}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base text-gray-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
