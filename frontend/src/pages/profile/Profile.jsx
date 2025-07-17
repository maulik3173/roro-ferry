import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
    const navigate = useNavigate();
    const [profilePhoto, setProfilePhoto] = useState("https://via.placeholder.com/40");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [prevUserName, setPrevUserName] = useState("");
    const [prevEmail, setPrevEmail] = useState("");
    const [prevPhone, setPrevPhone] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        const storedPhoto = localStorage.getItem("profilePhoto");
        const storedName = localStorage.getItem("userName");
        const storedEmail = localStorage.getItem("userEmail");
        const storedPhone = localStorage.getItem("userPhone");

        if (storedPhoto) setProfilePhoto(storedPhoto);
        if (storedName) setUserName(storedName);
        if (storedEmail) setEmail(storedEmail);
        if (storedPhone) setPhone(storedPhone);

        const interval = setInterval(() => {
            const currentToken = localStorage.getItem("token");
            if (!currentToken) {
                navigate("/");
            }
        }, 1000); 
    
        return () => clearInterval(interval);

    }, [token, navigate]);

    const handleUpdate = async () => {
        setLoading(true);

        if (!token) {
            toast.error("No authentication token found! Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ fullName: userName, email, phone }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Profile updated successfully!");
                localStorage.setItem("userName", userName);
                localStorage.setItem("userEmail", email);
                localStorage.setItem("userPhone", phone);
                setEditing(false);
            } else {
                toast.error(result.message || "Error updating profile");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong! Please try again.");
        }
        setLoading(false);
    };

    const handleEdit = () => {
        setPrevUserName(userName);
        setPrevEmail(email);
        setPrevPhone(phone);
        setEditing(true);
    };

    const handleCancel = () => {
        setUserName(prevUserName);
        setEmail(prevEmail);
        setPhone(prevPhone);
        setEditing(false);
        navigate("/")
    };

    return (
        <div className="relative flex items-center justify-center h-screen w-screen overflow-auto p-6 bg-black">
  {/* Background Image */}
  <div className="absolute inset-0">
    <img
      src="https://img.freepik.com/free-photo/moored-ship-monaco-seaport_1268-14849.jpg?t=st=1746108132~exp=1746111732~hmac=436ace42dd3e9be18ec3fa22c3cff0f5aeeb54e4de70aaaf838dd1efa11bdfc6&w=1380"
      alt="Sea Boat Background"
      className="w-full h-full object-cover brightness-50"
    />
  </div>

  {/* Profile Card */}
  <div className="relative bg-white/10 backdrop-blur-lg p-10 shadow-2xl rounded-2xl w-full max-w-md border border-white/30 transition-all duration-300 hover:shadow-blue-500/50 text-white">
    <h1 className="text-center text-3xl font-extrabold mb-2">RoRo Ferry System</h1>
    <h2 className="text-center text-xl font-semibold mb-6">Profile</h2>

    <div className="flex justify-center mb-6">
      <img
        src={profilePhoto}
        alt="Profile"
        className="w-24 h-24 rounded-full border-4 border-white shadow-md"
      />
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-1">Full Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={!editing}
          className="w-full p-3 bg-black/40 border border-gray-600 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!editing}
          className="w-full p-3 bg-black/40 border border-gray-600 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={!editing}
          className="w-full p-3 bg-black/40 border border-gray-600 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
      </div>

      {editing ? (
        <div className="flex gap-3">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
          <button
            onClick={handleCancel}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={handleEdit}
          className="w-full mt-6 bg-gradient-to-r from-sky-300 to-sky-300 hover:from-sky-400 hover:to-sky-300 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
        >
          Edit Profile
        </button>
      )}
    </div>
  </div>
</div>

    );
};

export default Profile;