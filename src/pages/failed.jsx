import React from "react";

export default function PaymentFailed() {
  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
      <h1>Payment Failed or Cancelled.</h1>
      <p>Please try again or contact support.</p>
    </div>
  );
}
