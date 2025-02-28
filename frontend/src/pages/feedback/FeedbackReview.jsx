import React, { useState } from 'react';
import FeedbackForm from './FeddbackForm'; // Import the FeedbackForm component
import StarRating from './StarRating'; // Reusable StarRating component

const FeedbackReview = () => {
  const [reviews, setReviews] = useState([
    {
      rating: 5,
      title: "Outstanding Experience!!!",
      author: "John Watson",
      date: "Nov 01, 2023",
      content:
        "One of the standout features of Pagedone is its intuitive and user-friendly interface. Navigating through the system feels natural, and the layout makes it easy to locate and utilize various design elements. This is particularly beneficial for designers looking to streamline their workflow.",
      authorImage: "https://pagedone.io/asset/uploads/1704349572.png",
    },
    {
      rating: 5,
      title: "Pagedone's design system seamlessly bridges the gap between designers and developers!",
      author: "Robert Karmazov",
      date: "Nov 01, 2023",
      content:
        "Pagedone doesn't disappoint when it comes to the variety and richness of its design components. From pre-built templates to customizable elements, the system caters to both beginners and seasoned designers. The extensive library ensures a diverse range of options to bring creative visions to life.",
      authorImage: "https://pagedone.io/asset/uploads/1704351103.png",
    },
  ]);

  const handleSubmitReview = (newReview) => {
    setReviews([...reviews, { ...newReview, authorImage: "https://via.placeholder.com/150" }]);
  };

  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-6 mx-auto">
        <div className="w-full">
          <h2 className="font-manrope font-bold text-4xl text-black mb-8 text-center">Our customer reviews</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-11 pb-11 border-b border-gray-100 max-xl:max-w-2xl max-xl:mx-auto">
            <div className="box flex flex-col gap-y-4 w-full">
              {/* Rating bars */}
              {[5, 4, 3, 2, 1].map((star, index) => (
                <div key={index} className="flex items-center w-full">
                  <p className="font-medium text-lg text-black mr-0.5">{star}</p>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z" fill="#FBBF24" />
                  </svg>
                  <p className="h-2 w-full sm:min-w-[278px] rounded-3xl bg-amber-50 ml-5 mr-3">
                    <span className="h-full w-[30%] rounded-3xl bg-amber-400 flex"></span>
                  </p>
                  <p className="font-medium text-lg text-black mr-0.5">989</p>
                </div>
              ))}
            </div>
            <div className="p-8 bg-amber-50 rounded-3xl flex items-center justify-center flex-col">
              <h2 className="font-manrope font-bold text-5xl text-amber-400 mb-6">4.3</h2>
              <StarRating rating={4} />
              <p className="font-medium text-xl leading-8 text-gray-900 text-center">46 Ratings</p>
            </div>
          </div>

          {/* Feedback Form */}
          <FeedbackForm onSubmit={handleSubmitReview} />

          {/* Reviews */}
          {reviews.map((review, index) => (
            <div key={index} className="pt-8">
              <StarRating rating={review.rating} />
              <h3 className="font-manrope font-semibold text-xl sm:text-2xl leading-9 text-black mb-6">{review.title}</h3>
              <div className="flex sm:items-center flex-col min-[400px]:flex-row justify-between gap-5 mb-4">
                <div className="flex items-center gap-3">
                  <img src={review.authorImage} alt={review.author} className="w-8 h-8 rounded-full object-cover" />
                  <h6 className="font-semibold text-lg leading-8 text-indigo-600">{review.author}</h6>
                </div>
                <p className="font-normal text-lg leading-8 text-gray-400">{review.date}</p>
              </div>
              <p className="font-normal text-lg leading-8 text-gray-400 max-xl:text-justify">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackReview;