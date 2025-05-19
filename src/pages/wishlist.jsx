import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [tooltipVisibleId, setTooltipVisibleId] = useState(null);

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userId");

  useEffect(() => {
    if (!token) return; // Don't fetch if no token

    fetch("http://localhost:3000/wishlist", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch wishlist");
        return res.json();
      })
      .then((data) => setWishlist(data))
      .catch((err) => console.error(err));
  }, [token]);

  const removeFromWishlist = async (productId) => {
    try {
      const res = await fetch(`http://localhost:3000/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete item");

      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error(error);
      alert("Could not remove item from wishlist.");
    }
  };

  const addToCart = async (productId) => {
    setLoadingCart(true);
    try {
      await axios.post(
        `http://localhost:3000/cart/${userid}`,
        { productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTooltipVisibleId(productId);
      setTimeout(() => setTooltipVisibleId(null), 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setLoadingCart(false);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-[#f5f5dc] text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1170/1170576.png"
          alt="Empty Favorites"
          className="w-24 h-24 mb-6 opacity-30"
        />
        <h2 className="text-3xl font-semibold text-gray-700 mb-3">
          Your Favorites List is Empty
        </h2>
        <p className="text-gray-500 max-w-xs mb-8">
          Add products you love and find them here easily later.
        </p>
        <a
          href="/products"
          className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-700 transition"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5dc] py-12 px-6">
      <h1 className="text-5xl mt-10 font-extrabold text-yellow-900 mb-5 text-center tracking-wider font-serif drop-shadow-lg">
        Favorites
      </h1>

      <div className="max-w-5xl mx-auto space-y-4">
        {wishlist.map(({ productId, product }) => (
          <div
            key={productId}
            className="flex items-center bg-[#f8f8dd] bg-opacity-20 rounded-lg shadow p-1 space-x-6 text-amber-950"
          >
            {/* Clickable image linking to product details */}
            <Link to={`/product/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-md border border-gray-400"
                loading="lazy"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <div className="mb-2" /> {/* spacer */}
              <h2 className="text-xl font-semibold truncate text-yellow-900">
                {product.name}
              </h2>
              <p className="font-bold text-lg mt-1 text-yellow-800">₹{product.price}</p>
            </div>

            {/* Add to Cart button */}
            <div className="relative">
              <button
                onClick={() => addToCart(productId)}
                disabled={loadingCart}
                className={`p-2 rounded hover:bg-green-100 transition mr-2 ${
                  loadingCart ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label="Add to cart"
                title="Add to cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293 1.293a1 1 0 00.707 1.707h12.586a1 1 0 00.707-1.707L17 13M7 13V6h10v7"
                  />
                </svg>
              </button>
              {tooltipVisibleId === productId && (
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-green-200 text-green-900 text-xs rounded px-2 py-1 shadow">
                  Added to cart!
                </span>
              )}
            </div>

            {/* Remove from Wishlist button */}
            <button
              onClick={() => removeFromWishlist(productId)}
              className="p-2 rounded hover:bg-red-100 transition"
              aria-label="Remove from favorites"
              title="Remove from wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;