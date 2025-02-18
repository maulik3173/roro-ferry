import React from "react";

const Slider = () => {
  return (
    <div className="relative">
      {/* Background Image */}
      <img 
        src="/images/carousel-1.jpg" 
        alt="Transport & Logistics" 
        className="w-full h-screen object-cover"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center font-mono bg-black bg-opacity-50">
        <div className="text-center text-white max-w-2xl mx-auto">
          <h4 className="text-lg font-semibold mb-4">Fast Reliable Easy</h4>
          <h1 className="text-5xl font-bold mb-20 font-outfit ">
            Indias Largest  <span className="text-blue-500">Ro-Pax Ferry</span> Service
          </h1>
          {/* <p className="text-lg mb-8">
            Vero elitr justo clita lorem. Ipsum dolor at sed stet sit diam no. Kasd rebum ipsum et diam justo clita et kasd rebum sea elitr.
          </p> */}
        
          <div className="space-x-4">
            <a href="#" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300">
              Book Now
            </a>
           
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Slider;