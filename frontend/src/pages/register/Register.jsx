import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.fullName) {
      tempErrors.fullName = "Name is required";
    }

    if (!formData.email) {
      tempErrors.email = "Email is required";
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
    }
    else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = "Invalid phone number (must be 10 digits)";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted successfully", formData);
      try {
        const response = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
          toast.success("Registration successful!");
          setTimeout(() => {
            navigate("/login", { state: { email: formData.email } });
          }, 3000);

        } else {
          setErrors({ server: result.message || "Registration failed" });
        }
      } catch (error) {
        console.error("Error:", error);
        setErrors({ server: "Server error, please try again" });
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
  
    {/* Styled Register Form */}
    <div className="relative bg-white/10 backdrop-blur-lg p-10 shadow-2xl rounded-2xl w-full max-w-md border border-white/30 transition-all duration-300 hover:shadow-blue-500/50">
      <h1 className="text-3xl text-white text-center font-bold mb-2">RoRo Ferry System</h1>
      <h2 className="text-xl text-center text-white mb-6">Create a New Account</h2>
  
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter your full name" },
          { label: "Email Address", name: "email", type: "email", placeholder: "Enter your email address" },
          { label: "Password", name: "password", type: "password", placeholder: "Create a password" },
          { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "Confirm your password" },
          { label: "Phone Number", name: "phone", type: "text", placeholder: "Enter your phone number" },
        ].map(({ label, name, type, placeholder }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm text-white mb-1">
              {label}
            </label>
            <input
              type={type}
              id={name}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className="w-full p-4 bg-black/40 text-white placeholder-gray-300 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors[name] && <p className="text-red-400 text-sm">{errors[name]}</p>}
          </div>
        ))}
  
        <button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-sky-300 to-sky-300 hover:from-sky-400 hover:to-sky-300 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
        >
          Create Account
        </button>
  
        <p className="text-center text-sm text-white mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 underline hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  </div>
  );
};

export default SignupForm;