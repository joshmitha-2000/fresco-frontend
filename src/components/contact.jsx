import React, { useState } from 'react';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setMessage('Please enter your email.');
    } else if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
    } else {
      setMessage(`Thank you for subscribing, ${email}!`);
      setEmail('');
    }
  };

  // Hover styles class for links and list items
  const hoverClass = 'hover:text-[#d87750] hover:underline cursor-pointer transition';

  return (
    <div className="bg-[#2f271d] text-white px-6 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-10">
        {/* Contact Us */}
        <div className="md:col-span-1 space-y-2">
          <h2 className="text-lg font-semibold">CONTACT US</h2>
          <p>5609 E Sprague Ave, Spokane<br />Valley, WA 99212, USA</p>
          <p>+1890 123 456<br />+1890 123 678</p>
          <p>support@example.com</p>
        </div>

        {/* About Company */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">ABOUT COMPANY</h2>
          <ul className="space-y-1">
            <li className={hoverClass}>About Us</li>
            <li className={hoverClass}>Careers</li>
            <li className={hoverClass}>News</li>
            <li className={hoverClass}>Media Kit</li>
            <li className={hoverClass}>Contact</li>
          </ul>
        </div>

        {/* Useful Links */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">USEFUL LINKS</h2>
          <ul className="space-y-1">
            <li className={hoverClass}>New Products</li>
            <li className={hoverClass}>Best Sellers</li>
            <li className={hoverClass}>Bundle & Save</li>
            <li className={hoverClass}>Online Gift Card</li>
            <li className={hoverClass}>Store Locator</li>
          </ul>
        </div>

        {/* Collaborate */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">COLLABORATE</h2>
          <ul className="space-y-1">
            <li className={hoverClass}>Partners</li>
            <li className={hoverClass}>Partners Program</li>
            <li className={hoverClass}>Affiliate Program</li>
            <li className={hoverClass}>Community</li>
            <li className={hoverClass}>HR Partner Program</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h2 className="text-sm uppercase text-gray-400">Our Newsletter</h2>
          <h3 className="text-3xl font-bold">Join Our Newsletter</h3>
          <p className="text-sm text-gray-300">Sign up to hear about our latest sales,<br />new arrivals &amp; more.</p>
          <input
            type="email"
            placeholder="Enter your email..."
            className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSubscribe}
            className="w-full mt-2 py-2 bg-[#d87750] hover:bg-[#e9844d] rounded text-white font-semibold"
          >
            Subscribe →
          </button>
          {message && <p className="mt-2 text-sm text-yellow-300">{message}</p>}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-sm flex flex-col md:flex-row justify-between items-center">
        <p>
          Copyright © 2025 <span className="font-semibold">Fresco</span>. All rights reserved
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className={hoverClass}>Privacy &amp; Cookie Policy</a>
          <a href="#" className={hoverClass}>Terms of Service</a>
        </div>
      </div>
    </div>
  );
}