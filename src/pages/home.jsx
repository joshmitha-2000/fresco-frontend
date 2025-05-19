import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
      style={{
        backgroundImage:
          'url("https://img.freepik.com/premium-photo/mock-up-furniture-design-minimal-interior-beige-wall-background_221619-541.jpg")',
      }}
    >
      <div className=" bg-opacity-80 p-6 rounded-md max-w-2xl w-full">
        <h1 className="text-3xl md:text-5xl font-bold text-[#5c3d1c] mb-4">
          Welcome to Our Fresco Store
        </h1>
        <p className="text-base md:text-lg text-[#7b5e3b] mb-8">
          Find the best furniture that suits your space and style.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <button className="w-full sm:w-auto bg-[#d4a15e] hover:bg-[#c68a3c] text-white px-6 py-3 rounded-md transition">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="w-full sm:w-auto bg-white border border-[#d4a15e] text-[#5c3d1c] px-6 py-3 rounded-md hover:bg-[#f1e8dc] transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;