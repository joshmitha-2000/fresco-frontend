import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import RecommendedProducts from "../components/recommanded";
import { FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");

  const [showToast, setShowToast] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch product details
  useEffect(() => {
    axios
      .get(`https://frescobackend.onrender.com/products/${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Failed to fetch product:", err));
  }, [productId]);

  // Fetch wishlist and check if product is wishlisted
  useEffect(() => {
    if (!token) return;
    axios
      .get("https://frescobackend.onrender.com/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setWishlist(res.data);
        const wishlisted = res.data.some(
          (item) =>
            item.id === Number(productId) || item.productId === Number(productId)
        );
        setIsWishlisted(wishlisted);
      })
      .catch((err) => console.error("Failed to fetch wishlist:", err));
  }, [productId, token]);

  // Fetch product reviews
  useEffect(() => {
    axios
      .get(`https://frescobackend.onrender.com/api/reviews/${productId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Failed to fetch reviews:", err));
  }, [productId]);

  // Wishlist toggle handler
  const toggleWishlist = () => {
    if (!token) return alert("Please login to add to wishlist.");
    if (isWishlisted) {
      axios
        .delete(`https://frescobackend.onrender.com/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setIsWishlisted(false);
          setWishlist((prev) =>
            prev.filter((item) => item.productId !== Number(productId))
          );
        })
        .catch((err) => console.error("Failed to remove from wishlist:", err));
    } else {
      axios
        .post(
          "https://frescobackend.onrender.com/wishlist",
          { productId: Number(productId) },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          setIsWishlisted(true);
          setWishlist((prev) => [...prev, { productId: Number(productId) }]);
        })
        .catch((err) => console.error("Failed to add to wishlist:", err));
    }
  };
  const addToCart = async () => {
    const userId = localStorage.getItem("userId"); // Get userId from localStorage or decode token
    if (!userId) return alert("User not logged in.");
  
    // Prepare cart data to send
    const cartItem = {
      productId: product.id,
      quantity: 1,
      productName: product.name,
      price: product.price,
    };
  
    try {
      // Send POST request to backend to add product to cart for the user
      await axios.post(
        `https://frescobackend.onrender.com/cart/${userId}`,
        cartItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Update local cart for immediate UI feedback
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const productInCart = cart.find((item) => item.productId === product.id);
      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.push(cartItem);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
  
      // Show toast popup
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };
  

  // Navigate to Buy Now page with product state
  const handleBuyNow = () => {
    navigate("/buynowpage", { state: { product } });
  };

  // Submit a review handler
  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in to submit a review.");
    if (!username.trim()) return alert("Please enter your name.");
    if (!comment.trim()) return alert("Please enter your comment.");

    try {
      const res = await axios.post(
        `https://frescobackend.onrender.com/api/reviews`,
        {
          productId: Number(productId),
          username: username.trim(),
          rating: parseInt(rating),
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews((prev) => [res.data, ...prev]);
      setUsername("");
      setRating(5);
      setComment("");
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  if (!product)
    return (
      <p className="pt-10 text-center text-gray-500 italic">
        Loading product details...
      </p>
    );

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 1);

  return (
    <>
      {/* Product Info */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 bg-[#fcf8f0] rounded-lg shadow">
        <div className="relative flex justify-center items-center">
          <motion.img
            onClick={() => setShowModal(true)}
            src={product.image}
            alt={product.name}
            className="w-full max-w-md rounded-xl shadow-lg object-cover cursor-pointer transition-transform hover:scale-105"
          />
          <button
            onClick={toggleWishlist}
            className={`absolute top-4 right-4 text-2xl ${
              isWishlisted ? "text-red-600" : "text-gray-400"
            }`}
          >
            <FaHeart />
          </button>
        </div>

        <div className="space-y-4 text-gray-800 relative">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-xl font-semibold text-green-600">₹{product.price}</p>
          <p className="text-yellow-500 text-lg">⭐ {product.rating || "4.3"}</p>
          <p className="text-sm text-gray-500">In stock: {product.stock}</p>

          <div className="flex gap-4 mt-6 relative">
            <button
              onClick={addToCart}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition relative"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Buy Now
            </button>

            {/* Toast popup */}
            {showToast && (
              <div className="absolute top-[-40px] left-0 right-0 mx-auto w-max px-4 py-2 bg-green-600 text-white rounded shadow-lg text-center text-sm pointer-events-none select-none z-10">
                Added to cart!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for zoomed image */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setShowModal(false)}
        >
          <img
            src={product.image}
            alt="Zoomed"
            className="w-[90%] max-w-xl rounded-xl shadow-lg"
          />
        </div>
      )}

      {/* Recommended Products */}
      <RecommendedProducts
        category={product.category}
        currentProductId={product.id}
      />

      {/* Reviews Section */}
      <div className="max-w-4xl mx-auto mt-16 px-6 py-10 bg-[#f9fafb] rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Customer Reviews</h2>

        {token ? (
          <form
            onSubmit={submitReview}
            className="bg-white p-6 rounded-lg shadow-sm space-y-4 mb-10 border border-gray-200"
          >
            <div>
              <label className="block mb-1 font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none"
              ></textarea>
            </div>
            <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
            Submit Review
            </button>
            </form>
            ) : (
            <p className="text-center italic text-gray-500 mb-10">
            Please log in to submit a review.
            </p>
            )}
                {displayedReviews.length > 0 ? (
      displayedReviews.map((review) => (
        <div
          key={review.id}
          className="mb-6 bg-white p-4 rounded shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <p className="font-semibold">{review.username}</p>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) =>
                i < review.rating ? (
                  <FaStar key={i} />
                ) : (
                  <FaRegStar key={i} />
                )
              )}
            </div>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))
    ) : (
      <p className="text-gray-500 italic">No reviews yet.</p>
    )}

    {reviews.length > 1 && (
      <button
        onClick={() => setShowAllReviews(!showAllReviews)}
        className="text-blue-600 underline mt-4"
      >
        {showAllReviews ? "Show Less" : "Show All Reviews"}
      </button>
    )}
  </div>
</>
  );
}