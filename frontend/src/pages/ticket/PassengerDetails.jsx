import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCar, FaMotorcycle, FaUser, FaBus, FaPhone } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { load } from "@cashfreepayments/cashfree-js";
import { jwtDecode } from "jwt-decode";

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ferry, selectedCategory, selectedSeatsByClass, totalAmount } = location.state || {};

  const [contactNumber, setContactNumber] = useState("");
  const [proofType, setProofType] = useState("Aadhaar");
  const [proofNumber, setProofNumber] = useState("");
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState(
    Array.isArray(selectedCategory)
      ? selectedCategory
        .filter((cat) => cat.name !== "Passenger")
        .map((cat) => ({
          vehicleType: cat.name,
          vehicleName: "",
          vehicleNumber: "",
          isNew: false,
        }))
      : []
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [contactError, setContactError] = useState("");
  const [proofError, setProofError] = useState("");
  const [cashfree, setCashfree] = useState(null);




  const categoryIcons = {
    Car: <FaCar className="text-gray-600 text-lg" />,
    Bike: <FaMotorcycle className="text-gray-600 text-lg" />,
    Bus: <FaBus className="text-gray-600 text-lg" />,
  };

  const validationPatterns = {
    Aadhaar: /^\d{12}$/,
    Passport: /^[A-Z]{1}[0-9]{7}$/,
    "Driving License": /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,15}$/,
  };

  // Initialize Cashfree SDK
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const cf = await load({ mode: "sandbox" });
        setCashfree(cf);
      } catch (error) {
        console.error("Failed to initialize Cashfree SDK:", error);
        toast.error("Failed to initialize payment system.");
      }
    };
    initializeSDK();
  }, []);

  useEffect(() => {
    if (!location.state) {
      navigate("/ticket", { replace: true });
      return;
    }

    const initialPassengerDetails = Object.entries(selectedSeatsByClass || {}).flatMap(
      ([className, seatIds]) =>
        seatIds.map(() => ({
          firstName: "",
          lastName: "",
          gender: "",
          age: "",
          className,
        }))
    );
    setPassengerDetails(initialPassengerDetails);
  }, [location.state, navigate, selectedSeatsByClass]);

  const handlePassengerChange = (index, field, value) => {
    setPassengerDetails((prevDetails) =>
      prevDetails.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      )
    );
  };

  const handleVehicleChange = (index, field, value) => {
    setVehicleDetails((prevDetails) =>
      prevDetails.map((vehicle, i) =>
        i === index ? { ...vehicle, [field]: value } : vehicle
      )
    );
  };

  const validateContactNumber = (number) => {
    const phonePattern = /^[6-9]\d{9}$/;
    if (!number) return "Contact number is required";
    if (!phonePattern.test(number)) return "Please enter a valid 10-digit Indian mobile number";
    return "";
  };

  const validateProofNumber = (number, type) => {
    if (!number) return "Proof number is required";
    if (!validationPatterns[type].test(number)) {
      switch (type) {
        case "Aadhaar":
          return "Aadhaar must be a 12-digit number";
        case "Passport":
          return "Passport must start with a letter followed by 7 digits";
        case "Driving License":
          return "Enter a valid driving license number";
        default:
          return "Invalid proof number format";
      }
    }
    return "";
  };

  const validateVehicleDetails = (vehicles) => {
    if (
      vehicles.length > 0 &&
      vehicles.some((v) => !v.vehicleType || !v.vehicleName || !v.vehicleNumber)
    ) {
      return "Please fill all vehicle details (type, name, number).";
    }
    return "";
  };

  const handleBooking = async () => {
    try {
      setErrorMsg("");
      setContactError("");
      setProofError("");
      setLoading(true);

      const contactValidationError = validateContactNumber(contactNumber);
      if (contactValidationError) {
        setContactError(contactValidationError);
        toast.error(contactValidationError);
        return;
      }

      const proofValidationError = validateProofNumber(proofNumber, proofType);
      if (proofValidationError) {
        setProofError(proofValidationError);
        toast.error(proofValidationError);
        return;
      }

      if (
        passengerDetails.length === 0 ||
        passengerDetails.some((p) => !p.firstName || !p.lastName || !p.gender || !p.age)
      ) {
        toast.error("Please fill all passenger details.");
        return;
      }

      const vehicleValidationError = validateVehicleDetails(vehicleDetails);
      if (vehicleValidationError) {
        toast.error(vehicleValidationError);
        return;
      }

      if (!selectedSeatsByClass || Object.keys(selectedSeatsByClass).length === 0) {
        toast.error("Please select at least one seat.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to book a seat.");
        return;
      }

      let userId;
      try {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.userId || decodedToken.id || decodedToken.sub;
        if (!userId) throw new Error("Invalid user ID in token.");
      } catch (err) {
        toast.error("Invalid login session. Please login again.");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (!cashfree) {
        toast.error("Payment system not initialized. Please try again.");
        return;
      }

      const bookings = Object.entries(selectedSeatsByClass).flatMap(([className, seatIds]) => {
        const classData = ferry?.classes?.find((cls) => cls.name === className);
        if (!classData) return [];

        return seatIds.map((seatId, index) => {
          const seat = classData.seats?.find((s) => s._id === seatId);
          if (!seat) return null;

          const passenger = passengerDetails[index] || passengerDetails[0];

          return {
            ferryId: ferry._id,
            className,
            seatNumber: seat.seatNumber,
            category: selectedCategory.map((cat) => cat.name).join(","),
            passengers: passenger ? [passenger] : [],
            vehicles: vehicleDetails.map((v) => ({
              vehicleType: v.vehicleType,
              vehicleName: v.vehicleName,
              vehicleNumber: v.vehicleNumber,
            })),
            contactNumber,
            proofType,
            proofNumber,
            totalAmount: totalAmount / seatIds.length,
          };
        }).filter(Boolean);
      });

      if (bookings.length === 0) {
        toast.error("No valid bookings could be created.");
        return;
      }

      const bookingIds = [];

      try {
        for (const booking of bookings) {
          const response = await axios.post(
            "http://localhost:5000/api/book-seat",
            booking,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 401) {
            throw new Error("Session expired. Please log in again.");
          }

          if (response.data?.message !== "Booking successful") {
            throw new Error(`Booking failed for seat ${booking.seatNumber}`);
          }

          bookingIds.push(response.data.bookingId);
        }

        localStorage.setItem("pendingBookingIds", JSON.stringify(bookingIds));

        const firstBookingId = bookingIds[0];
        const paymentResponse = await axios.post(
          "http://localhost:5000/api/payment/create-order",
          {
            userId,
            ferryId: ferry._id,
            amount: totalAmount,
            bookingId: firstBookingId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!paymentResponse.data.success) {
          throw new Error(paymentResponse.data.message || "Payment failed.");
        }

        const { paymentSessionId, orderId } = paymentResponse.data;

        const returnUrl = `http://localhost:5173/paymentStatus?order_id=${orderId}&booking_ids=${bookingIds.join(",")}`;

        const checkoutOptions = {
          paymentSessionId,
          returnUrl,
          redirectTarget: "_self",
        };

        await cashfree.checkout(checkoutOptions);
      } catch (bookingError) {
        if (bookingIds.length > 0) {
          await Promise.all(
            bookingIds.map(async (id) => {
              try {
                await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
              } catch (deleteError) {
                console.error("Rollback failed for:", id);
              }
            })
          );
        }
        throw bookingError;
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const seatsByClass = Object.entries(selectedSeatsByClass || {}).map(([className, seatIds]) => ({
    className,
    seatIds,
    seats: ferry?.classes?.find((cls) => cls.name === className)?.seats?.filter((seat) =>
      seatIds.includes(seat._id)
    ) || [],
  }));

  return (
    <div className="flex gap-6 p-6 bg-gray-100 mt-20">
      <div className="w-3/4 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Passenger Details</h2>

        {seatsByClass.length > 0 && (
          <div className="mt-6 border rounded-lg p-4">
            <h3 className="text-lg font-semibold">Passenger(s)</h3>
            <p className="text-blue-600 text-sm font-semibold">
              Enter your name as per government-approved ID.
            </p>

            {seatsByClass.map((classData, classIndex) => (
              <div key={classData.className} className="mt-4">
                {classData.seatIds.map((seatId, seatIndex) => {
                  const passengerIndex = seatsByClass
                    .slice(0, classIndex)
                    .reduce((acc, cls) => acc + cls.seatIds.length, 0) + seatIndex;
                  const seat = classData.seats.find((s) => s._id === seatId);
                  return (
                    <div
                      key={seatId}
                      className="grid grid-cols-6 gap-2 items-center mt-4 bg-gray-100 p-2 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-600 text-lg" />
                        <span className="bg-gray-200 px-3 py-2 rounded-md text-sm">
                          Passenger {passengerIndex + 1}
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="First Name"
                        className="border p-2 rounded-md text-sm"
                        value={passengerDetails[passengerIndex]?.firstName || ""}
                        onChange={(e) =>
                          handlePassengerChange(passengerIndex, "firstName", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="border p-2 rounded-md text-sm"
                        value={passengerDetails[passengerIndex]?.lastName || ""}
                        onChange={(e) =>
                          handlePassengerChange(passengerIndex, "lastName", e.target.value)
                        }
                      />
                      <select
                        className="border p-2 rounded-md text-sm"
                        value={passengerDetails[passengerIndex]?.gender || ""}
                        onChange={(e) =>
                          handlePassengerChange(passengerIndex, "gender", e.target.value)
                        }
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Age"
                        className="border p-2 rounded-md text-sm w-16"
                        value={passengerDetails[passengerIndex]?.age || ""}
                        onChange={(e) =>
                          handlePassengerChange(passengerIndex, "age", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        value={classData.className}
                        className="border p-2 rounded-md text-sm bg-gray-200"
                        readOnly
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {Array.isArray(selectedCategory) &&
          selectedCategory.some((cat) => cat.name !== "Passenger") && (
            <div className="mt-6 border rounded-lg p-4">
              <h3 className="text-lg font-semibold">Vehicle(s)</h3>
              <span className="text-blue-600 text-sm font-semibold">
                Important: <span className="text-gray-600">Enter vehicle details as per government-approved ID.</span>
              </span>

              <div className="grid grid-cols-3 bg-gray-100 p-2 mt-3 text-sm font-semibold text-gray-700">
                <span>Vehicle Type</span>
                <span>Vehicle Name</span>
                <span>Vehicle Number</span>
              </div>

              {selectedCategory
                .filter((cat) => cat.name !== "Passenger")
                .map((category, index) => (
                  <div key={category.name} className="grid grid-cols-3 gap-2 items-center mt-2">
                    <div className="flex items-center gap-2">
                      {categoryIcons[category.name]}
                      <input
                        type="text"
                        value={vehicleDetails[index]?.vehicleType || category.name}
                        className="border p-2 rounded-md text-sm w-full bg-gray-200"
                        readOnly
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Vehicle Name (ex: Honda)"
                      className="border p-2 rounded-md text-sm w-full"
                      value={vehicleDetails[index]?.vehicleName || ""}
                      onChange={(e) =>
                        handleVehicleChange(index, "vehicleName", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="Hint: AA00BB1234"
                      className="border p-2 rounded-md text-sm w-full"
                      value={vehicleDetails[index]?.vehicleNumber || ""}
                      onChange={(e) =>
                        handleVehicleChange(index, "vehicleNumber", e.target.value)
                      }
                    />
                    <label className="flex items-center gap-2 col-span-3 mt-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={vehicleDetails[index]?.isNew || false}
                        onChange={(e) =>
                          handleVehicleChange(index, "isNew", e.target.checked)
                        }
                      />
                      <span className="text-sm text-gray-700">New Vehicle?</span>
                    </label>
                  </div>
                ))}
            </div>
          )}

        <div className="mt-6 border rounded-lg p-4">
          <h3 className="text-lg font-semibold">Proof Detail(s)</h3>
          <span className="text-blue-600 text-sm font-semibold">
            Important: <span className="text-gray-600">Enter details as per government-approved.</span>
          </span>

          <div className="grid grid-cols-2 gap-2 items-center mt-3">
            <select
              className="border p-2 rounded-md text-sm"
              value={proofType}
              onChange={(e) => {
                setProofType(e.target.value);
                setProofNumber("");
                setProofError("");
              }}
            >
              <option value="Aadhaar">Aadhaar</option>
              <option value="Passport">Passport</option>
              <option value="Driving License">Driving License</option>
            </select>
            <div>
              <input
                type="text"
                placeholder={
                  proofType === "Passport"
                    ? "Enter Passport Number"
                    : proofType === "Driving License"
                      ? "Enter License Number"
                      : "Enter Aadhaar Number"
                }
                className={`border p-2 rounded-md text-sm w-full ${proofError ? "border-red-500" : ""}`}
                value={proofNumber}
                onChange={(e) => {
                  setProofNumber(e.target.value);
                  setProofError(validateProofNumber(e.target.value, proofType));
                }}
              />
              {proofError && <p className="text-red-500 text-xs mt-1">{proofError}</p>}
            </div>
          </div>
        </div>

        <div className="mt-6 border rounded-lg p-4">
          <h3 className="text-lg font-semibold">Contact Detail(s)</h3>
          <span className="text-blue-600 text-sm font-semibold">
            Important: <span className="text-gray-600">Booking transaction-related notifications will be sent to this number.</span>
          </span>

          <div className="flex items-center gap-2 mt-3">
            <FaPhone className="text-gray-600 text-lg" />
            <div className="w-full">
              <input
                type="text"
                placeholder="Enter Contact No"
                className={`border p-2 rounded-md text-sm w-full ${contactError ? "border-red-500" : ""}`}
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                  setContactError(validateContactNumber(e.target.value));
                }}
                maxLength={10}
              />
              {contactError && <p className="text-red-500 text-xs mt-1">{contactError}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Fare Summary</h3>
        <div className="border-t mt-3 pt-3">
          <p className="text-md font-semibold">Departure:</p>
          <div className="flex justify-between text-gray-700 text-sm mt-2">
            <span>Base Fare</span>
            <span className="font-semibold">₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-gray-700 text-sm">
            <span>Other Services</span>
            <span className="font-semibold">₹0.00</span>
          </div>
          <div className="flex justify-between font-semibold text-md mt-2">
            <span>Sub Total:</span>
            <span className="text-red-500">₹{totalAmount}</span>
          </div>
        </div>
        <button
          onClick={handleBooking}
          className="w-full bg-orange-500 text-white text-lg font-semibold py-2 mt-4 rounded-md"
          disabled={loading}
        >
          {loading ? "Processing..." : "PAY NOW"}
        </button>
        {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default BookingForm;
