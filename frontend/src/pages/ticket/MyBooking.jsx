import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import TopLayout from '../../layout/toppage/TopLayout';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import moment from 'moment';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      toast.error('Please log in to view your bookings.');
      navigate('/login');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/my-bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(res.data)) {
        throw new Error('Unexpected response format.');
      }

      setBookings(res.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch bookings. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      toast.error('Please log in to view your bookings.');
      navigate('/login');
    } else {
      fetchBookings();
    }
  }, [fetchBookings, navigate]);

  const handleRetry = () => {
    fetchBookings();
  };

  const downloadTicket = async (bookingId) => {
    try {
      setDownloadingId(bookingId);
      const token = localStorage.getItem('token');

      const response = await axios.get(`http://localhost:5000/api/ticket/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket_${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to download ticket.');
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full space-y-6 pb-16">
      <TopLayout
        bgimg="https://videos.pexels.com/video-files/3994031/3994031-uhd_2560_1440_30fps.mp4"
        title="My Bookings"
      />
      {loading ? (
        <p className="text-center text-lg">Loading bookings...</p>
      ) : error ? (
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button onClick={handleRetry} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
            Retry
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-6 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {booking.ferryId?.name || 'Unknown Ferry'}
              </h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Seat:</span> {booking.seatNumber || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">From:</span> {booking.scheduleId?.from || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">To:</span> {booking.scheduleId?.to || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Trip Type:</span> {booking.scheduleId?.tripType || 'N/A'}
                </p>
                {booking.scheduleId?.tripType === 'one-way' ? (
                  <>
                    <p>
                      <span className="font-medium">Departure Date:</span>{' '}
                      {booking.scheduleId?.departureDate
                        ? new Date(booking.scheduleId.departureDate).toLocaleDateString('en-IN')
                        : 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Arrival Time:</span>{' '}
                      {booking.scheduleId?.arrivalTime
                        ? moment(booking.scheduleId.arrivalTime, 'HH:mm').format('hh:mm A')
                        : 'N/A'}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <span className="font-medium">Return Date:</span>{' '}
                      {booking.scheduleId?.returnDate
                        ? new Date(booking.scheduleId.returnDate).toLocaleDateString('en-IN')
                        : 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Return Time:</span>{' '}
                      {booking.scheduleId?.returnTime
                        ? moment(booking.scheduleId.returnTime, 'HH:mm').format('hh:mm A')
                        : 'N/A'}
                    </p>
                  </>
                )}
                <p>
                  <span className="font-medium">Total:</span> ₹{booking.totalAmount || 0}
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => downloadTicket(booking._id)}
                  className="w-full mt-6 bg-gradient-to-r from-sky-300 to-sky-400 hover:from-sky-400 hover:to-sky-500 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                  disabled={downloadingId === booking._id}
                >
                  {downloadingId === booking._id ? 'Downloading...' : 'Download E-Ticket'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;