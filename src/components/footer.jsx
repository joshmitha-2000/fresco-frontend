import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-amber-950 text-white py-6 mt-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-center md:text-left">&copy; {new Date().getFullYear()} Fresco Shop. All rights reserved.</p>
        <nav aria-label="Footer Navigation">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mt-4 md:mt-0 text-center md:text-left">
            <a 
              href="" 
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
              About Us
            </a>
            <a 
              href="" 
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
              Contact
            </a>
            <a 
              href="" 
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
              Privacy Policy
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
}
