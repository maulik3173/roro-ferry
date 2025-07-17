// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import TopLayout from "../../layout/toppage/TopLayout";
// import { FaCar, FaMotorcycle, FaUser, FaBus } from "react-icons/fa";
// import toast from "react-hot-toast";

// const FerrySelection = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [ferry, setFerry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [passengers, setPassengers] = useState(1);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [bookedSeats, setBookedSeats] = useState([]);

//   const categoryIcons = {
//     Car: <FaCar />,
//     Bike: <FaMotorcycle />,
//     Passenger: <FaUser />,
//     Bus: <FaBus />,
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const ferryResponse = await axios.get(`http://localhost:5000/api/ferry/${id}`);
//         const bookedSeatsResponse = await axios.get(`http://localhost:5000/api/booked-seats/${id}`);


//         const ferryData = ferryResponse.data.data;
//         setFerry(ferryData);
//         setBookedSeats(bookedSeatsResponse.data.bookedSeats || []);

//         // const defaultCategory = ferryData.categories.find(cat => cat.name === "Passenger") || ferryData.categories[0];
//         const defaultClass = ferryData.classes.find(cls => cls.name === "Executive") || ferryData.classes[0];

//         const defaultCategory = ferryData.categories.find(cat => cat.name === "Passenger") || ferryData.categories[0];
//         setSelectedCategory([defaultCategory]);

//         //setSelectedCategory(defaultCategory);
//         setSelectedClass(defaultClass);
//       } catch (err) {
//         setError("Failed to fetch ferry details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const handleSeatSelection = (seatId) => {
//     if (bookedSeats.includes(seatId)) return;
//     setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]);
//   };


//   const handleBooking = async () => {
//     if (selectedSeats.length === 0) {
//       toast.error("Please select at least one seat before booking.");
//       return;
//     }

//     navigate("/passenger-details", {
//       state: {
//         ferry,
//         selectedCategory,
//         selectedClass,
//         selectedSeats,
//         totalAmount
//       },
//     });
//   };

//   if (loading) return <p>Loading ferry details...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   // const baseFare = selectedClass ? selectedClass.price : 0;
//   // const categoryFare = selectedCategory ? selectedCategory.price : 0;
//   // const seatPrice = selectedSeats.length * baseFare;
//   // const totalAmount = selectedSeats.length > 0 ? seatPrice + categoryFare : 0;

//   // Base fare from selected class
//   const baseFare = selectedClass ? selectedClass.price : 0;

//   // Sum of all selected category prices
//   const categoryFare = Array.isArray(selectedCategory)
//     ? selectedCategory.reduce((acc, cat) => acc + (cat.price || 0), 0)
//     : 0;

//   // Seat fare calculation
//   const seatPrice = selectedSeats.length * baseFare;

//   // Total amount only if seats are selected
//   const totalAmount = selectedSeats.length > 0 ? seatPrice + categoryFare : 0;


//   return (
//     <div className="w-full space-y-6 pb-16">
//       <TopLayout
//         bgimg="https://videos.pexels.com/video-files/3994031/3994031-uhd_2560_1440_30fps.mp4"
//         title="Ferry Selection"
//       />
//       <div className="p-6 bg-white shadow-lg rounded-lg max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
//         <div className="flex-1 space-y-4">
//           <h2 className="text-lg font-semibold">
//             {ferry.name} ➤ {ferry.ferryCode} <br />
//           </h2>
//           <label className="block font-medium">Select Category</label>
//           <div className="flex gap-4 mt-2">
//             {/* {ferry.categories.map((category) => (
//               <button
//                 key={category.name}
//                 className={`p-3 rounded-lg ${selectedCategory === category ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//                 onClick={() => setSelectedCategory(category)}
//               >
//                 {categoryIcons[category.name]}
//               </button>
//             ))} */}
//             {ferry.categories.map((category) => {
//               const isSelected = selectedCategory.some((cat) => cat.name === category.name);
//               return (
//                 <button
//                   key={category.name}
//                   className={`p-3 rounded-lg ${isSelected ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//                   onClick={() =>
//                     setSelectedCategory((prev) =>
//                       isSelected
//                         ? prev.filter((cat) => cat.name !== category.name)
//                         : [...prev, category]
//                     )
//                   }
//                 >
//                   {categoryIcons[category.name]}
//                 </button>
//               );
//             })}

