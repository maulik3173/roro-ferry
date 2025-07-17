import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const OtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const otpLength = 6;
  const [otp, setOtp] = useState(new Array(otpLength).fill(""));
  const inputRefs = useRef([]);
  const [error, setError] = useState("");

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");


  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index, event) => {
    const value = event.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    try {
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "OTP has expired. Please request a new one.") {
          setError("OTP has expired. Please request a new one.");
        } else if (data.message === "Invalid OTP") {
          setError("Invalid OTP. Please try again.");
        } else {
          setError(data.message || "Invalid OTP. Please try again.");
        }
        return;
      }

      localStorage.setItem("resetToken", data.token);
      toast.success("OTP verified successfully!");

      setTimeout(() => {
        setIsOtpVerified(true);
        setError("");
      }, 3000);

    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setCanResend(false);
    setCountdown(60);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("New OTP sent to your email");
      } else {
        setError(data.error || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setError("Failed to resend OTP. Try again later.");
    }
  };


  const handlePasswordReset = async (e) => {
    e.preventDefault();

    setNewPasswordError("");
    setConfirmPasswordError("");
    setError("");

    let hasError = false;

    if (!newPassword) {
      setNewPasswordError("New password is required.");
      hasError = true;
    } else if (newPassword.length < 6) {
      setNewPasswordError("Password must be at least 6 characters.");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    }

    if (hasError) return;

    const token = localStorage.getItem("resetToken");
    if (!token) {
      setError("Session expired. Please verify OTP again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successful!");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.error || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      setError("Server error, please try again later.");
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

      {/* OTP / Reset Password Form */}
      <div className="relative bg-white/10 backdrop-blur-lg p-10 shadow-2xl rounded-2xl w-full max-w-md border border-white/30 transition-all duration-300 hover:shadow-blue-500/50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">
            {isOtpVerified ? "Reset Password" : "Enter OTP"}
          </h1>
          <p className="mt-2 text-sm text-gray-200">
            {isOtpVerified ? "Create a new password" : `OTP has been sent to ${email}`}
          </p>
        </div>

        {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}

        {!isOtpVerified && (
          <form onSubmit={handleSubmitOtp} className="mt-5">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-400 bg-black/40 text-white rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                  maxLength="1"
                />
              ))}
            </div>

            <button
              type="submit"
              className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-sky-300 to-sky-300 hover:from-sky-400 hover:to-sky-300 text-white font-bold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
              Verify OTP
            </button>
          </form>
        )}

        {!isOtpVerified && (
          <div className="mt-4 text-center">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                className="text-blue-300 hover:text-blue-200 underline font-medium"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-300 text-sm">
                Resend OTP in <strong>{countdown}</strong> seconds
              </p>
            )}
          </div>
        )}

        {isOtpVerified && (
          <form onSubmit={handlePasswordReset} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-bold text-white">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full py-3 px-4 bg-black/40 border border-gray-600 text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 placeholder-gray-300"
              />
              {newPasswordError && <p className="text-red-400 text-xs mt-1">{newPasswordError}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-white">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full py-3 px-4 bg-black/40 border border-gray-600 text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 placeholder-gray-300"
              />
              {confirmPasswordError && <p className="text-red-400 text-xs mt-1">{confirmPasswordError}</p>}
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-sky-300 to-sky-300 hover:from-sky-400 hover:to-sky-300 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>

  );
};

export default OtpPage;

