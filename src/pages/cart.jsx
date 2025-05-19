import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Skeleton from "../components/skeleton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:3000/cart";

const getAxiosInstance = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};

export default function Cart() {
  const [cart, setCart] = useState([]);
  const userId = localStorage.getItem("userId") || 1;
  const [loading, setLoading] = useState(true);
  const [paymentOption, setPaymentOption] = useState("cash");
  const axiosInstance = getAxiosInstance();
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (productId, quantity) => {
    try {
      await axiosInstance.put(`/${userId}/${productId}`, { quantity });
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err.response?.data || err.message);
    }
  };

  const increment = (productId, currentQty) => updateQuantity(productId, currentQty + 1);
  const decrement = (productId, currentQty) => {
    if (currentQty <= 1) return;
    updateQuantity(productId, currentQty - 1);
  };

  const removeItem = async (productId) => {
    try {
      await axiosInstance.delete(`/${userId}/${productId}`);
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err.response?.data || err.message);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  const handleImageClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    if (!token || !userId) {
      toast.error("You must be logged in to checkout.");
      return;
    }

    try {
      for (const item of cart) {
        await axios.post(
          "http://localhost:3000/orders",
          {
            userId: parseInt(userId),
            productId: item.productId,
            quantity: item.quantity,
            amount: item.product.price * item.quantity,
            status: "paid",
            paymentMethod: paymentOption,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success("🎉 Order placed successfully!");

      // Navigate to orders page after a short delay
      setTimeout(() => {
        navigate("/orders");
      }, 2500);
    } catch (error) {
      console.error("Checkout error:", error.response?.data || error.message);
      toast.error("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5dc]">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8 mt-5">
        {/* Cart Items */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mt-10 mb-6">Shopping Cart</h2>
          {loading ? (
            <>
              <Skeleton />
              <Skeleton />
            </>
          ) : cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center border bg-[#f7f7d6cb] border-gray-200 rounded-lg p-4"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-md cursor-pointer"
                    onClick={() => handleImageClick(item.productId)}
                  />
                  <div className="flex-1 ml-6">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm">{item.product.description}</p>
                    <div className="mt-3 flex items-center space-x-4">
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <button
                          onClick={() => decrement(item.productId, item.quantity)}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          onClick={() => increment(item.productId, item.quantity)}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="ml-6 font-semibold text-lg">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {!loading && (
          <div className="w-full md:w-96 bg-[#f7f7d6cb] p-6 rounded-lg shadow-md mt-24 h-min">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-4 flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            {/* Payment Option */}
            <div className="mb-4 space-y-2">
              <label className="block font-semibold">Choose Payment Method:</label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentOption === "online"}
                  onChange={() => setPaymentOption("online")}
                />
                <span>Pay Online</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentOption === "cash"}
                  onChange={() => setPaymentOption("cash")}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-3 text-white rounded-md ${
                cart.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-950 hover:bg-amber-700"
              } transition`}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}