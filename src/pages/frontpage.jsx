import React, { useEffect, useState } from 'react';
import Secondpage from '../components/secondpage';
import Contact from '../components/contact';
import Blog from '../components/blog';
import TopSellingProducts from '../components/toppicks';
import ThirdPage from '../components/thirdpage';
import Skeleton from '../components/skeleton';

const slides = [
  {
    src: 'https://wallpapers.com/images/hd/beautiful-tan-modern-furniture-1p8lqahjzvgac2vw.jpg',
    captionMain: 'Modern Living Room',
    captionSub: 'Elegant & Comfortable',
  },
  {
    src: 'https://c4.wallpaperflare.com/wallpaper/603/97/68/sofa-furniture-leather-orange-wallpaper-preview.jpg',
    captionMain: 'Cozy Bedroom Setup',
    captionSub: 'Relax and Recharge',
  },
  {
    src: 'https://c4.wallpaperflare.com/wallpaper/954/987/645/room-plant-interior-wallpaper-preview.jpg',
    captionMain: 'Elegant Dining Space',
    captionSub: 'Style Meets Function',
  },
];

export default function Frontpage() {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToPreviousSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  if (loading) return <Skeleton />;

  return (
    <div className="w-full overflow-x-hidden"> {/* Prevent horizontal scroll */}
      {/* Hero Section */}
      <div className="relative w-full h-auto min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[95vh] overflow-hidden rounded-lg">

        {/* Slides */}
        <div
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="w-full flex-shrink-0 relative h-full"
              style={{ minWidth: '100vw' }} // Force each slide to exactly viewport width
            >
              <img
                src={slide.src}
                alt={`Slide ${idx + 1}`}
                className="w-full h-full object-cover opacity-70"
              />
            </div>
          ))}
        </div>

        {/* Slide Caption */}
        <div className="absolute inset-0 z-20 flex justify-center items-center px-4 text-center h-full">
          <div className="animate-zoom-in max-w-[90%] sm:max-w-[80%]">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold text-[#412818] leading-snug drop-shadow-lg">
              {slides[index].captionMain}
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-[#070706] mt-2 sm:mt-3 drop-shadow-sm">
              {slides[index].captionSub}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPreviousSlide}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-75 transition"
        >
          ❮
        </button>
        <button
          onClick={goToNextSlide}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-75 transition"
        >
          ❯
        </button>
      </div>

      {/* Other Page Sections */}
      <Secondpage />
      <ThirdPage />
      <TopSellingProducts />
      <Blog />
      <Contact />
    </div>
  );
}
