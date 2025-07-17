import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddFerryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    ferryCode: "",
    status: "active",
    classes: [
      {
        name: "",
        price: "",
        seats: [{ seatNumber: "", isBooked: false }],
      },
    ],
    categories: [
      { name: "", price: "" },
    ],

  });

  const classOptions = ["Executive", "Sleeper", "Business", "Room"];
  const categoryOptions = ["Passenger", "Car", "Bike", "Bus"];
  const navigate = useNavigate();

  const handleChange = (e, index, seatIndex, type) => {
    const { name, value } = e.target;
    const updatedData = [...formData[type]];

    if (seatIndex !== undefined) {
      updatedData[index].seats[seatIndex][name] = value;
    } else {
      updatedData[index][name] = value;
    }
    setFormData({ ...formData, [type]: updatedData });
  };

  const addClass = () => {
    setFormData({
      ...formData,
      classes: [...formData.classes, { name: "", price: "", seats: [{ seatNumber: "", isBooked: false }] }],
    });
  };

  const addSeat = (index) => {
    const updatedClasses = [...formData.classes];
    updatedClasses[index].seats.push({ seatNumber: "", isBooked: false });
    setFormData({ ...formData, classes: updatedClasses });
  };

  const addCategory = () => {
    setFormData({
      ...formData,
      categories: [...formData.categories, { name: "", price: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        classes: formData.classes.map((cls) => ({
          ...cls,
          price: Number(cls.price),
          seats: cls.seats.map((seat) => ({
            seatNumber: seat.seatNumber,
            isBooked: false,
          })),
        })),
        categories: formData.categories.map((cat) => ({
          ...cat,
          price: cat.name === "Passenger" ? 0 : Number(cat.price),
        })),
      };

      const response = await axios.post("http://localhost:5000/api/add-ferries", payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Ferry added successfully!");
      setTimeout(() => navigate("/admin/ship"), 1500);
      console.log(response.data);
    } catch (error) {
      console.error("Error adding ferry:", error.response?.data || error.message);
      toast.error("Error adding ferry");
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-100">
    //   <div className="w-full max-w-2xl p-10 bg-white rounded-3xl shadow-2xl border border-gray-200">
    //     <h2 className="text-2xl font-semibold mb-4 text-center">Add Ship</h2>

    //     <form onSubmit={handleSubmit}>
    //       <div className="space-y-4 mb-6">
    //         <div className="flex items-center justify-between gap-4">
    //           <label className="w-1/3 font-semibold">Ferry Name</label>
    //           <input type="text" name="name" className="w-2/3 p-2 border rounded" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
    //         </div>

    //         <div className="flex items-center justify-between gap-4">
    //           <label className="w-1/3 font-semibold">Ferry Code</label>
    //           <input type="text" name="ferryCode" className="w-2/3 p-2 border rounded" value={formData.ferryCode} onChange={(e) => setFormData({ ...formData, ferryCode: e.target.value })} required />
    //         </div>
    //       </div>

    //       {formData.classes.map((ferryClass, index) => (
    //         <div key={index} className="border p-4 mb-4 rounded bg-gray-50">
    //           <div className="flex items-center justify-between gap-4 mb-2">
    //             <label className="w-1/3 font-semibold">Class</label>
    //             <select
    //               name="name"
    //               className="w-2/3 p-2 border rounded"
    //               value={ferryClass.name}
    //               onChange={(e) => handleChange(e, index, undefined, 'classes')}
    //               required
    //             >
    //               <option value="">Select Class</option>
    //               {classOptions
    //                 .filter((option) => !formData.classes.some((cls, idx) => cls.name === option && idx !== index))
    //                 .map((className, i) => (
    //                   <option key={i} value={className}>{className}</option>
    //                 ))}
    //             </select>
    //           </div>

    //           <div className="flex items-center justify-between gap-4 mb-2">
    //             <label className="w-1/3 font-semibold">Price</label>
    //             <input type="number" name="price" className="w-2/3 p-2 border rounded" value={ferryClass.price} onChange={(e) => handleChange(e, index, undefined, 'classes')} required />
    //           </div>

    //           {ferryClass.seats.map((seat, seatIndex) => (
    //             <div key={seatIndex} className="flex items-center justify-between gap-4 mb-2 ml-4">
    //               <label className="w-1/3 font-semibold">Seat Number</label>
    //               <input type="text" name="seatNumber" className="w-2/3 p-2 border rounded" value={seat.seatNumber} onChange={(e) => handleChange(e, index, seatIndex, 'classes')} required />
    //             </div>
    //           ))}
    //           <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => addSeat(index)}>+ Add Seat</button>
    //         </div>
    //       ))}

    //       {formData.classes.length < classOptions.length && (
    //         <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={addClass}>
    //           + Add Class
    //         </button>
    //       )}

    //       {formData.categories.map((category, index) => (
    //         <div key={index} className="border p-4 mb-4 rounded bg-gray-50">
    //           <div className="flex items-center justify-between gap-4 mb-2">
    //             <label className="w-1/3 font-semibold">Category</label>
    //             <select
    //               name="name"
    //               className="w-2/3 p-2 border rounded"
    //               value={category.name}
    //               onChange={(e) => handleChange(e, index, undefined, 'categories')}
    //               required
    //             >
    //               <option value="">Select Category</option>
    //               {categoryOptions
    //                 .filter((option) => !formData.categories.some((cat, idx) => cat.name === option && idx !== index))
    //                 .map((categoryName, i) => (
    //                   <option key={i} value={categoryName}>{categoryName}</option>
    //                 ))}
    //             </select>
    //           </div>

    //           {category.name !== "Passenger" && (
    //             <div className="flex items-center justify-between gap-4 mb-2">
    //               <label className="w-1/3 font-semibold">Price</label>
    //               <input
    //                 type="number"
    //                 name="price"
    //                 className="w-2/3 p-2 border rounded"
    //                 value={category.price}
    //                 onChange={(e) => handleChange(e, index, undefined, 'categories')}
    //                 required
    //               />
    //             </div>
    //           )}
    //         </div>
    //       ))}

    //       {formData.categories.length < categoryOptions.length && (
    //         <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={addCategory}>
    //           + Add Category
    //         </button>
    //       )}

    //       <button type="submit" className="w-full mt-8 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-400 text-white font-bold py-4 rounded-xl shadow-lg transition duration-300 transform hover:scale-105">
    //         Submit
    //       </button>
    //     </form>
    //   </div>
    // </div>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-3xl shadow-xl border border-gray-200">
         <h2 className="text-3xl font-extrabold mb-10 text-center bg-gradient-to-r from-gray-500 to-gray-800 bg-clip-text text-transparent">Add Ship</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            {/* Ferry Name */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <label className="font-semibold text-gray-700">Ferry Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-gray-400 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Ferry Code */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <label className="font-semibold text-gray-700">Ferry Code</label>
              <input
                type="text"
                name="ferryCode"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-gray-400 outline-none"
                value={formData.ferryCode}
                onChange={(e) => setFormData({ ...formData, ferryCode: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Classes */}
          {formData.classes.map((ferryClass, index) => (
            <div key={index} className="border p-4 mb-4 rounded bg-gray-50">
              {/* Class Name */}
              <div className="grid grid-cols-2 gap-4 mb-2 items-center">
                <label className="font-semibold text-gray-700">Class</label>
                <select
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  value={ferryClass.name}
                  onChange={(e) => handleChange(e, index, undefined, 'classes')}
                  required
                >
                  <option value="">Select Class</option>
                  {classOptions
                    .filter((option) => !formData.classes.some((cls, idx) => cls.name === option && idx !== index))
                    .map((className, i) => (
                      <option key={i} value={className}>{className}</option>
                    ))}
                </select>
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4 mb-2 items-center">
                <label className="font-semibold text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  value={ferryClass.price}
                  onChange={(e) => handleChange(e, index, undefined, 'classes')}
                  required
                />
              </div>

              {/* Seat Numbers */}
              {ferryClass.seats.map((seat, seatIndex) => (
                <div key={seatIndex} className="grid grid-cols-2 gap-4 mb-2 items-center ml-4">
                  <label className="font-semibold text-gray-700">Seat Number</label>
                  <input
                    type="text"
                    name="seatNumber"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                    value={seat.seatNumber}
                    onChange={(e) => handleChange(e, index, seatIndex, 'classes')}
                    required
                  />
                </div>
              ))}

              {/* Add Seat Button */}
              <button type="button" className="mt-2 bg-gray-500 text-white px-4 py-2 rounded" onClick={() => addSeat(index)}>+ Add Seat</button>
            </div>
          ))}

          {/* Add Class Button */}
          {formData.classes.length < classOptions.length && (
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={addClass}>
              + Add Class
            </button>
          )}

          {/* Categories */}
          {formData.categories.map((category, index) => (
            <div key={index} className="border p-4 mb-4 rounded bg-gray-50">
              {/* Category Name */}
              <div className="grid grid-cols-2 gap-4 mb-2 items-center">
                <label className="font-semibold text-gray-700">Category</label>
                <select
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  value={category.name}
                  onChange={(e) => handleChange(e, index, undefined, 'categories')}
                  required
                >
                  <option value="">Select Category</option>
                  {categoryOptions
                    .filter((option) => !formData.categories.some((cat, idx) => cat.name === option && idx !== index))
                    .map((categoryName, i) => (
                      <option key={i} value={categoryName}>{categoryName}</option>
                    ))}
                </select>
              </div>

              {/* Price (except for "Passenger") */}
              {category.name !== "Passenger" && (
                <div className="grid grid-cols-2 gap-4 mb-2 items-center">
                  <label className="font-semibold text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                    value={category.price}
                    onChange={(e) => handleChange(e, index, undefined, 'categories')}
                    required
                  />
                </div>
              )}
            </div>
          ))}

          {/* Add Category Button */}
          {formData.categories.length < categoryOptions.length && (
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={addCategory}>
              + Add Category
            </button>
          )}

          {/* Submit */}
          <button type="submit" className="w-full mt-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-400 text-white font-bold py-4 rounded-xl shadow-lg transition duration-300 transform hover:scale-105">
            Submit
          </button>
        </form>
      </div>
    </div>


  );
};

export default AddFerryForm;

