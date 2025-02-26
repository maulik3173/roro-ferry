import React, { useState } from 'react';
import { motion } from "framer-motion";
import { TbArrowsExchange } from "react-icons/tb";

const Search = () => {
  const [tripType, setTripType] = useState("oneway");
  const [from, setFrom] = useState("HAZIRA");
  const [to, setTo] = useState("GHOGHA");
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split("T")[0]);
  const [returnDate, setReturnDate] = useState("");

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  const handleFromChange = (e) => {
    const newFrom = e.target.value;
    if (newFrom !== to) {
      setFrom(newFrom);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -900 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -800 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="w-full bg-white shadow-lg p-4 md:p-5  rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-5"
    >
      {/* Trip Type Selection */}
      <div className="flex flex-col items-start gap-2 text-sm md:text-lg font-medium">
        <label className="flex items-center gap-2 cursor-pointer text-blue-500 font-bold">
          <input 
            type="radio" 
            name="tripType" 
            checked={tripType === "oneway"} 
            onChange={() => setTripType("oneway")} 
          /> One way
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-gray-500">
          <input 
            type="radio" 
            name="tripType" 
            checked={tripType === "round"} 
            onChange={() => setTripType("round")} 
          /> Round Trip
        </label>
      </div>

      {/* From and To input section */}
      <div className="flex items-center gap-3 md:gap-5 text-center">
        <div className="flex flex-col items-center">
          <p className="text-blue-500 text-xs md:text-sm font-bold">FROM</p>
          <select 
            value={from} 
            onChange={handleFromChange}
            className="text-base md:text-2xl font-bold bg-transparent border border-neutral-300 p-2 rounded-lg text-center w-full"
          >
            <option value="HAZIRA">HAZIRA</option>
            <option value="GHOGHA">GHOGHA</option>
            <option value="DAHEJ">DAHEJ</option>
          </select>
          <p className="text-gray-500 text-xs md:text-sm">RORO TERMINAL</p>
        </div>

        <button onClick={swapLocations} className="bg-blue-100 p-2 rounded-full border border-blue-500">
          <TbArrowsExchange className="text-blue-500 text-lg md:text-2xl" />
        </button>

        <div className="flex flex-col items-center">
          <p className="text-blue-500 text-xs md:text-sm font-bold">TO</p>
          <h2 className="text-base md:text-2xl font-bold">{to}</h2>
          <p className="text-gray-500 text-xs md:text-sm">RORO TERMINAL</p>
        </div>
      </div>

      {/* Date Pickers */}
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
      
      {tripType === "round" ? (
        <div className="flex flex-col items-center">
          <p className="text-blue-500 text-xs md:text-sm font-bold">RETURN</p>
          <input 
            type="date" 
            className="bg-transparent text-sm md:text-xl border border-neutral-300 p-2 rounded-lg text-center w-full" 
            value={returnDate}
            min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]}
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
  class="text-xl w-32 h-12 rounded-xl bg-blue-500 text-white relative overflow-hidden group z-10 hover:text-white duration-1000"
>
  <span
    class="absolute bg-blue-600 w-36 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"
  ></span>
  <span
    class="absolute bg-blue-800 w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"
  ></span>
  Button
</button>

    </motion.div>
  );
}

export default Search;
