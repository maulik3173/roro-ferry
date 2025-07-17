import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { format } from "date-fns";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const ReviewPage = () => {
  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem("reviews");
    return savedReviews ? JSON.parse(savedReviews) : [];
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    text: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState("recent");

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);


  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.rating === 0) newErrors.rating = "Rating is required";
    if (formData.text.length < 10) newErrors.text = "Review must be at least 10 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);

      try {
        const response = await fetch("http://localhost:5000/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.name,
            email: formData.email,
            rating: formData.rating,
            review: formData.text,
          }),
        });

        if (response.ok) {
          setFormData({ name: "", email: "", rating: 0, text: "", image: null }); // Reset form
        }
      } catch (error) {
        console.error("Error submitting review:", error);
      }

      setIsSubmitting(false);

    } else {
      setErrors(validationErrors);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOrder === "highest") return b.rating - a.rating;
    return new Date(b.date) - new Date(a.date);
  });

  const RatingStars = ({ rating, interactive = false }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && handleRatingClick(star)}
          className={`text-xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
          aria-label={`Rate ${star} stars`}
        >
          {star <= rating ? <FaStar /> : <FaRegStar />}
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Review Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Write a Review</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <RatingStars rating={formData.rating} interactive />
              {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Your Review</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="4"
                placeholder="Share your experience..."
              />
              {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Add Images</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 block w-full text-sm text-gray-500" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>

        {/* Review Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

          {/* Dropdown for sorting */}
          <select onChange={handleSortChange} value={sortOrder} className="mb-4 p-2 border rounded">
            <option value="recent">Most Recent</option>
            <option value="highest">Most Rated</option>
          </select>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
          >
            {sortedReviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="p-6 border rounded-lg shadow-md bg-gray-50 text-center">
                  <h3 className="font-semibold">{review.name}</h3>
                  <RatingStars rating={review.rating} />
                  <span className="text-sm text-gray-500">{format(new Date(review.date), "MMM d, yyyy")}</span>
                  <p className="mt-2 text-gray-600">{review.text}</p>
                  {review.image && <img src={review.image} alt="Review" className="mt-3 rounded-lg mx-auto max-w-xs" />}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>

      </div>
    </div>
  );
};

export default ReviewPage;

