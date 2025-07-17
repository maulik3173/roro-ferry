import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", rememberMe: "" });

  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: "", password: "", rememberMe: "" };

    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    if (!rememberMe) {
      newErrors.rememberMe = "You must select 'Remember Me' to continue.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("profilePhoto", result.user.profilePhoto);
          localStorage.setItem("userName", result.user.fullName);
          localStorage.setItem("userEmail", result.user.email);
          localStorage.setItem("userPhone", result.user.phone);
          toast.success("Login Successful!");
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          // Handle specific error messages based on backend error field
          if (result.error === "email") {
            setErrors({ email: "Please enter a registered email address.", password: "", rememberMe: "" });
          } else if (result.error === "password") {
            setErrors({ email: "", password: "Please enter the correct password.", rememberMe: "" });
          } else {
            // generic fallback
            setErrors({ email: "Invalid credentials", password: "", rememberMe: "" });
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrors({ email: "Login failed. Try again later.", password: "", rememberMe: "" });
      }
    }
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

      {/* Login Form */}
      <div className="relative bg-white/10 backdrop-blur-lg p-10 shadow-2xl rounded-2xl w-full max-w-md border border-white/30 transition-all duration-300 hover:shadow-blue-500/50">
        {/* <h1 className="text-3xl font-extrabold text-center text-white mb-2">RoRo Ferry System</h1> */}
        <h2 className="text-xl text-center text-white mb-4">Sign in to your account</h2>
        <p className="text-center text-sm text-white mb-6">
          Or <Link to="/register" className="text-blue-300 underline hover:text-blue-200">Create an account</Link>
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-black/40 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300 transition-all duration-300"

          />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-black/40 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300 transition-all duration-300"

          />
          {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

          <div className="flex items-center justify-between text-white text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-500"
              />
              Remember me
            </label>
            <a href="/forgot-password" className="text-blue-300 hover:text-blue-200">
              Forgot password?
            </a>
          </div>
          {errors.rememberMe && <p className="text-red-400 text-sm">{errors.rememberMe}</p>}

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-sky-300 to-sky-300 hover:from-skay-400 hover:to-sky-300 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Sign in
          </button>


        </form>
      </div>
    </div>

  );
};

export default Login;