//           </div>
//           <label className="block font-medium mt-4">Choose Travel Class</label>
//           <div className="flex items-center gap-2 mt-2 overflow-x-auto">
//             {ferry.classes.map((cls) => (
//               <button
//                 key={cls.name}
//                 className={`px-4 py-2 rounded-lg ${selectedClass === cls ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//                 onClick={() => setSelectedClass(cls)}
//               >
//                 {cls.name}
//               </button>
//             ))}
//           </div>
//           <div className="mt-4">
//             <label className="block text-sm font-medium">Select Seats</label>
//             <div className="flex gap-2 mt-2">
//               {selectedClass?.seats && selectedClass.seats.length > 0 ? (
//                 selectedClass.seats.map(seat => (
//                   <button
//                     key={seat._id}
//                     className={`p-3 rounded-lg ${seat.isBooked
//                       ? "bg-gray-500 text-white cursor-not-allowed"
//                       : selectedSeats.includes(seat._id)
//                         ? "bg-green-500 text-white"
//                         : "bg-blue-200"
//                       }`}
//                     onClick={() => handleSeatSelection(seat._id, seat.seatNumber)}
//                     disabled={seat.isBooked}
//                   >
//                     👤<br />
//                     {seat.seatNumber}
//                   </button>
//                 ))
//               ) : (
//                 <p className="text-red-500">No seats available for this class</p>
//               )}
//             </div>
//           </div>

//           <h3 className="mt-4 font-semibold">Selected Seats: {selectedSeats.length}</h3>
//         </div>
//         {/* <div className="p-6 bg-gray-100 rounded-lg w-full md:w-1/3">
//           <h3 className="font-semibold text-lg">Booking Summary</h3>
//           <div className="mt-4 space-y-2">
//             <p className="flex justify-between">
//               <span>Base Fare:</span> <span>₹{baseFare}</span>
//             </p>
//             <p className="flex justify-between">
//               <span>Passenger x {passengers} (₹{passengers * baseFare})</span>
//               <span>₹{passengers * baseFare}</span>
//             </p>
//             {selectedCategory && (
//               <p className="flex justify-between">
//                 <span>{selectedCategory.name} Charge:</span> <span>₹{categoryFare}</span>
//               </p>
//             )}
//             <p className="font-bold flex justify-between">
//               <span>Total Amount:</span> <span>₹{totalAmount}</span>
//             </p>
//           </div>
//           <div className="mt-6 flex justify-between">
//             <button className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
//             <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleBooking}>BOOK NOW</button>
//           </div>
//         </div>
//      */}
//         <div className="p-6 bg-gray-100 rounded-lg w-full md:w-1/3">
//           <h3 className="font-semibold text-lg">Booking Summary</h3>
//           <div className="mt-4 space-y-2">
//             <p className="flex justify-between">
//               <span>Base Fare:</span> <span>₹{baseFare}</span>
//             </p>

//             {/* Seat Price Calculation */}
//             {selectedSeats.length > 0 && (
//               <p className="flex justify-between">
//                 <span>Passenger x {selectedSeats.length} (₹{baseFare} each)</span>
//                 <span>₹{seatPrice}</span>
//               </p>
//             )}

//             {/* Render all selected categories with their charges */}
//             {Array.isArray(selectedCategory) && selectedCategory.map((cat, idx) => (
//               <p key={idx} className="flex justify-between">
//                 <span>{cat.name} Charge:</span> <span>₹{cat.price || 0}</span>
//               </p>
//             ))}

