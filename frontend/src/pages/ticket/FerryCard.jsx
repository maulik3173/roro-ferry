import React from "react";
import { useNavigate } from "react-router-dom";

const FerryCard = ({ ferry }) => {
  const navigate = useNavigate();

  const handleReserve = () => {
    navigate(`/ferry-selection/${ferry.id}`, { state: { ferry } });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow-md rounded-lg p-5 border border-gray-200">
      {/* Ferry Name */}
      
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-red-600 flex items-center">
          🚢 {ferry.name}
        </h2>
        <p className="text-gray-500 text-sm">{ferry.from} ➝ {ferry.to}</p>
      </div>

      {/* Departure and Arrival */}
      <div className="flex flex-col text-center">
        <span className="text-xl font-bold">{ferry.departureTime}</span>
        <span className="text-gray-500 text-sm">Departure</span>
      </div>

      <div className="flex flex-col text-center">
        <span className="text-xl font-bold">{ferry.arrivalTime}</span>
        <span className="text-gray-500 text-sm">Arrival</span>
      </div>

      {/* Pricing & Seats */}
      <div className="flex flex-col text-center">
        <span className="text-lg font-bold text-gray-700">Rs. {ferry.price} /seat</span>
        <span className={`text-sm font-semibold ${ferry.availableSeats > 0 ? "text-green-500" : "text-red-500"}`}>
          {ferry.availableSeats} seats available
        </span>
      </div>

      {/* Reserve Button */}
      <button
        onClick={handleReserve}
        className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
        disabled={ferry.availableSeats === 0}
      >
        {ferry.availableSeats > 0 ? "Reserve Seat" : "Sold Out"}
      </button>
    </div>
  );
};

export default FerryCard;
