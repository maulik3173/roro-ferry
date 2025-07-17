import React from "react";
import TopLayout from "../../layout/toppage/TopLayout"
import Faq from "./Faq";
const About = () => {
  return (
    <div className="w-full">
      {/* Top layout with a background image instead of a video */}
      <div className="w-full space-y-12 pb-16">
        <TopLayout
          bgimg="https://videos.pexels.com/video-files/3994031/3994031-uhd_2560_1440_30fps.mp4"
          title="Frequency Asked Questions"
        />
      </div>

      {/* Faq Section */}
        <Faq />
    </div>
  );
};

export default About;
