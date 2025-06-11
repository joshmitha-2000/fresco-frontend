
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getRandomDeliveryDate = (orderDate) => {
  const minDays = 3;
  const maxDays = 10;
  const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;

  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + randomDays);

  return deliveryDate;
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryDates, setDeliveryDates] = useState({});

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please login");
        setLoading(false);
        return;
      }

      const response = await axios.get("https://frescobackend.onrender.com/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedOrders = response.data || [];

      const datesMap = {};
      fetchedOrders.forEach((order) => {
        datesMap[order.id] = getRandomDeliveryDate(order.createdAt);
      });

      setDeliveryDates(datesMap);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to cancel an order.");
      return;
    }

    try {
      await axios.delete(`https://frescobackend.onrender.com/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders((prev) => prev.filter((order) => order.id !== orderId));
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

  const now = new Date();

  return (
    <div className="min-h-screen bg-[#fcf8f0] py-10 px-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-4xl mx-auto mt-10">
        <h1 className="text-xl font-semibold text-[#8B4513] mb-6 tracking-wide">Your Orders</h1>

        {orders.length === 0 ? (
          <p className="text-center mt-10 text-[#A0522D] font-semibold italic">
            No orders found. Go shop something!
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const deliveryDate = deliveryDates[order.id];
              const delivered = deliveryDate && now >= deliveryDate;

              return (
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
                        <span className={`font-medium ${delivered ? "text-green-700" : "text-yellow-700"}`}>
                          {delivered ? "Successfully shipped" : order.status}
                        </span>
                      </p>
                      <p>
                        Estimated Delivery:{" "}
                        <span className="text-blue-600 font-medium">
                          {deliveryDate ? deliveryDate.toLocaleDateString() : "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      Ordered on {new Date(order.createdAt).toLocaleString()}
                    </div>

                    {/* Cancel button with disabled logic and tooltip */}
                    <button
                      onClick={() => cancelOrder(order.id)}
                      disabled={delivered}
                      title={delivered ? "Cannot cancel after delivery" : "Cancel order"}
                      className={`text-sm cursor-pointer underline ${
                        delivered ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-800"
                      }`}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
