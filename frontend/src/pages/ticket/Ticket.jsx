import React, { useState } from "react";
import axios from "axios";
import TopLayout from "../../layout/toppage/TopLayout";
import RootLayout from "../../layout/RootLayout";
import { motion } from "framer-motion";
import Search from "../home/hero/search/Search";
import FerryCard from "./FerryCard";

const Ticket = () => {
  const [ferries, setFerries] = useState([]);
  const [returnFerries, setReturnFerries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (from, to, tripType, departureDate, returnDate) => {
    try {
      setLoading(true);
      setError("");
      setFerries([]);
      setReturnFerries([]);
      

      let url = `http://localhost:5000/api/one-way?from=${from}&to=${to}&departureDate=${departureDate}`;

      if (tripType === "round-trip") {
        url = `http://localhost:5000/api/round-trip?from=${from}&to=${to}&returnDate=${returnDate}`;
      }

      console.log("Fetching URL:", url);

      const response = await axios.get(url);
      console.log("API Response:", response.data);

      if (response.status === 404) {
        setError("No ferries found for the selected route.");
        return;
      }

      if (tripType === "round-trip") {
        setFerries(response.data.departureTrips || []);
        setReturnFerries(response.data.returnTrips || []);
      } else {
        setFerries(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching ferries:", err.response ? err.response.data : err);
      setError("No ferries found for the selected route.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-12 pb-16">
      <TopLayout
        bgimg="https://videos.pexels.com/video-files/3994031/3994031-uhd_2560_1440_30fps.mp4"
        title="Reserve Your Ticket"
      />
      <RootLayout className="space-y-12 relative">
        <div className="space-y-5 w-full bg-neutral-50 flex py-4 items-center justify-center flex-col sticky top-0 z-30">
          <motion.h1
            initial={{ opacity: 0, y: -900 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -800 }}
            transition={{ duration: 1.35, ease: "easeOut" }}
            className="text-3xl text-neutral-700 font-semibold"
          >
            Want to change the route?
          </motion.h1>
          <Search onSearch={handleSearch} />
        </div>

        <div className="flex flex-col gap-6 w-full">
          {loading ? (
            <p className="text-center text-gray-500 text-lg">Loading ferries...</p>
          ) : error ? (
            <p className="text-center text-red-500 text-lg">{error}</p>
          ) : (
            <>
              {ferries.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-neutral-700">Departure Ferries</h2>
                  {ferries.map((ferry) => (
                    <FerryCard key={ferry._id || ferry.id} ferry={ferry} tripType="departure" />
                  ))}
                </div>
              )}

              {returnFerries.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-neutral-700">Return Ferries</h2>
                  {returnFerries.map((ferry) => (
                    <FerryCard key={ferry._id || ferry.id} ferry={ferry} tripType="return" />
                  ))}
                </div>
              )}

              {ferries.length === 0 && returnFerries.length === 0 && (
                <p className="text-center text-gray-500 text-lg">No ferries available</p>
              )}
            </>
          )}
        </div>
      </RootLayout>
    </div>
  );
};

export default Ticket;



