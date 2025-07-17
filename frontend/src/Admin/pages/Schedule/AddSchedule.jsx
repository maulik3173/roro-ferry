import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddScheduleForm = () => {
  const [ferries, setFerries] = useState([]);
  const [formData, setFormData] = useState({
    ferryName: '',
    from: '',
    to: '',
    tripType: 'one-way',
    departureDate: '',
    arrivalTime: '',
    returnDate: '',
    returnTime: '',
    onwardStatus: '',
    returnStatus: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFerries = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ferries");
        const data = await response.json();
        if (response.ok) {
          setFerries(data.data);
        } else {
          toast.error("Failed to fetch ferries");
        }
      } catch (error) {
        toast.error("Error fetching ferries");
      }
    };
    fetchFerries();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/add-schedules", formData);
      toast.success("Schedule added successfully!");
      setTimeout(() => {
        navigate('/admin/schedule');
      }, 3000);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl p-10 bg-white rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-10 text-center bg-gradient-to-r from-gray-500 to-gray-800 bg-clip-text text-transparent">
          Add New Ferry Schedule
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ferry Name */}
          <div className="grid grid-cols-2 gap-6 items-center">
            <label className="font-semibold text-gray-700">Ferry Name</label>
            <select
              name="ferryName"
              value={formData.ferryName}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl text-gray-800 font-medium outline-none focus:ring-2 focus:ring-gray-400"
              required
            >
              <option value="" disabled>Select Ferry Name</option>
              {ferries.map((ferry) => (
                <option key={ferry._id} value={ferry.name}>{ferry.name}</option>
              ))}
            </select>
          </div>

          {/* From */}
          <div className="grid grid-cols-2 gap-6 items-center">
            <label htmlFor="from" className="font-semibold text-gray-700">From</label>
            <input
              name="from"
              placeholder="From"
              value={formData.from}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-gray-400 outline-none"
            />
          </div>

          {/* To */}
          <div className="grid grid-cols-2 gap-6 items-center">
            <label htmlFor="to" className="font-semibold text-gray-700">To</label>
            <input
              name="to"
              placeholder="To"
              value={formData.to}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-gray-400 outline-none"
            />
          </div>

          {/* Trip Type */}
          <div className="grid grid-cols-2 gap-6 items-center">
            <label className="font-semibold text-gray-700">Trip Type</label>
            <div className="flex gap-6 text-gray-700 font-medium">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="one-way"
                  checked={formData.tripType === 'one-way'}
                  onChange={handleChange}
                />
                One-Way
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="round-trip"
                  checked={formData.tripType === 'round-trip'}
                  onChange={handleChange}
                />
                Round-Trip
              </label>
            </div>
          </div>

          {/* One-Way Fields */}
          {formData.tripType === 'one-way' && (
            <>
              <div className="grid grid-cols-2 gap-6 items-center">
                <label htmlFor="departureDate" className="font-semibold text-gray-700">Departure Date</label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-gray-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 items-center">
                <label htmlFor="arrivalTime" className="font-semibold text-gray-700">Arrival Time</label>
                <input
                  type="time"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-gray-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 items-center">
                <label htmlFor="onwardStatus" className="font-semibold text-gray-700">Onward Status</label>
                <select
                  id="onwardStatus"
                  name="onwardStatus"
                  value={formData.onwardStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-gray-400 outline-none"
                >
                  <option value="" disabled>Select Onward Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="departed">Departed</option>
                </select>
              </div>
            </>
          )}

          {/* Round-Trip Fields */}
          {formData.tripType === 'round-trip' && (
            <>
              <div className="grid grid-cols-2 gap-6 items-center">
                <label htmlFor="returnDate" className="font-semibold text-gray-700">Return Date</label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-gray-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 items-center">
                <label htmlFor="returnTime" className="font-semibold text-gray-700">Return Time</label>
                <input
                  type="time"
                  name="returnTime"
                  value={formData.returnTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-gray-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 items-center">
                <label htmlFor="returnStatus" className="font-semibold text-gray-700">Return Status</label>
                <select
                  id="returnStatus"
                  name="returnStatus"
                  value={formData.returnStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-gray-400 outline-none"
                >
                  <option value="" disabled>Select Return Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="departed">Departed</option>
                </select>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full mt-8 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-400 text-white font-bold py-4 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
            >
              Add Schedule
            </button>
          </div>
        </form>
      </div>
    </div>


  );
};

export default AddScheduleForm;
