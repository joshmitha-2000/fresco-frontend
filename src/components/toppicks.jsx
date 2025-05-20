import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function TopSellingProducts() {
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://frescobackend.onrender.com/products") // your backend API URL
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        const filtered = data.filter((product) => product.id >= 23 && product.id <= 28);
        setProducts(filtered);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === "left") {
      current.scrollBy({ left: -300, behavior: "smooth" });
    } else {
      current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleReadMore = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="bg-[#f5f5dc] py-8 px-6 relative">
      <h2 className="text-3xl text-center font-bold text-[#4e342e] mb-13">
        Top Selling Products
      </h2>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-[#4e342e] text-white rounded-full shadow hover:bg-[#3e2723]"
        >
          <FaArrowLeft />
        </button>

        {/* Scrollable product container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 scroll-smooth scrollbar-hide px-10"
        >
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="relative group w-60 shrink-0 rounded-lg overflow-hidden shadow-lg bg-white"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-72 transition-transform duration-300 group-hover:scale-105"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#4e342e]/90 text-white opacity-0 group-hover:opacity-100 transition duration-300 p-4 flex flex-col justify-center items-center text-center">
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm mb-2">
                    {product.description.length > 100
                      ? `${product.description.slice(0, 100)}... `
                      : product.description}
                    {product.description.length > 100 && (
                      <button
                        onClick={() => handleReadMore(product.id)}
                        className="text-yellow-300 underline ml-1"
                      >
                        Read More
                      </button>
                    )}
                  </p>
                  <p className="font-bold">{product.price}</p>
                  <p>⭐ {product.rating}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 w-full">Loading products...</p>
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-[#4e342e] text-white rounded-full shadow hover:bg-[#3e2723]"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}