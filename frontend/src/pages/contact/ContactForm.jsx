import { useState } from "react";
import imgcontact from "../../assets/contact.png"
import toast from "react-hot-toast";

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.message) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.success) {
          toast.success("contact form submitted successfully!");
          setFormData({ name: "", email: "", phone: "", message: "" });
          setErrors({});
        } else {
          toast.error("Failed to submit form");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };



  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 grid-cols-1">
          <div className="lg:mb-0 mb-10">
            <div className="group w-full h-full">
              <div className="relative h-full">
                <img
                  src={imgcontact}
                  alt="Contact Us"
                  className="w-full h-full lg:rounded-l-2xl rounded-2xl bg-blend-multiply bg-indigo-700 object-cover"
                />
                <h1 className="font-manrope text-white text-4xl font-bold leading-10 absolute top-11 left-11">
                  Contact us
                </h1>
                <div className="absolute bottom-0 w-full lg:p-11 p-5">
                  <div className="bg-white rounded-lg p-6">
                    <ContactInfo icon="phone" text="470-601-1911" />
                    <ContactInfo icon="email" text="Pagedone1234@gmail.com" />
                    <ContactInfo icon="location" text="654 Sycamore Avenue, Meadowville, WA 76543" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-5 lg:p-11 lg:rounded-r-2xl rounded-2xl">
            <h2 className="text-indigo-600 font-manrope text-4xl font-semibold leading-10 mb-11">
              Send Us A Message
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <InputField name="name" placeholder="Name" value={formData.name} onChange={handleChange} error={errors.name} />
              <InputField name="email" placeholder="Email" value={formData.email} onChange={handleChange} error={errors.email} />
              <InputField name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
              <InputField name="message" placeholder="Message" value={formData.message} onChange={handleChange} error={errors.message} textarea />
              <button
                type="submit"
                className="w-full h-12 text-white text-base font-semibold leading-6 rounded-full transition-all duration-700 hover:bg-indigo-800 bg-indigo-600 shadow-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const InputField = ({ name, placeholder, value, onChange, error, textarea }) => (
  <div>
    {textarea ? (
      <textarea
        name={name}
        className="w-full h-24 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-lg border border-gray-200 focus:outline-none p-4"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    ) : (
      <input
        type="text"
        name={name}
        className="w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const ContactInfo = ({ icon, text }) => {
  const icons = {
    phone: "M22.3092 18.3098L17 13.0006L22.3092 7.69135C22.7021 7.29843 22.7021 6.66678 22.3092 6.27386L20.7261 4.69079C20.3332 4.29788 19.7015 4.29788 19.3086 4.69079L14 10L8.69135 4.69079C8.29843 4.29788 7.66678 4.29788 7.27386 4.69079L5.69079 6.27386C5.29788 6.66678 5.29788 7.29843 5.69079 7.69135L11 13.0006L5.69079 18.3098C5.29788 18.7027 5.29788 19.3344 5.69079 19.7273L7.27386 21.3104C7.66678 21.7033 8.29843 21.7033 8.69135 21.3104L14 16L19.3086 21.3104C19.7015 21.7033 20.3332 21.7033 20.7261 21.3104L22.3092 19.7273C22.7021 19.3344 22.7021 18.7027 22.3092 18.3098Z",
    email: "M2 8L15 15L28 8",
    location: "M15 29S3 19 3 10A12 12 0 0127 10C27 19 15 29 15 29Z",
  };
  return (
    <div className="flex items-center mb-6">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={icons[icon]} stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h5 className="text-black text-base font-normal leading-6 ml-5">{text}</h5>
    </div>
  );
};

export default ContactForm;
