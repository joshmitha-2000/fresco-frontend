import React from "react";

export default function PaymentFailed() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff5f5",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "3rem 4rem",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(255, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
          color: "#D32F2F",
        }}
      >
        <div
          style={{
            fontSize: "4rem",
            marginBottom: "1rem",
          }}
          aria-hidden="true"
        >
          &#x2716; {/* ✖ cross mark */}
        </div>
        <h1
          style={{
            fontSize: "1.8rem",
            marginBottom: "0.5rem",
          }}
        >
          Payment Failed or Cancelled
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "#7f1d1d",
            marginBottom: "2rem",
          }}
        >
          Please try again or contact support if the problem persists.
        </p>
      </div>
    </div>
  );
}
