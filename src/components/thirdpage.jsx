import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ThirdPage() {
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.unobserve(entry.target); // Animate only once
        }
      },
      {
        root: null,
        threshold: 0.3,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  const handleShopClick = () => {
    navigate("/shop");
  };

  return (
    <div
      ref={containerRef}
      className="bg-[#f5f5dc] min-h-screen flex items-center justify-center p-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-6xl w-full">
        {/* Image Section with Red Glow */}
        <div
          className={`relative transition-all duration-[2500ms] ease-in-out transform ${
            animate ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
          }`}
          style={{ height: "600px" }}
        >
          {/* Red glowing shadow behind the image */}
          <div
            className="absolute -left-20 top-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-red-500 opacity-20 blur-3xl"
            aria-hidden="true"
          ></div>

          {/* Chair Image */}
          <img
  src="/Red_Chair_PNG_Clipart.png"
  alt="Red Chair"
  className="relative w-full h-full object-contain"
/>

        </div>

        {/* Text Section */}
        <div
          className={`transition-all duration-[2500ms] ease-in-out transform ${
            animate ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          }`}
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Sleek Modern Red Chair
          </h1>
          <p className="text-lg text-gray-800 mb-4 leading-relaxed">
            Elevate your interior with our premium red chair — a perfect blend of bold
            color, ergonomic comfort, and modern elegance. Designed to suit any room, it
            becomes a statement piece while ensuring maximum support.
          </p>
          <p className="text-base text-gray-700 mb-6">
            Crafted with high-quality materials and a durable frame, this chair is ideal
            for living rooms, reading corners, or stylish office spaces.
          </p>
          <button
            onClick={handleShopClick}
            className="px-6 py-3 bg-orange-700 text-white font-semibold text-base rounded-full hover:bg-orange-500 transition duration-300"
          >
            Shop now <span className="ml-1">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}