//             <p className="font-bold flex justify-between">
//               <span>Total Amount:</span> <span>₹{totalAmount}</span>
//             </p>
//           </div>

//           <div className="mt-6 flex justify-between">
//             <button className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
//             <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleBooking}>
//               BOOK NOW
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default FerrySelection;

// // import React, { useState, useEffect } from "react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import axios from "axios";
// // import TopLayout from "../../layout/toppage/TopLayout";
// // import { FaCar, FaMotorcycle, FaUser, FaBus } from "react-icons/fa";
// // import toast from "react-hot-toast";

// // const FerrySelection = () => {
// //   const navigate = useNavigate();
// //   const { id } = useParams();
// //   const [ferry, setFerry] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [selectedCategories, setSelectedCategories] = useState([]);
// //   const [selectedClass, setSelectedClass] = useState(null);
// //   const [passengers, setPassengers] = useState(1);
// //   const [selectedSeats, setSelectedSeats] = useState([]);
// //   const [bookedSeats, setBookedSeats] = useState([]);

// //   const categoryIcons = {
// //     Car: <FaCar />,
// //     Bike: <FaMotorcycle />,
// //     Passenger: <FaUser />,
// //     Bus: <FaBus />,
// //   };

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const ferryResponse = await axios.get(`http://localhost:5000/api/ferry/${id}`);
// //         const bookedSeatsResponse = await axios.get(`http://localhost:5000/api/booked-seats/${id}`);

// //         const ferryData = ferryResponse.data.data;
// //         setFerry(ferryData);
// //         setBookedSeats(bookedSeatsResponse.data.bookedSeats || []);

// //         const defaultCategory = ferryData.categories.find(cat => cat.name === "Passenger") || ferryData.categories[0];
// //         const defaultClass = ferryData.classes.find(cls => cls.name === "Executive") || ferryData.classes[0];

// //         setSelectedCategories([defaultCategory]);
// //         setSelectedClass(defaultClass);
// //       } catch (err) {
// //         setError("Failed to fetch ferry details.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [id]);

// //   const handleSeatSelection = (seatId) => {
// //     if (bookedSeats.includes(seatId)) return;
// //     setSelectedSeats(prev =>
// //       prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
// //     );
// //   };

// //   const handleCategoryToggle = (category) => {
// //     setSelectedCategories((prev) =>
// //       prev.some((c) => c.name === category.name)
// //         ? prev.filter((c) => c.name !== category.name)
// //         : [...prev, category]
// //     );
// //   };

// //   const handleBooking = () => {
// //     if (selectedSeats.length === 0) {
// //       toast.error("Please select at least one seat before booking.");
// //       return;
// //     }

// //     navigate("/passenger-details", {
// //       state: {
// //         ferry,
// //         selectedCategories,
// //         selectedClass,
// //         selectedSeats,
// //         totalAmount
// //       },
// //     });
// //   };

// //   if (loading) return <p>Loading ferry details...</p>;
// //   if (error) return <p className="text-red-500">{error}</p>;

// //   const baseFare = selectedClass ? selectedClass.price : 0;
// //   const seatPrice = selectedSeats.length * baseFare;
// //   const categoryFare = selectedCategories.reduce((sum, cat) => sum + cat.price, 0);
// //   const totalAmount = selectedSeats.length > 0 ? seatPrice + categoryFare : 0;

// //   return (
// //     <div className="w-full space-y-6 pb-16">
// //       <TopLayout
// //         bgimg="https://videos.pexels.com/video-files/3994031/3994031-uhd_2560_1440_30fps.mp4"
// //         title="Ferry Selection"
// //       />
// //       <div className="p-6 bg-white shadow-lg rounded-lg max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
// //         <div className="flex-1 space-y-4">
// //           <h2 className="text-lg font-semibold">
// //             {ferry.name} ➤ {ferry.ferryCode} <br />
// //           </h2>

