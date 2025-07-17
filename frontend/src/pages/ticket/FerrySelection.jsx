import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TopLayout from "../../layout/toppage/TopLayout";
import { FaCar, FaMotorcycle, FaUser, FaBus } from "react-icons/fa";
import toast from "react-hot-toast";

const FerrySelection = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ferry, setFerry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [selectedSeatsByClass, setSelectedSeatsByClass] = useState({});
  const [bookedSeats, setBookedSeats] = useState([]);

  const categoryIcons = {
    Car: <FaCar />,
    Bike: <FaMotorcycle />,
    Passenger: <FaUser />,
    Bus: <FaBus />,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ferryResponse = await axios.get(`http://localhost:5000/api/ferry/${id}`);
        
        const bookedSeatsResponse = await axios.get(`http://localhost:5000/api/booked-seats/${id}`);

        const ferryData = ferryResponse.data.data;
        setFerry(ferryData);
        setBookedSeats(bookedSeatsResponse.data.bookedSeats || []);

        const defaultCategory = ferryData.categories.find(cat => cat.name === "Passenger") || ferryData.categories[0];
        const defaultClass = ferryData.classes.find(cls => cls.name === "Executive") || ferryData.classes[0];

        setSelectedCategory([defaultCategory]);
        setActiveClass(defaultClass);
      } catch (err) {
        setError("Failed to fetch ferry details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSeatSelection = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeatsByClass(prev => {
      const seatsForClass = prev[activeClass.name] || [];
      const updatedSeats = seatsForClass.includes(seatId)
        ? seatsForClass.filter(s => s !== seatId)
        : [...seatsForClass, seatId];
      return {
        ...prev,
        [activeClass.name]: updatedSeats,
      };
    });
  };

  const handleBooking = async () => {
    if (selectedCategory.some(cat => cat.name === "Passenger") && !Object.values(selectedSeatsByClass).flat().length) {
      toast.error("Please select at least one seat for Passenger category.");
      return;
    }

    navigate("/passenger-details", {
      state: {
        ferry,
        selectedCategory,
        selectedSeatsByClass,
        totalAmount,
      },
    });
  };

  if (loading) return <p>Loading ferry details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const isPassengerSelected = selectedCategory.some(cat => cat.name === "Passenger");

  const categoryFare = selectedCategory.reduce((acc, cat) => {
    if (cat.name === "Passenger") return acc;
    return acc + (cat.price || 0);
  }, 0);
  
  const seatPrice = ferry?.classes?.reduce((acc, cls) => {
    const seats = selectedSeatsByClass[cls.name] || [];
    return acc + seats.length * cls.price;
  }, 0) || 0;

  const totalAmount = categoryFare + seatPrice;

  return (
    <div className="w-full space-y-6 pb-16">
      <TopLayout
        bgimg="https://videos.pexels.com/video-files/3994031/3994031-uhd_2560_1440_30fps.mp4"
        title="Ferry Selection"
      />
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <h2 className="text-lg font-semibold">
            {ferry.name} ➤ {ferry.ferryCode} <br />
          </h2>
          <label className="block font-medium">Select Category</label>
          <div className="flex gap-4 mt-2">
            {ferry.categories.map((category) => {
              const isSelected = selectedCategory.some((cat) => cat.name === category.name);
              return (
                <button
                  key={category.name}
                  className={`p-3 rounded-lg ${isSelected ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() =>
                    setSelectedCategory((prev) =>
                      isSelected
                        ? prev.filter((cat) => cat.name !== category.name)
                        : [...prev, category]
                    )
                  }
                >
                  {categoryIcons[category.name]}
                </button>
              );
            })}
          </div>
          {isPassengerSelected && (
            <>
              <label className="block font-medium mt-4">Choose Travel Class</label>
              <div className="flex items-center gap-2 mt-2 overflow-x-auto">
                {ferry.classes.map((cls) => (
                  <button
                    key={cls.name}
                    className={`px-4 py-2 rounded-lg ${activeClass?.name === cls.name ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveClass(cls)}
                  >
                    {cls.name}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium">Select Seats for {activeClass?.name}</label>
                <div className="flex gap-2 mt-2">
                  {activeClass?.seats && activeClass.seats.length > 0 ? (
                    activeClass.seats.map(seat => (
                      <button
                        key={seat._id}
                        className={`p-3 rounded-lg ${seat.isBooked
                          ? "bg-gray-500 text-white cursor-not-allowed"
                          : (selectedSeatsByClass[activeClass.name] || []).includes(seat._id)
                            ? "bg-green-500 text-white"
                            : "bg-blue-200"
                          }`}
                        onClick={() => handleSeatSelection(seat._id)}
                        disabled={seat.isBooked}
                      >
                        👤<br />
                        {seat.seatNumber}
                      </button>
                    ))
                  ) : (
                    <p className="text-red-500">No seats available for this class</p>
                  )}
                </div>
              </div>
              <h3 className="mt-4 font-semibold">
                Selected Seats: {Object.values(selectedSeatsByClass).flat().length} 
                {Object.keys(selectedSeatsByClass).length > 0 && (
                  <span>
                    ({Object.entries(selectedSeatsByClass).map(([cls, seats]) => `${cls}: ${seats.length}`).join(", ")})
                  </span>
                )}
              </h3>
            </>
          )}
        </div>
        <div className="p-6 bg-gray-100 rounded-lg w-full md:w-1/3">
          <h3 className="font-semibold text-lg">Booking Summary</h3>
          <div className="mt-4 space-y-2">
            {isPassengerSelected && Object.entries(selectedSeatsByClass).map(([className, seats]) => (
              seats.length > 0 && (
                <p key={className} className="flex justify-between">
                  <span>
                    {className} x {seats.length} (₹
                    {ferry.classes.find(cls => cls.name === className)?.price || 0} each)
                  </span>
                  <span>₹{(seats.length * (ferry.classes.find(cls => cls.name === className)?.price || 0))}</span>
                </p>
              )
            ))}
            {selectedCategory.map((cat, idx) => (
              cat.name !== "Passenger" && (
                <p key={idx} className="flex justify-between">
                  <span>{cat.name} Charge:</span> <span>₹{cat.price || 0}</span>
                </p>
              )
            ))}
            <p className="font-bold flex justify-between">
              <span>Total Amount:</span> <span>₹{totalAmount}</span>
            </p>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleBooking}
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FerrySelection;