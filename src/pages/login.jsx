import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        handleLoginSuccess(data);
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleLoginSuccess = (data) => {
    localStorage.setItem('token', data.token);

    // Store email in localStorage
    if (data.email) {
      localStorage.setItem('email', data.email);
    } else if (data.user && data.user.email) {
      localStorage.setItem('email', data.user.email);
    } else {
      console.warn("Email not found in login response.");
    }

    // Store userId in localStorage
    if (data.userId) {
      localStorage.setItem('userId', data.userId);
    } else if (data.user && data.user.id) {
      localStorage.setItem('userId', data.user.id);
    } else {
      console.warn("User ID not found in login response.");
    }

    navigate('/frontpage');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f2eb] px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <h2 className="text-3xl font-semibold text-[#5c3d1c] mb-6 text-center md:text-left">Login</h2>
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#d4a15e] text-white py-2 rounded-md hover:bg-[#c68a3c] transition duration-300"
            >
              Log in
            </button>

            {errorMessage && (
              <p className="text-red-500 text-center mt-4">{errorMessage}</p>
            )}

            <p className="text-sm text-center mt-4">
              Don't have an account?
              <Link to="/register" className="text-[#c68a3c] hover:underline ml-1">Register</Link>
            </p>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://media.istockphoto.com/id/1422948062/photo/office-room-with-a-two-tone-and-pastel-background.jpg?s=612x612&w=0&k=20&c=BJ69l6bet4IuzM-6vwMFGRHZ_mlujHJCjHIhL7T8w3M="
            alt="Login Visual"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
