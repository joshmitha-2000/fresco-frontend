import React, { useState } from 'react';

export default function CreatePaymentIntent() {
  const [orderId, setOrderId] = useState('40'); // Change this as needed
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Replace with your actual backend URL
  const BACKEND_URL = 'https://frescobackend.onrender.com/create-intent';

  // Replace with how you get the auth token (e.g., from localStorage)
  const authToken = localStorage.getItem("token");// truncated, put full token here

  async function handleCreatePaymentIntent() {
    setLoading(true);
    setError('');
    setClientSecret('');

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '20px auto', padding: 20, border: '1px solid #ccc' }}>
      <h2>Create Payment Intent</h2>

      <label>
        Order ID:{' '}
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      </label>

      <button onClick={handleCreatePaymentIntent} disabled={loading} style={{ padding: '10px 20px' }}>
        {loading ? 'Processing...' : 'Create Payment Intent'}
      </button>

      {clientSecret && (
        <div style={{ marginTop: 20 }}>
          <strong>Client Secret:</strong>
          <pre>{clientSecret}</pre>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 20, color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
