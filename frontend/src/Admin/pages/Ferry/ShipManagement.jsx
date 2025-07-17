import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ShipManagement = () => {
  const [ferries, setFerries] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFerry, setSelectedFerry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 2;
  const navigate = useNavigate();

  const fetchFerries = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ferries");
      const result = await response.json();
      if (response.ok) {
        setFerries(result.data);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error fetching ferries:", error);
    }
  };

  useEffect(() => {
    fetchFerries();
  }, []);

  const totalPages = Math.max(1, Math.ceil(ferries.length / itemsPerPage));
  const displayedShips = ferries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const response = await fetch(`http://localhost:5000/api/delete-ferries/${deleteId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setFerries(ferries.filter((ship) => ship._id !== deleteId));
          setDeleteId(null);
        } else {
          console.error("Failed to delete ferry");
        }
      } catch (error) {
        console.error("Error deleting ferry:", error);
      }
    }
  };

  const handleEditClick = async (ferryId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/ferry/${ferryId}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();

      if (result?.data) {
        setSelectedFerry({
          ...result.data,
          classes: result.data.classes || [],
          categories: result.data.categories || [],
        });
        setIsEditing(true);
      } else {
        console.error("Error: Invalid ferry data received.");
      }
    } catch (error) {
      console.error("Error fetching ferry:", error.message);
    }
  };

  const handleSave = async () => {
    if (!selectedFerry) return;

    const updatedData = {
      name: selectedFerry.name,
      ferryCode: selectedFerry.ferryCode,
      status: selectedFerry.status,
      classes: selectedFerry.classes,
      categories: selectedFerry.categories,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/ferry/${selectedFerry._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setFerries((prevFerries) =>
          prevFerries.map((f) =>
            f._id === selectedFerry._id ? { ...f, ...selectedFerry } : f
          )
        );
        setIsEditing(false);
        setSelectedFerry(null);
      } else {
        const result = await response.json();
        console.error("Error updating ferry:", result.error);
      }
    } catch (error) {
      console.error("Error updating ferry:", error);
    }
  };


  return (
    <div className="h-screen p-6 bg-gray-100">
      <h2 className="text-4xl font-semibold text-gray-700 text-center mb-6">Ship Management</h2>

      <div className="flex justify-between mb-4">
        <button className="bg-green-500 text-white px-4 py-1 rounded flex items-center" onClick={() => navigate("/admin/add-ferry")}>
          <FaPlus className="mr-2" /> Add Ferry
        </button>
      </div>

      <div className="overflow-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th className="p-4 text-left">No</th>
              <th className="p-4 text-left">Ferry Name</th>
              <th className="p-4 text-left">Ferry Code</th>
              <th className="p-4 text-left">Classes</th>
              <th className="p-4 text-left">Categories</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedShips.map((ship, index) => (
              <tr key={ship._id} className="border-b hover:bg-gray-100 transition">
                <td className="p-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="p-4">{ship.name}</td>
                <td className="p-4">{ship.ferryCode}</td>
                <td className="p-4">
                  <table className="w-full border-collapse border">
                    <thead className="bg-gray-500 text-white">
                      <tr>
                        <th className="border p-2">Class</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Seats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ship.classes.map((cls) => (
                        <tr key={cls._id}>
                          <td className="border p-2">{cls.name}</td>
                          <td className="border p-2">₹{cls.price}</td>
                          <td className="border p-2">{cls.seats.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td className="p-4">
                  <table className="w-full border-collapse border">
                    <thead className="bg-gray-500 text-white">
                      <tr>
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ship.categories.map((cat) => (
                        <tr key={cat._id}>
                          <td className="border p-2">{cat.name}</td>
                          <td className="border p-2">₹{cat.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td className="p-4 text-center">
                  <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditClick(ship._id)}>
                    <FaEdit size={20} />
                  </button>
                  <button className="text-red-500 hover:text-red-700 ml-2" onClick={() => setDeleteId(ship._id)}>
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Prev
        </button>
        <span className="text-gray-700 text-lg font-semibold">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && selectedFerry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-5 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-gray-200">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-6">Edit Ferry</h3>

            {/* Ferry Name & Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-md font-semibold text-gray-700 mb-2">Ferry Name</label>
                <input
                  type="text"
                  value={selectedFerry.name}
                  onChange={(e) =>
                    setSelectedFerry((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="text-md font-semibold text-gray-700 mb-2">Ferry Code</label>
                <input
                  type="text"
                  value={selectedFerry.ferryCode}
                  onChange={(e) =>
                    setSelectedFerry((prev) => ({ ...prev, ferryCode: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>

            {/* Classes Section */}
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-2">Classes</h4>
              {selectedFerry.classes.map((cls, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    value={cls.name}
                    onChange={(e) => {
                      const updated = [...selectedFerry.classes];
                      updated[index].name = e.target.value;
                      setSelectedFerry((prev) => ({ ...prev, classes: updated }));
                    }}
                    className="px-3 py-2 border rounded-lg text-sm"
                    placeholder="Class Name"
                  />
                  <input
                    type="number"
                    value={cls.price}
                    onChange={(e) => {
                      const updated = [...selectedFerry.classes];
                      updated[index].price = e.target.value;
                      setSelectedFerry((prev) => ({ ...prev, classes: updated }));
                    }}
                    className="px-3 py-2 border rounded-lg text-sm"
                    placeholder="Price"
                  />
                </div>
              ))}
            </div>

            {/* Categories Section */}
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-2">Categories</h4>
              {selectedFerry.categories.map((cat, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => {
                      const updated = [...selectedFerry.categories];
                      updated[index].name = e.target.value;
                      setSelectedFerry((prev) => ({ ...prev, categories: updated }));
                    }}
                    className="px-3 py-2 border rounded-lg text-sm"
                    placeholder="Category Name"
                  />
                  <input
                    type="number"
                    value={cat.price}
                    onChange={(e) => {
                      const updated = [...selectedFerry.categories];
                      updated[index].price = e.target.value;
                      setSelectedFerry((prev) => ({ ...prev, categories: updated }));
                    }}
                    className="px-3 py-2 border rounded-lg text-sm"
                    placeholder="Price"
                  />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-xl text-center w-96 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Ferry</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this ferry?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipManagement;
