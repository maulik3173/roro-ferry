import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    if (!email.trim()) {
      setEmailError("Please enter your email.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await axios.post("http://localhost:5000/api/admin-login", {
        email,
        password,
      });

      const token = response.data.token;
      if (token) {
        localStorage.setItem("adminToken", token);
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 3000);
      } else {
        toast.error("Login failed: No token received.");
      }
    } catch (error) {
      const err = error.response?.data;

      if (err?.field === "email") {
        setEmailError(err.message);
      } else if (err?.field === "password") {
        setPasswordError(err.message);
      } else {
        setError(err?.message || "Invalid credentials.");
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen w-screen overflow-auto p-6 bg-black">
      <div className="absolute inset-0">
        <img
          src="https://img.freepik.com/free-photo/moored-ship-monaco-seaport_1268-14849.jpg?t=st=1746108132~exp=1746111732~hmac=436ace42dd3e9be18ec3fa22c3cff0f5aeeb54e4de70aaaf838dd1efa11bdfc6&w=1380"
          alt="Sea Boat Background"
          className="w-full h-full object-cover brightness-50"
        />
      </div>

      <div className="relative bg-white/10 backdrop-blur-lg p-10 shadow-2xl rounded-2xl w-full max-w-md border border-white/30 transition-all duration-300 hover:shadow-blue-500/50">
        <h2 className="text-4xl font-extrabold text-center text-white mb-6">Roro Ferry Admin</h2>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              className="w-full p-4 bg-black/40 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300 transition-all duration-300"
              placeholder="Enter Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <input
              type="password"
              className="w-full p-4 bg-black/40 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300 transition-all duration-300"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-sky-300 to-sky-300 hover:from-skay-400 hover:to-sky-300 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
