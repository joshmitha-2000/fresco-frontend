import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful! Check your email for confirmation link.');
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Server error.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f2eb] px-4">
      <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://st4.depositphotos.com/3856085/41679/i/450/depositphotos_416793598-stock-photo-mock-frame-home-interior-background.jpg"
            alt="Register Visual"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10 max-h-screen overflow-y-auto">
          <h2 className="text-3xl font-semibold text-[#5c3d1c] mb-6 text-center">Register</h2>

          {message && <p className="text-center text-green-600 mb-4">{message}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <button type="submit" className="w-full bg-[#d4a15e] text-white py-2 rounded-md hover:bg-[#b8894d] transition">
              Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-[#c68a3c] hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;