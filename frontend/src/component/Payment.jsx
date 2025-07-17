import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';

const Payment = () => {
  const [ferryId] = useState('ferry_123');
  const [amount] = useState(100);
  const [userId] = useState('user_123');
  const [cashfree, setCashfree] = useState(null);

  useEffect(() => {
    const initializeSDK = async () => {
      const cf = await load({ mode: 'sandbox' });
      setCashfree(cf);
    };
    initializeSDK();
  }, []);

  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/payment/create-order', {
        userId,
        ferryId,
        amount,
      });
      const { paymentSessionId } = response.data;

      if (cashfree) {
        const checkoutOptions = {
          paymentSessionId,
          redirectTarget: '_self',
        };
        cashfree.checkout(checkoutOptions);
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  return (
    <div>
       <br></br>
      <br></br>
       <br></br>
      <br></br>
      <h2>Book Ferry Ticket</h2>
      <p>Ferry ID: {ferryId}</p>
      <p>Amount: ₹{amount}</p>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default Payment;