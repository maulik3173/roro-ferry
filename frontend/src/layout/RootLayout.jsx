import React, { useEffect } from "react";

const RootLayout = ({ children, className }) => {
  // Automatically scroll to the top of the page when the component is rendered
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Added dependency array

  return (
    <div className={`w-full lg:px-24 md:px-16 sm:px-7 px-4 ${className}`}>
      {children} {/* Corrected the typo */}
      
    </div>
  );
};

export default RootLayout;