// //           <label className="block font-medium">Select Categories</label>
// //           <div className="flex gap-4 mt-2">
// //             {ferry.categories.map((category) => {
// //               const isSelected = selectedCategories.some(c => c.name === category.name);
// //               return (
// //                 <button
// //                   key={category.name}
// //                   className={`p-3 rounded-lg ${isSelected ? "bg-blue-500 text-white" : "bg-gray-200"}`}
// //                   onClick={() => handleCategoryToggle(category)}
// //                 >
// //                   {categoryIcons[category.name]}
// //                 </button>
// //               );
// //             })}
// //           </div>

// //           <label className="block font-medium mt-4">Choose Travel Class</label>
// //           <div className="flex items-center gap-2 mt-2 overflow-x-auto">
// //             {ferry.classes.map((cls) => (
// //               <button
// //                 key={cls.name}
// //                 className={`px-4 py-2 rounded-lg ${selectedClass === cls ? "bg-blue-500 text-white" : "bg-gray-200"}`}
// //                 onClick={() => setSelectedClass(cls)}
// //               >
// //                 {cls.name}
// //               </button>
// //             ))}
// //           </div>

// //           <div className="mt-4">
// //             <label className="block text-sm font-medium">Select Seats</label>
// //             <div className="flex gap-2 mt-2 flex-wrap">
// //               {selectedClass?.seats && selectedClass.seats.length > 0 ? (
// //                 selectedClass.seats.map(seat => (
// //                   <button
// //                     key={seat._id}
// //                     className={`p-3 rounded-lg ${seat.isBooked
// //                       ? "bg-gray-500 text-white cursor-not-allowed"
// //                       : selectedSeats.includes(seat._id)
// //                         ? "bg-green-500 text-white"
// //                         : "bg-blue-200"
// //                       }`}
// //                     onClick={() => handleSeatSelection(seat._id)}
// //                     disabled={seat.isBooked}
// //                   >
// //                     👤<br />
// //                     {seat.seatNumber}
// //                   </button>
// //                 ))
// //               ) : (
// //                 <p className="text-red-500">No seats available for this class</p>
// //               )}
// //             </div>
// //           </div>

// //           <h3 className="mt-4 font-semibold">Selected Seats: {selectedSeats.length}</h3>
// //         </div>

// //         <div className="p-6 bg-gray-100 rounded-lg w-full md:w-1/3">
// //           <h3 className="font-semibold text-lg">Booking Summary</h3>
// //           <div className="mt-4 space-y-2">
// //             <p className="flex justify-between">
// //               <span>Base Fare:</span> <span>₹{baseFare}</span>
// //             </p>
// //             <p className="flex justify-between">
// //               <span>Passenger x {passengers} (₹{passengers * baseFare})</span>
// //               <span>₹{passengers * baseFare}</span>
// //             </p>
// //             {selectedCategories.map((cat) => (
// //               <p key={cat.name} className="flex justify-between">
// //                 <span>{cat.name} Charge:</span> <span>₹{cat.price}</span>
// //               </p>
// //             ))}
// //             <p className="font-bold flex justify-between">
// //               <span>Total Amount:</span> <span>₹{totalAmount}</span>
// //             </p>
// //           </div>
// //           <div className="mt-6 flex justify-between">
// //             <button className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
// //             <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleBooking}>
// //               BOOK NOW
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default FerrySelection;


