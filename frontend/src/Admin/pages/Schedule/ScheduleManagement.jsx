import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ScheduleManagement = () => {
    const [schedules, setSchedules] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [tripTypeFilter, setTripTypeFilter] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const itemsPerPage = 8;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                let url = "http://localhost:5000/api/get-schedules";
                if (tripTypeFilter) {
                    url += `?tripType=${tripTypeFilter}`;
                }
                const response = await axios.get(url);
                setSchedules(response.data);
                setCurrentPage(1);
            } catch (error) {
                console.error("Error fetching schedules:", error);
            }
        };
        fetchSchedules();
    }, [tripTypeFilter]);  // Add tripTypeFilter here


    const confirmDelete = (id) => setDeleteId(id);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/schedules/${deleteId}`);
            setSchedules(schedules.filter(schedule => schedule._id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            console.error("Error deleting schedule:", error);
        }
    };

    const handleEdit = (schedule) => {
        setSelectedSchedule({ ...schedule });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!selectedSchedule || !selectedSchedule._id) {
            console.error("No schedule selected for update.");
            return;
        }

        // Prepare updatedFields based on tripType
        const updatedFields = {
            from: selectedSchedule.from,
            to: selectedSchedule.to,
            tripType: selectedSchedule.tripType,
        };

        if (selectedSchedule.tripType === "one-way") {
            updatedFields.departureDate = selectedSchedule.departureDate;
            updatedFields.arrivalTime = selectedSchedule.arrivalTime;
            updatedFields.onwardStatus = selectedSchedule.onwardStatus;

            // Explicitly omit round-trip fields
            updatedFields.returnDate = undefined;
            updatedFields.returnTime = undefined;
            updatedFields.returnStatus = undefined;
        } else if (selectedSchedule.tripType === "round-trip") {
            updatedFields.returnDate = selectedSchedule.returnDate;
            updatedFields.returnTime = selectedSchedule.returnTime;
            updatedFields.returnStatus = selectedSchedule.returnStatus;

            // Explicitly omit one-way fields
            updatedFields.departureDate = undefined;
            updatedFields.arrivalTime = undefined;
            updatedFields.onwardStatus = undefined;
        }

        try {
            await axios.patch(`http://localhost:5000/api/schedules/${selectedSchedule._id}`, updatedFields);

            // Update the schedule in state with updated fields
            setSchedules((prevSchedules) =>
                prevSchedules.map((schedule) =>
                    schedule._id === selectedSchedule._id ? { ...schedule, ...updatedFields } : schedule
                )
            );

            setIsEditing(false);
            setSelectedSchedule(null);
        } catch (error) {
            console.error("Error updating schedule:", error);
        }
    };


    const filteredSchedules = schedules.filter(schedule =>
        schedule.from?.toLowerCase().includes(search.toLowerCase()) ||
        schedule.to?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedSchedules = filteredSchedules.slice(startIndex, startIndex + itemsPerPage);

    const formatTime = (timeString) => {
        if (!timeString) return "N/A";
        const date = new Date(`1970-01-01T${timeString}`);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-4xl font-semibold text-gray-700 text-center mb-6">Schedule Management</h2>

            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by from or to destination"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-1 border rounded w-64"
                />

                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="tripType"
                            value=""
                            checked={tripTypeFilter === ""}
                            onChange={() => setTripTypeFilter("")}
                            className="form-radio"
                        />
                        <span>All</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="tripType"
                            value="one-way"
                            checked={tripTypeFilter === "one-way"}
                            onChange={() => setTripTypeFilter("one-way")}
                            className="form-radio"
                        />
                        <span>One-Way</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="tripType"
                            value="round-trip"
                            checked={tripTypeFilter === "round-trip"}
                            onChange={() => setTripTypeFilter("round-trip")}
                            className="form-radio"
                        />
                        <span>Round-Trip</span>
                    </label>
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center" onClick={() => navigate("/admin/add-schedule")}>
                    <FaPlus className="mr-2" /> Add Schedule
                </button>
            </div>

            {/* <div className="overflow-auto bg-white shadow-lg rounded-lg">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-600 text-white text-left">
                        <tr>
                            <th className="p-4">No</th>
                            <th className="p-4">From</th>
                            <th className="p-4">To</th>
                            <th className="p-4">OnwardStatus</th>
                            <th className="p-4">Departure Date</th>
                            <th className="p-4">Arrival Time</th>
                            <th className="p-4">Trip Type</th>
                            <th className="p-4">Return Date</th>
                            <th className="p-4">Return Time</th>
                            <th className="p-4">ReturnStatus</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedSchedules.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center text-gray-500 p-6">
                                    No schedules found.
                                </td>
                            </tr>
                        ) : (
                            displayedSchedules.map((schedule, index) => (
                                <tr key={schedule._id} className="border-b hover:bg-gray-100 transition">
                                    <td className="p-4">{startIndex + index + 1}</td>
                                    <td className="p-4">{schedule.from || "N/A"}</td>
                                    <td className="p-4">{schedule.to || "N/A"}</td>
                                    <td className={`p-4 font-bold ${schedule.onwardStatus?.toLowerCase() === 'departed' ? 'text-red-500' : 'text-green-500'}`}>
                                        {schedule.onwardStatus || "N/A"}
                                    </td>
                                    <td className="p-4">{schedule.departureDate ? new Date(schedule.departureDate).toLocaleDateString() : "N/A"}</td>
                                    <td className="p-4">{formatTime(schedule.arrivalTime) || "N/A"}</td>
                                    <td className="p-4">{schedule.tripType || "N/A"}</td>
                                    <td className="p-4">{schedule.returnDate ? new Date(schedule.returnDate).toLocaleDateString() : "N/A"}</td>
                                    <td className="p-4">{formatTime(schedule.returnTime) || "N/A"}</td>
                                    <td className={`p-4 font-bold ${schedule.returnStatus?.toLowerCase() === 'departed' ? 'text-red-500' : 'text-green-500'}`}>
                                        {schedule.returnStatus || "N/A"}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-blue-500 hover:text-blue-700 mx-2" onClick={() => handleEdit(schedule)}>
                                            <FaEdit size={20} />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700 mx-2" onClick={() => confirmDelete(schedule._id)}>
                                            <FaTrash size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div> */}

            <div className="overflow-auto bg-white shadow-lg rounded-lg">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-600 text-white text-left">
                        <tr>
                            <th className="p-4">No</th>
                            <th className="p-4">From</th>
                            <th className="p-4">To</th>
                            <th className="p-4">OnwardStatus</th>
                            <th className="p-4">Departure Date</th>
                            <th className="p-4">Arrival Time</th>
                            <th className="p-4">Trip Type</th>
                            <th className="p-4">Return Date</th>
                            <th className="p-4">Return Time</th>
                            <th className="p-4">ReturnStatus</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedSchedules.length === 0 ? (
                            <tr>
                                <td colSpan="11" className="text-center text-gray-500 p-6">
                                    No schedules found.
                                </td>
                            </tr>
                        ) : (
                            displayedSchedules.map((schedule, index) => (
                                <tr key={schedule._id} className="border-b hover:bg-gray-100 transition">
                                    <td className="p-4">{startIndex + index + 1}</td>
                                    <td className="p-4">{schedule.from || "N/A"}</td>
                                    <td className="p-4">{schedule.to || "N/A"}</td>
                                    <td className={`p-4 font-bold ${schedule.onwardStatus?.toLowerCase() === 'departed' ? 'text-red-500' : 'text-green-500'}`}>
                                        {schedule.onwardStatus || "N/A"}
                                    </td>
                                    <td className="p-4">{schedule.departureDate ? new Date(schedule.departureDate).toLocaleDateString() : "N/A"}</td>
                                    <td className="p-4">{formatTime(schedule.arrivalTime) || "N/A"}</td>
                                    <td className="p-4">{schedule.tripType || "N/A"}</td>
                                    <td className="p-4">{schedule.returnDate ? new Date(schedule.returnDate).toLocaleDateString() : "N/A"}</td>
                                    <td className="p-4">{formatTime(schedule.returnTime) || "N/A"}</td>
                                    <td className={`p-4 font-bold ${schedule.returnStatus?.toLowerCase() === 'departed' ? 'text-red-500' : 'text-green-500'}`}>
                                        {schedule.returnStatus || "N/A"}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-blue-500 hover:text-blue-700 mx-2" onClick={() => handleEdit(schedule)}>
                                            <FaEdit size={20} />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700 mx-2" onClick={() => confirmDelete(schedule._id)}>
                                            <FaTrash size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* {isEditing && selectedSchedule && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Edit Schedule</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1">From</label>
                                <input type="text" value={selectedSchedule.from} onChange={(e) => setSelectedSchedule({ ...selectedSchedule, from: e.target.value })} className="p-2 border rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">To</label>
                                <input type="text" value={selectedSchedule.to} onChange={(e) => setSelectedSchedule({ ...selectedSchedule, to: e.target.value })} className="p-2 border rounded w-full" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <label className="block text-gray-600 mb-1">Onward Status</label>
                                <select
                                    value={selectedSchedule.onwardStatus || "departed"}
                                    onChange={(e) =>
                                        setSelectedSchedule({ ...selectedSchedule, onwardStatus: e.target.value })
                                    }
                                    className="p-2 border rounded w-full"
                                >
                                    <option value="scheduled">Scheduled</option>
                                    <option value="departed">Departed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1">Return Status</label>
                                <select
                                    value={selectedSchedule.returnStatus || "departed"}
                                    onChange={(e) =>
                                        setSelectedSchedule({ ...selectedSchedule, returnStatus: e.target.value })
                                    }
                                    className="p-2 border rounded w-full"
                                >
                                    <option value="scheduled">Scheduled</option>
                                    <option value="departed">Departed</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <label className="block text-gray-600 mb-1">Departure Date</label>
                                <input type="date" value={selectedSchedule.departureDate} onChange={(e) => setSelectedSchedule({ ...selectedSchedule, departureDate: e.target.value })} className="p-2 border rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Arrival Time</label>
                                <input type="time" value={selectedSchedule.arrivalTime} onChange={(e) => setSelectedSchedule({ ...selectedSchedule, arrivalTime: e.target.value })} className="p-2 border rounded w-full" />
                            </div>
                        </div>

                        <div className="mt-2">
                            <label className="block text-gray-600 mb-1">Trip Type</label>
                            <select value={selectedSchedule.tripType} onChange={(e) => setSelectedSchedule({ ...selectedSchedule, tripType: e.target.value })} className="p-2 border rounded w-full">
                                <option value="one-way">One-Way</option>
                                <option value="round-trip">Round-Trip</option>
                            </select>
                        </div>

                        {selectedSchedule.tripType === "round-trip" && (
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="block text-gray-600 mb-1">Return Date</label>
                                    <input type="date" value={selectedSchedule.returnDate || ""} onChange={(e) => setSelectedSchedule({ ...selectedSchedule, returnDate: e.target.value })} className="p-2 border rounded w-full" />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-1">Return Time</label>
                                    <input type="time" value={selectedSchedule.returnTime || ""} onChange={(e) => setSelectedSchedule({ ...selectedSchedule, returnTime: e.target.value })} className="p-2 border rounded w-full" />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-4">
                            <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            )} */}

            {isEditing && selectedSchedule && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Edit Schedule</h3>

                        {/* From & To fields */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 items-center gap-4">
                                <label className="text-gray-600 font-medium">From</label>
                                <input
                                    type="text"
                                    value={selectedSchedule.from || ""}
                                    onChange={(e) =>
                                        setSelectedSchedule({ ...selectedSchedule, from: e.target.value })
                                    }
                                    className="p-2 border rounded-full w-full"
                                    disabled
                                />
                            </div>

                            <div className="grid grid-cols-2 items-center gap-4">
                                <label className="text-gray-600 font-medium">To</label>
                                <input
                                    type="text"
                                    value={selectedSchedule.to || ""}
                                    onChange={(e) =>
                                        setSelectedSchedule({ ...selectedSchedule, to: e.target.value })
                                    }
                                    className="p-2 border rounded-full w-full"
                                    disabled
                                />
                            </div>

                            {/* Trip Type Radio Buttons */}
                            <div className="grid grid-cols-2 items-center gap-4">
                                <label className="text-gray-600 font-medium">Trip Type</label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="tripType"
                                            value="one-way"
                                            checked={selectedSchedule.tripType === "one-way"}
                                            onChange={(e) =>
                                                setSelectedSchedule({ ...selectedSchedule, tripType: e.target.value })
                                            }
                                            className="cursor-pointer"
                                        />
                                        One-Way
                                    </label>
                                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="tripType"
                                            value="round-trip"
                                            checked={selectedSchedule.tripType === "round-trip"}
                                            onChange={(e) =>
                                                setSelectedSchedule({ ...selectedSchedule, tripType: e.target.value })
                                            }
                                            className="cursor-pointer"
                                        />
                                        Round-Trip
                                    </label>
                                </div>
                            </div>

                            {/* One-Way Fields */}
                            {selectedSchedule.tripType === "one-way" && (
                                <>
                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <label className="text-gray-600 font-medium">Departure Date</label>
                                        <input
                                            type="date"
                                            value={selectedSchedule.departureDate || ""}
                                            onChange={(e) =>
                                                setSelectedSchedule({ ...selectedSchedule, departureDate: e.target.value })
                                            }
                                            className="p-2 border rounded-full w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <label className="text-gray-600 font-medium">Arrival Time</label>
                                        <input
                                            type="time"
                                            value={selectedSchedule.arrivalTime || ""}
                                            onChange={(e) =>
                                                setSelectedSchedule({ ...selectedSchedule, arrivalTime: e.target.value })
                                            }
                                            className="p-2 border rounded-full w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <label className="text-gray-600 font-medium">Onward Status</label>
                                        <select
                                            value={selectedSchedule.onwardStatus || "scheduled"}
                                            onChange={(e) =>
                                                setSelectedSchedule({ ...selectedSchedule, onwardStatus: e.target.value })
                                            }
                                            className="p-2 border rounded-full w-full"
                                        >
                                            <option value="scheduled">Scheduled</option>
                                            <option value="departed">Departed</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Round-Trip Fields */}
                            {selectedSchedule.tripType === "round-trip" && (
                                <>
                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <label className="text-gray-600 font-medium">Return Date</label>
                                        <input
                                            type="date"
                                            value={selectedSchedule.returnDate || ""}
                                            onChange={(e) =>
                                                setSelectedSchedule({ ...selectedSchedule, returnDate: e.target.value })
                                            }
                                            className="p-2 border rounded-full w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <label className="text-gray-600 font-medium">Return Time</label>
                                        <input
                                            type="time"
                                            value={selectedSchedule.returnTime || ""}
                                            onChange={(e) =>
                                                setSelectedSchedule({ ...selectedSchedule, returnTime: e.target.value })
                                            }
                                            className="p-2 border rounded-full w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <label className="text-gray-600 font-medium">Return Status</label>
                                        <select
                                            value={selectedSchedule.returnStatus || "scheduled"}
                                            onChange={(e) =>
                                                setSelectedSchedule({ ...selectedSchedule, returnStatus: e.target.value })
                                            }
                                            className="p-2 border rounded-full w-full"
                                        >
                                            <option value="scheduled">Scheduled</option>
                                            <option value="departed">Departed</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between mt-4 px-15">
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full transition"
                                onClick={() => {
                                    setIsEditing(false);
                                    setSelectedSchedule(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full transition"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            )}


            {deleteId && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-gray-200 p-6 rounded-xl shadow-xl w-96 text-center">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Delete Schedule</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this schedule?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg transition">Yes</button>
                            <button onClick={() => setDeleteId(null)} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition">No</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-center items-center gap-3 mt-6">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}>Prev</button>
                <span className="text-gray-700 text-lg font-semibold">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}>Next</button>
            </div>
        </div>
    );
};

export default ScheduleManagement;
