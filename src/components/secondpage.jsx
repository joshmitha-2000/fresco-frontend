import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Secondpage() {
  const [inView, setInView] = useState(false);
  const textRef = useRef(null);
  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const textPosition = textRef.current.offsetTop;
      const imagePosition1 = imageRef1.current.offsetTop;
      const imagePosition2 = imageRef2.current.offsetTop;

      if (
        scrollPosition > textPosition ||
        scrollPosition > imagePosition1 ||
        scrollPosition > imagePosition2
      ) {
        setInView(true);
      } else {
        setInView(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center px-4 sm:px-8 lg:px-10 py-10 bg-[#f5f5dc] mt-10 space-y-10 lg:space-y-0 lg:space-x-6">
      {/* Text Section */}
      <div
        ref={textRef}
        className={`w-full lg:w-1/3 transition-all duration-[1500ms] ease-in-out ${
          inView ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
        }`}
      >
        <h2 className="mb-4 text-orange-800 text-lg sm:text-xl">Modern & Elegant</h2>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-black">
          Furniture to love now & forever
        </h3>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          Discover furniture that’s designed to be cherished, evolving with your life and style,
          making every moment at home even more special.
        </p>

        <div className="w-3/4 h-[2px] bg-orange-800 mt-5 mb-8"></div>

        <div className="space-y-6 text-gray-700 text-sm mb-10">
          <div>
            <p className="text-lg font-semibold">🚚 Free Shipping</p>
            <p className="text-base">Enjoy free shipping on all orders</p>
          </div>
          <div>
            <p className="text-lg font-semibold">💰 Affordable Prices</p>
            <p className="text-base">We offer competitive prices</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-orange-800 text-white font-semibold text-base rounded-full hover:bg-orange-500 transition duration-300"
        >
          View Collections <span className="ml-1">→</span>
        </button>
      </div>

      {/* Image 1 */}
      <div
        ref={imageRef1}
        className={`w-full sm:w-2/3 md:w-1/2 lg:w-1/3 transition-all duration-[1500ms] ease-in-out ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <img
          src="https://i.pinimg.com/736x/36/ae/4b/36ae4ba11ade8e688baeded42e3b65e7.jpg"
          alt="Furniture 1"
          className="rounded-lg shadow-md w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover"
        />
      </div>

      {/* Image 2 */}
      <div
        ref={imageRef2}
        className={`w-full sm:w-2/3 md:w-1/2 lg:w-1/3 transition-all duration-[1500ms] ease-in-out ${
          inView ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}
      >
        <img
          src="https://i.pinimg.com/564x/d1/c6/52/d1c6524ac1ee841e078fe1b824d1eedd.jpg"
          alt="Furniture 2"
          className="rounded-lg shadow-md w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover"
        />
      </div>
    </div>
  );
}