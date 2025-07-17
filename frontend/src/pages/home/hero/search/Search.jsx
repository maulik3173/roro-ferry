import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TbArrowsExchange } from "react-icons/tb";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Search = ({ onSearch }) => {
  const [tripType, setTripType] = useState("oneway");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split("T")[0]);
  const [returnDate, setReturnDate] = useState("");
  const [fromLocations, setFromLocations] = useState([]);
  const [toLocations, setToLocations] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchFromLocations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/from-locations");
      const data = await response.json();
      setFromLocations(data.locations);
    } catch (error) {
      console.error("Error fetching from locations:", error);
    }
  };

  const fetchToLocations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/to-locations");
      const data = await response.json();
      setToLocations(data.locations);
    } catch (error) {
      console.error("Error fetching to locations:", error);
    }
  };

  useEffect(() => {
    fetchFromLocations();
    fetchToLocations();

    // Load saved search data after login, but do not trigger search
    const savedSearchData = localStorage.getItem("searchData");
    if (savedSearchData && token) {
      const { from, to, tripType, departureDate, returnDate } = JSON.parse(savedSearchData);
      setFrom(from);
      setTo(to);
      setTripType(tripType);
      setDepartureDate(departureDate);
      setReturnDate(returnDate);
      // Remove saved search data after loading
      localStorage.removeItem("searchData");
    }
  }, [token]);

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    if (!from || !to) {
      toast.error("Please select valid locations.");
      return;
    }
    if (!departureDate) {
      toast.error("Please select a departure date.");
      return;
    }
    if (tripType === "round" && !returnDate) {
      toast.error("Please select a return date for round-trip.");
      return;
    }

    const searchData = {
      from,
      to,
      tripType,
      departureDate,
      returnDate,
    };

    localStorage.setItem("searchData", JSON.stringify(searchData));

    onSearch(from, to, tripType === "oneway" ? "one-way" : "round-trip", departureDate, returnDate);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -900 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -800 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="w-full bg-white shadow-lg p-4 md:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-5"
    >
      {/* Trip Type Selector */}
      <div className="flex flex-col items-start gap-2 text-sm md:text-lg font-medium">
        <label className="flex items-center gap-2 cursor-pointer text-blue-500 font-bold">
          <input type="radio" name="tripType" checked={tripType === "oneway"} onChange={() => setTripType("oneway")} /> One way
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-gray-500">
          <input type="radio" name="tripType" checked={tripType === "round"} onChange={() => setTripType("round")} /> Round Trip
        </label>
      </div>

      {/* From & To Input Fields */}
      <div className="flex items-center gap-3 md:gap-5 text-center">
        <div className="flex flex-col items-center">
          <p className="text-blue-500 text-xs md:text-sm font-bold">FROM</p>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            list="from-locations"
            className="text-base md:text-2xl font-bold bg-transparent border border-neutral-300 p-2 rounded-lg text-center w-full"
          />
          <datalist id="from-locations">
            {fromLocations.map((location, index) => (
              <option key={index} value={location} />
            ))}
          </datalist>
          <p className="text-gray-500 text-xs md:text-sm">RORO TERMINAL</p>
        </div>

        <button onClick={swapLocations} className="bg-blue-100 p-2 rounded-full border border-blue-500">
          <TbArrowsExchange className="text-blue-500 text-lg md:text-2xl" />
        </button>

        <div className="flex flex-col items-center">
          <p className="text-blue-500 text-xs md:text-sm font-bold">TO</p>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            list="to-locations"
            className="text-base md:text-2xl font-bold bg-transparent border border-neutral-300 p-2 rounded-lg text-center w-full"
          />
          <datalist id="to-locations">
            {toLocations.map((location, index) => (
              <option key={index} value={location} />
            ))}
          </datalist>
          <p className="text-gray-500 text-xs md:text-sm">RORO TERMINAL</p>
        </div>
      </div>

      {/* Departure Date */}
      <div className="flex flex-col items-center">
        <p className="text-blue-500 text-xs md:text-sm font-bold">DEPARTURE</p>
        <input
          type="date"
          className="bg-transparent text-sm md:text-xl border border-neutral-300 p-2 rounded-lg text-center w-full"
          value={departureDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
      </div>

      {/* Return Date */}
      {tripType === "round" ? (
        <div className="flex flex-col items-center">
          <p className="text-blue-500 text-xs md:text-sm font-bold">RETURN</p>
          <input
            type="date"
            className="bg-transparent text-sm md:text-xl border border-neutral-300 p-2 rounded-lg text-center w-full"
            value={returnDate}
            min={departureDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>
      ) : (
        <div className="text-gray-400 flex flex-col items-center">
          <p className="text-xs md:text-sm font-bold">RETURN</p>
          <p className="text-xs md:text-sm">Tap Round trip to add a return date.</p>
        </div>
      )}

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="text-xl w-32 h-12 rounded-xl bg-blue-500 text-white relative overflow-hidden group z-10 hover:text-white duration-1000"
      >
        SEARCH
      </button>
    </motion.div>
  );
};

export default Search;