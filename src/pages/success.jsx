import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f4f8",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "3rem 4rem",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "4rem",
            color: "#4BB543", // nice green color
            marginBottom: "1rem",
          }}
          aria-hidden="true"
        >
          ✓
        </div>
        <h1
          style={{
            fontSize: "1.8rem",
            marginBottom: "0.5rem",
            color: "#333",
          }}
        >
          Payment Successful!
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "#666",
            marginBottom: "2rem",
          }}
        >
          Thank you for your purchase. You will be redirected to the homepage shortly.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#4BB543",
            color: "white",
            border: "none",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3da236")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#4BB543")}
        >
          Go to Home Now
        </button>
      </div>
    </div>
  );
}
