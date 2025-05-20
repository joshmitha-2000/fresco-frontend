import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please login");
        setLoading(false);
        return;
      }

      const response = await axios.get("https://frescobackend.onrender.com/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cancel order function
  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to cancel an order.");
      return;
    }

    try {
      // Replace the URL below with your dummy API endpoint for deleting orders
      await axios.delete(`https://frescobackend.onrender.com/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the canceled order from state to update UI immediately
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));

      toast.success("Order canceled successfully!");
    } catch (error) {
      console.error("Error canceling order:", error.response?.data || error.message);
      toast.error("Failed to cancel order. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#fcf8f0] flex items-center justify-center">
        <p className="text-center mt-10 text-gray-700">Loading your orders...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fcf8f0] py-10 px-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-4xl mx-auto mt-10">
        <h1 className="text-xl font-semibold text-[#8B4513] mb-6 tracking-wide">
          Your Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-center mt-10 text-[#A0522D] font-semibold italic">
            No orders found. Go shop something!
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b border-gray-300 pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h2 className="font-semibold text-lg">{order.product.name}</h2>
                    <p>Qty: {order.quantity}</p>
                    <p>Total: ₹{order.amount.toFixed(2)}</p>
                    <p>
                      Status:{" "}
                      <span className="text-green-600 font-medium">{order.status}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    Ordered on {new Date(order.createdAt).toLocaleString()}
                  </div>
                  {/* Cancel Order button */}
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="text-red-600 hover:text-red-800 text-sm cursor-pointer underline"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;