import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCar, FaMotorcycle, FaUser, FaBus, FaPhone } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    ferry,
    selectedCategory,
    selectedClass,
    selectedSeats,
    totalAmount,
  } = location.state || {};

  const [contactNumber, setContactNumber] = useState("");
  const [proofType, setProofType] = useState("Aadhaar");
  const [proofNumber, setProofNumber] = useState("");
  const [passengerDetails, setPassengerDetails] = useState(
    selectedSeats.map(() => ({
      firstName: "",
      lastName: "",
      gender: "",
      age: "",
    }))
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!location.state) {
      navigate("/ticket", { replace: true });
    }
  }, [location.state, navigate]);

  const handlePassengerChange = (index, field, value) => {
    setPassengerDetails((prevDetails) =>
      prevDetails.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      )
    );
  };

    const handleBooking = async () => {
      setErrorMsg("");
      if (!contactNumber || !proofNumber) {
          toast.error("Please enter contact number and proof details.");
          return;
      }
      if (passengerDetails.some(p => !p.firstName || !p.lastName || !p.gender || !p.age)) {
          toast.error("Please fill all passenger details.");
          return;
      }
      // navigate('/payment')
      setLoading(true);
      try {
          await Promise.all(
              selectedSeats.map(async (seatId) => {
                  const seatNumber = selectedClass.seats.find(seat => seat._id === seatId)?.seatNumber;
                  const response = await axios.post("http://localhost:5000/api/book-seat", {
                      ferryId: ferry._id,
                      className: selectedClass.name,
                      seatNumber,
                      category: selectedCategory.name,
                      passengers: passengerDetails,
                      contactNumber,
                      proofType,
                      proofNumber,
                      totalAmount,
                  });
                  console.log("Booking Success:", response.data);
              })
          );
          toast.success("Seats booked successfully!");
          navigate("/payment"); 
      } catch (error) {
          console.error("Booking Error:", error);
          setErrorMsg(error.response?.data?.error || "Failed to book seats.");
      }
      setLoading(false);
  };


  return (
    <div className="flex gap-6 p-6 bg-gray-100 mt-20">
      <div className="w-3/4 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Passengers Details</h2>

        <div className="mt-6 border rounded-lg p-4">
          <h3 className="text-lg font-semibold">Passenger(s)</h3>
          <p className="text-blue-600 text-sm font-semibold">
            Enter your name as per government-approved ID.
          </p>

          {selectedSeats.map((_, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 items-center mt-4 bg-gray-100 p-2 rounded-md">
              <div className="flex items-center gap-2">
                <FaUser className="text-gray-600 text-lg" />
                <span className="bg-gray-200 px-3 py-2 rounded-md text-sm">
                  Passenger {index + 1}
                </span>
              </div>
              <input
                type="text"
                placeholder="First Name"
                className="border p-2 rounded-md text-sm"
                value={passengerDetails[index]?.firstName || ""}
                onChange={(e) => handlePassengerChange(index, "firstName", e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border p-2 rounded-md text-sm"
                value={passengerDetails[index]?.lastName || ""}
                onChange={(e) => handlePassengerChange(index, "lastName", e.target.value)}
              />
              <select
                className="border p-2 rounded-md text-sm"
                value={passengerDetails[index]?.gender || ""}
                onChange={(e) => handlePassengerChange(index, "gender", e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="number"
                placeholder="Age"
                className="border p-2 rounded-md text-sm w-16"
                value={passengerDetails[index]?.age || ""}
                onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
              />
              <input
                type="text"
                value={selectedClass.name}
                className="border p-2 rounded-md text-sm bg-gray-200"
                readOnly
              />
            </div>
          ))}
          
        </div>

        {selectedCategory?.name !== "Passenger" && (
          <div className="mt-6 border rounded-lg p-4">
            <h3 className="text-lg font-semibold">Vehicle(s)</h3>
            <span className="text-blue-600 text-sm font-semibold">
              Important:{" "}
              <span className="text-gray-600">
                Enter vehicle details as per government-approved ID.
              </span>
            </span>

            <div className="grid grid-cols-4 bg-gray-100 p-2 mt-3 text-sm font-semibold text-gray-700">
              <span>Vehicle Type</span> <span>Vehicle Name</span>
              <span>Vehicle Number</span> <span>Weight</span>
            </div>

            <div className="grid grid-cols-4 gap-2 items-center mt-2">
              <div className="flex items-center gap-2">
                {selectedCategory.name === "Car" && <FaCar className="text-gray-600 text-lg" />}
                {selectedCategory.name === "Bike" && <FaMotorcycle className="text-gray-600 text-lg" />}
                {selectedCategory.name === "Bus" && <FaBus className="text-gray-600 text-lg" />}
                <span className="bg-gray-200 px-3 py-2 rounded-md text-sm">
                  {selectedCategory.name}
                </span>
              </div>
              <input
                type="text"
                placeholder="Vehicle Name (ex: Honda)"
                className="border p-2 rounded-md text-sm w-full"
              />
              <input
                type="text"
                placeholder="Hint: AA00BB1234"
                className="border p-2 rounded-md text-sm w-full"
              />
              <input
                type="number"
                placeholder="0"
                className="border p-2 rounded-md text-sm w-16"
              />

              <label className="flex items-center gap-2 col-span-4 mt-2">
                <input type="checkbox" className="h-4 w-4" />
                <span className="text-sm text-gray-700">New Vehicle?</span>
              </label>
            </div>
          </div>
        )}

        <div className="mt-6 border rounded-lg p-4">
          <h3 className="text-lg font-semibold">Proof Detail(s)</h3>
          <span className="text-blue-600 text-sm font-semibold">
            Important:{" "}
            <span className="text-gray-600">
              Enter details as per government-approved.
            </span>
          </span>

          <div className="grid grid-cols-2 gap-2 items-center mt-3">
            <select
              className="border p-2 rounded-md text-sm"
              value={proofType}
              onChange={(e) => {
                setProofType(e.target.value);
                setProofNumber("");
              }}
            >
              <option value="Aadhaar">Aadhaar</option>
              <option value="Passport">Passport</option>
              <option value="Driving License">Driving License</option>
            </select>

            <input
              type="text"
              placeholder={
                proofType === "Passport"
                  ? "Enter Passport Number"
                  : proofType === "Driving License"
                    ? "Enter License Number"
                    : "Enter Aadhaar Number"
              }
              className="border p-2 rounded-md text-sm"
              value={proofNumber}
              onChange={(e) => setProofNumber(e.target.value)}
              pattern={
                proofType === "Aadhaar"
                  ? "\\d{12}"
                  : proofType === "Passport"
                    ? "[A-Z]{1}[0-9]{7}"
                    : proofType === "Driving License"
                      ? "[A-Z0-9]+"
                      : ".*"
              }
              title={
                proofType === "Aadhaar"
                  ? "Aadhaar must be a 12-digit number"
                  : proofType === "Passport"
                    ? "Passport must start with a letter followed by 7 digits"
                    : proofType === "Driving License"
                      ? "Enter a valid license number"
                      : ""
              }
              required
            />
          </div>
        </div>

        <div className="mt-6 border rounded-lg p-4">
          <h3 className="text-lg font-semibold">Contact Detail(s)</h3>
          <span className="text-blue-600 text-sm font-semibold">
            Important:{" "}
            <span className="text-gray-600">
              Booking transaction-related notifications will be sent to this
              number.
            </span>
          </span>

          <div className="flex items-center gap-2 mt-3">
            <FaPhone className="text-gray-600 text-lg" />
            <input
              type="text"
              placeholder="Enter Contact No"
              className="border p-2 rounded-md text-sm w-full"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="w-1/4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Fare Summary</h3>

        <div className="border-t mt-3 pt-3">
          <p className="text-md font-semibold">Departure:</p>
          <div className="flex justify-between text-gray-700 text-sm mt-2">
            <span>Base Fare</span>{" "}
            <span className="font-semibold">₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-gray-700 text-sm">
            <span>Other Services</span>{" "}
            <span className="font-semibold">₹0.00</span>
          </div>
          <div className="flex justify-between font-semibold text-md mt-2">
            <span>Sub Total:</span>{" "}
            <span className="text-red-500">₹{totalAmount}</span>
          </div>
        </div>

        <button onClick={handleBooking} className="w-full bg-orange-500 text-white text-lg font-semibold py-2 mt-4 rounded-md">
          {loading ? "Processing..." : "BOOK NOW"}
        </button>
        {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default BookingForm;


