import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const FerryCard = ({ ferry, tripType }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [ferryStatus, setFerryStatus] = useState("scheduled");

  useEffect(() => {
    const fetchFerryStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/get-schedule/${ferry._id}`);
        const data = await response.json();
        if (data.success) {
          setFerryStatus(data.status);
        }
      } catch (error) {
        console.error("Error fetching ferry status:", error);
      }
    };

    fetchFerryStatus();
    const interval = setInterval(fetchFerryStatus, 60000);

    return () => clearInterval(interval);
  }, [ferry._id]);

  const handleReserve = () => {

    if (!token) {
      navigate("/login");
    } else {
      console.log("Ferry Data:", ferry);

      if (!ferry || !ferry._id) {
        console.error("Ferry ID is undefined:", ferry);
        return;
      }
      navigate(`/ferry-selection/${ferry.ferry._id}`, { state: { ferry, tripType } });
    }

  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return moment(timeString, "HH:mm").format("hh:mm A");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format("DD-MM-YYYY");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow-md rounded-lg p-5 border border-gray-200">

      {tripType === "departure" && ferry.departureDate && (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-red-600 flex items-center">
              🚢 {ferry?.ferry?.name || "No Name Available"}
            </h2>
            <p className="text-gray-500 text-sm">
              {ferry?.from} ➝ {ferry?.to}
            </p>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-xl font-bold">{formatDate(ferry.departureDate)}</span>
            <span className="text-gray-500 text-sm">Departure Date</span>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-xl font-bold">{formatTime(ferry.arrivalTime)}</span>
            <span className="text-gray-500 text-sm">Arrival Time</span>
          </div>
        </>
      )}

      {tripType === "return" && ferry.returnDate && (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-red-600 flex items-center">
              🚢 {ferry?.ferry?.name || "No Name Available"}
            </h2>
            <p className="text-gray-500 text-sm">
              {ferry?.to} ➝ {ferry?.from}
            </p>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-xl font-bold">{formatDate(ferry.returnDate)}</span>
            <span className="text-gray-500 text-sm">Return Date</span>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-xl font-bold">{formatTime(ferry.returnTime) || "N/A"}</span>
            <span className="text-gray-500 text-sm">Return Time</span>
          </div>
        </>
      )}

      <button
        onClick={handleReserve}
        className={`px-4 py-2 rounded-lg font-medium transition ${(tripType === "departure" && ferry.onwardStatus === "departed") ||
          (tripType === "return" && ferry.returnStatus === "departed") ||
          ferry.availableSeats === 0
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-red-500 text-white hover:bg-red-600"
          }`}
        disabled={
          (tripType === "departure" && ferry.onwardStatus === "departed") ||
          (tripType === "return" && ferry.returnStatus === "departed") ||
          ferry.availableSeats === 0
        }
      >
        {(tripType === "departure" && ferry.onwardStatus === "departed") ||
          (tripType === "return" && ferry.returnStatus === "departed")
          ? "Departed"
          : "Book"}
      </button>

    </div>
  );
};

export default FerryCard;
