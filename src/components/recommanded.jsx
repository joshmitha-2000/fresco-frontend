import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RecommendedProducts = ({ category, currentProductId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category) return;

    axios
      .get(`http://localhost:3000/products?category=${category}`)
      .then((res) => {
        const filtered = res.data.filter((p) => p.id !== currentProductId);
        setProducts(filtered.slice(0, 5));
      })
      .catch((err) => console.error("Failed to fetch recommended products:", err));
  }, [category, currentProductId]);

  if (products.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto mt-14 px-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group flex flex-col items-center text-center hover:shadow-lg rounded-md p-2 transition-shadow duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-28 h-28 object-contain rounded-md mb-3"
              loading="lazy"
            />
            <h3 className="text-sm font-medium text-gray-800 group-hover:text-green-700">
              {product.name}
            </h3>
            <p className="text-green-600 font-semibold mt-1">₹{product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;