import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    if (!email) {
      setError("Email is required");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("resetToken", result.token);
        navigate("/otp", { state: { email } });
        toast.success("OTP sent. Redirecting to OTP - Verification page");
        setError("");
      } else {
        if (result.error === "User not found") {
          setError("Please enter a registered email");
        } else {
          setError(result.error || "Something went wrong");
        }
      }
    } catch (error) {
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen w-screen overflow-auto p-6 bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://img.freepik.com/free-photo/moored-ship-monaco-seaport_1268-14849.jpg?t=st=1746108132~exp=1746111732~hmac=436ace42dd3e9be18ec3fa22c3cff0f5aeeb54e4de70aaaf838dd1efa11bdfc6&w=1380"
          alt="Sea Boat Background"
          className="w-full h-full object-cover brightness-50"
        />
      </div>

      {/* Forgot Password Form */}
      <div className="relative bg-white/10 backdrop-blur-lg p-10 shadow-2xl rounded-2xl w-full max-w-md border border-white/30 transition-all duration-300 hover:shadow-blue-500/50">
        <h2 className="text-xl text-center text-white mb-4">Forgot your password?</h2>
        <p className="text-center text-sm text-white mb-6">
          Remember your password?{" "}
          <a href="/login" className="text-blue-300 underline hover:text-blue-200">
            Login here
          </a>
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-black/40 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300 transition-all duration-300"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-sky-300 to-sky-300 hover:from-sky-400 hover:to-sky-300 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
