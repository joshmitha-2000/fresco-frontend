

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RQreB08R8ZVzXnqy0IVsfSash9DxsC1Vh1tLJpeb6oGyX1XKToxmUKvGhq4imNCJhnhknqGRggLJFsYnxNseY3B00Fdf5rlWU"
);

function StripePaymentForm({ clientSecret, onSuccess, onFailure }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setErrorMsg("");

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: cardElement },
        }
      );

      if (error) {
        setErrorMsg(error.message);
        setProcessing(false);
        onFailure();
      } else if (paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id);
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
      setProcessing(false);
      onFailure();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6">
      <CardElement
        options={{ hidePostalCode: true }}
        onChange={(event) => {
          if (event.error) {
            setErrorMsg(event.error.message);
          } else {
            setErrorMsg("");
          }
        }}
        className="p-3 border rounded"
      />

      <button
        type="submit"
        disabled={processing || !stripe}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>

      {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
    </form>
  );
}

export default function BuyNowPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  const [quantity, setQuantity] = useState(1);

  // Stage control:
  // 0 = show product details + Confirm Payment button
  // 1 = show only image + payment methods buttons with emojis
  // 2 = payment method selected (show that method form)
  const [stage, setStage] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 text-lg font-semibold">
        No product selected for purchase.
      </div>
    );
  }

  const handleQuantityChange = (e) => {
    const val = Number(e.target.value);
    if (val >= 1) setQuantity(val);
  };

  // Place order API call helper
  const placeOrder = async (paymentMethod, paymentIntentId = null) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("❌ You must be logged in to place an order", {
          position: "top-center",
          autoClose: 3000,
        });
        return false;
      }

      const response = await fetch("https://frescobackend.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          amount: product.price * quantity,
          orderDate: new Date().toISOString(),
          paymentMethod,
          paymentIntentId,
        }),
      });

      if (!response.ok) throw new Error("Failed to place order");
      return true;
    } catch {
      return false;
    }
  };

  // Click Confirm Payment button → show payment methods (stage 1)
  const handleConfirmPaymentClick = () => {
    setStage(1);
  };

  // User selects payment method on stage 1
  const handlePaymentMethodSelect = async (method) => {
    setSelectedPaymentMethod(method);

    if (method === "Pay Online") {
      // Create order and payment intent, then show Stripe form
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("❌ You must be logged in to place an order", {
            position: "top-center",
            autoClose: 3000,
          });
          setSelectedPaymentMethod(null);
          setStage(1);
          return;
        }

        // 1. Create order (initial)
        const orderResponse = await fetch(
          "https://frescobackend.onrender.com/orders",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: product.id,
              quantity,
              amount: product.price * quantity,
              orderDate: new Date().toISOString(),
              paymentMethod: "Pay Online",
              paymentIntentId: null,
            }),
          }
        );

        if (!orderResponse.ok) throw new Error("Failed to create order");
        const orderData = await orderResponse.json();
        const orderId = orderData.id;

        // 2. Request payment intent client secret from backend
        const paymentRes = await fetch(
          "https://frescobackend.onrender.com/payment/create-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ orderId }),
          }
        );

        if (!paymentRes.ok) throw new Error("Failed to create payment intent");

        const paymentData = await paymentRes.json();
        setClientSecret(paymentData.clientSecret);
        setStage(2); // show Stripe form
      } catch (err) {
        toast.error("❌ Payment initiation error: " + err.message, {
          position: "top-center",
          autoClose: 4000,
        });
        setStage(1);
        setSelectedPaymentMethod(null);
      }
    } else if (method === "Cash on Delivery") {
      // For COD, just confirm immediately
      const success = await placeOrder("Cash on Delivery");
      if (success) {
        toast.success("🎉 Order placed successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        setTimeout(() => navigate("/success"), 3500);
      } else {
        toast.error("❌ Order placement failed.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } else {
      // For PhonePe, Google Pay, Paytm: simulate payment delay then confirm order
      toast.info(`Processing ${method} payment...`, {
        position: "top-center",
        autoClose: 2000,
      });
      setStage(2); // show a dummy confirmation screen (or loading)
      setTimeout(async () => {
        const success = await placeOrder(method, "dummy_payment_id");
        if (success) {
          toast.success("🎉 Order placed successfully!", {
            position: "top-center",
            autoClose: 3000,
          });
          setTimeout(() => navigate("/success"), 3500);
        } else {
          toast.error("❌ Order placement failed.", {
            position: "top-center",
            autoClose: 3000,
          });
          setTimeout(() => navigate("/failed"), 3500);
        }
      }, 2000);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    const success = await placeOrder("Pay Online", paymentIntentId);
    if (success) {
      navigate("/success");
    } else {
      navigate("/failed");
    }
  };

  const handlePaymentFailure = () => {
    navigate("/failed");
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full p-6 md:p-10 flex flex-col md:flex-row gap-8">
        {/* Always show product image */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-lg max-w-xs max-h-80 object-contain"
          />
        </div>

        {/* Conditionally render based on stage */}

        {/* Stage 0: Show product details + Confirm Payment button */}
        {stage === 0 && (
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-3">{product.name}</h2>
            <p className="mb-4 text-gray-700">{product.description}</p>

            <p className="text-lg font-semibold mb-3">
              Price: ₹{product.price.toFixed(2)}
            </p>

            <div className="mb-5">
              <label htmlFor="quantity" className="mr-2 font-semibold">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="border border-gray-300 rounded px-2 py-1 w-20"
              />
            </div>

            <p className="text-lg font-medium mb-5">
              Total: ₹{(product.price * quantity).toFixed(2)}
            </p>

            <button
              onClick={handleConfirmPaymentClick}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold w-full max-w-xs"
            >
              Confirm Payment
            </button>
          </div>
        )}

        {/* Stage 1: Show only payment options with emojis (no product details except image) */}
        {stage === 1 && (
          <div className="flex-1 flex flex-col justify-center gap-4 max-w-xs mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Select Payment Method
            </h3>

            <button
              onClick={() => handlePaymentMethodSelect("Cash on Delivery")}
              className="flex items-center gap-3 px-6 py-3 border border-gray-400 rounded hover:bg-gray-100 transition-colors"
            >
              🏠 Cash on Delivery
            </button>

            <button
              onClick={() => handlePaymentMethodSelect("Pay Online")}
              className="flex items-center gap-3 px-6 py-3 border border-gray-400 rounded hover:bg-gray-100 transition-colors"
            >
              💳 Pay Online (Card / Netbanking)
            </button>

            <button
              onClick={() => handlePaymentMethodSelect("PhonePe")}
              className="flex items-center gap-3 px-6 py-3 border border-gray-400 rounded hover:bg-gray-100 transition-colors"
            >
              📱 PhonePe
            </button>

            <button
              onClick={() => handlePaymentMethodSelect("Google Pay")}
              className="flex items-center gap-3 px-6 py-3 border border-gray-400 rounded hover:bg-gray-100 transition-colors"
            >
              🤖 Google Pay
            </button>

            <button
              onClick={() => handlePaymentMethodSelect("Paytm")}
              className="flex items-center gap-3 px-6 py-3 border border-gray-400 rounded hover:bg-gray-100 transition-colors"
            >
              🅿️ Paytm
            </button>

            <button
              onClick={() => setStage(0)}
              className="mt-4 text-sm text-blue-600 underline"
            >
              ← Go back to Product
            </button>
          </div>
        )}

        {/* Stage 2: Stripe form or loading/confirmation for other methods */}
        {stage === 2 && selectedPaymentMethod === "Pay Online" && clientSecret && (
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4 text-center">Enter Card Details</h3>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripePaymentForm
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
              />
            </Elements>
          </div>
        )}

        {stage === 2 &&
          selectedPaymentMethod !== "Pay Online" &&
          selectedPaymentMethod && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-lg font-medium mb-4">
                ✅ {selectedPaymentMethod} payment successful!
              </p>
              <p className="text-gray-600">Redirecting...</p>
            </div>
          )}
      </div>

      <ToastContainer />
    </div>
  );
}
