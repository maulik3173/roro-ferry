import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const PaymentStatus = () => {
  const location = useLocation();
  const [status, setStatus] = useState('Verifying...');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      // Extract query parameters
      const queryParams = new URLSearchParams(location.search);
      const orderId = queryParams.get('order_id');
      const bookingIds = queryParams.get('booking_ids')?.split(',');

      // Validate parameters
      if (!orderId || !bookingIds || bookingIds.length === 0) {
        setStatus('Invalid Payment Request');
        setError('Missing order ID or booking IDs in the URL.');
        return;
      }

      const bookingId = bookingIds[0];

      try {
        const res = await axios.post('http://localhost:5000/api/payment/verify-payment', {
          bookingId,
        });

        if (res.data?.success) {
          const paymentStatus = res.data.status.toUpperCase(); 
          setStatus(
            paymentStatus === 'SUCCESS'
              ? 'Payment Successful'
              : paymentStatus === 'PENDING'
              ? 'Payment Pending'
              : 'Payment Failed'
          );

          if (paymentStatus === 'SUCCESS') {
            setTimeout(() => {
              navigate('/'); 
            }, 4000);
          } else if (paymentStatus === 'PENDING') {
            setTimeout(() => {
              verifyPayment();
            }, 6000);
          }
        } else {
          setStatus('Payment Verification Failed');
          setError(res.data?.message || 'Unknown error occurred.');
        }
      } catch (error) {
        setStatus('Verification Failed');
        setError(
          error.response?.data?.message || 'Unable to verify payment. Please try again later.'
        );
        console.error('Payment verification error:', error.response?.data || error.message);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  const getStatusIcon = () => {
    if (status.includes('Successful')) {
      return <CheckCircle2 className="mx-auto text-green-500 w-16 h-16 mb-4" />;
    } else if (status.includes('Pending')) {
      return <Clock className="mx-auto text-yellow-500 w-16 h-16 mb-4" />;
    } else {
      return <XCircle className="mx-auto text-red-500 w-16 h-16 mb-4" />;
    }
  };

  const getStatusColor = () => {
    if (status.includes('Successful')) return 'text-green-600';
    if (status.includes('Pending')) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md">
        {getStatusIcon()}
        <h1 className={`text-2xl font-bold mb-2 ${getStatusColor()}`}>Payment Status</h1>
        <p className="text-gray-700 mb-4">{status}</p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {status === 'Payment Successful' && (
          <p className="text-gray-500 text-sm">Redirecting to home in a few seconds...</p>
        )}
        {status === 'Payment Pending' && (
          <p className="text-gray-500 text-sm">Checking status again shortly...</p>
        )}
        {(status === 'Payment Failed' || status === 'Verification Failed') && (
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => navigate('/')}
          >
            Return to Home
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;