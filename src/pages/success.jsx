import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [message, setMessage] = useState("Verifying payment...");
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) {
      setMessage("Invalid session ID. Redirecting...");
      setTimeout(() => navigate("/payment-failed"), 3000);
      return;
    }

    async function verifyPayment() {
      try {
        const res = await fetch(
          `https://frescobackend.onrender.com/payment/verify?sessionId=${sessionId}`
        );
        const data = await res.json();

        if (data.status === "paid") {
          setMessage("Payment successful! Redirecting to home...");
          setTimeout(() => navigate("/"), 4000);
        } else {
          setMessage("Payment verification failed. Redirecting...");
          setTimeout(() => navigate("/payment-failed"), 3000);
        }
      } catch {
        setMessage("Error verifying payment. Redirecting...");
        setTimeout(() => navigate("/payment-failed"), 3000);
      }
    }

    verifyPayment();
  }, [sessionId, navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{message}</h1>
    </div>
  );
}
