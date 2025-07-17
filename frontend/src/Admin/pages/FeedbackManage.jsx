import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const feedbacksPerPage = 10;

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/get-feedback");
      setFeedbacks(response.data);
      setFilteredFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearch(term);
    const filtered = feedbacks.filter(
      (feedback) =>
        feedback.fullName.toLowerCase().includes(term.toLowerCase()) ||
        feedback.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredFeedbacks(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:5000/api/feedback/${deleteId}`);
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== deleteId));
      setFilteredFeedbacks(filteredFeedbacks.filter((feedback) => feedback._id !== deleteId));
      
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
    setDeleteId(null);
  };

  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);

  return (
    <div className="h-screen p-6 bg-gray-100">
      <h2 className="text-4xl font-semibold text-gray-700 text-center mb-6">Feedback Management</h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search feedbacks..."
          value={search}
          onChange={handleSearch}
          className="w-72 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
        />
      </div>

      <div className="overflow-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th className="p-4 text-left">Full Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Rating</th>
              <th className="p-4 text-left">Review</th>
              <th className="p-4 text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentFeedbacks.length > 0 ? (
              currentFeedbacks.map((feedback) => (
                <tr key={feedback._id} className="border-b hover:bg-gray-100 transition">
                  <td className="p-4">{feedback.fullName}</td>
                  <td className="p-4">{feedback.email}</td>
                  <td className="p-4">{feedback.rating}</td>
                  <td className="p-4">{feedback.review}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setDeleteId(feedback._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-3"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">No feedback available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-gray-200 p-6 rounded-xl shadow-xl w-96 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Delete Feedback</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this feedback?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg transition"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Prev
        </button>
        <span className="text-gray-700 text-lg font-semibold">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastFeedback >= filteredFeedbacks.length}
          className={`px-4 py-2 rounded-lg ${indexOfLastFeedback >= filteredFeedbacks.length ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;
