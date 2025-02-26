import React from "react";
import TopLayout from "../../layout/toppage/TopLayout"

const About = () => {
  return (
    <div className="w-full">
      {/* Top layout with a background image instead of a video */}
      <div className="w-full space-y-12 pb-16">
        <TopLayout
          bgimg="https://videos.pexels.com/video-files/3994031/3994031-uhd_2560_1440_30fps.mp4"
          title="About us"
        />
      </div>

      {/* About Section */}
      <section className="py-16 w-full">
        <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 items-center">
            
            {/* Video on the left */}
            <div className="w-full flex justify-center">
              <video
                className="h-full rounded-3xl object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source
                  src="https://cdn.pixabay.com/video/2016/07/05/3713-173505175_tiny.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Text Content on the right */}
            <div className="flex flex-col gap-6">
              <h2 className="text-gray-900 text-4xl font-bold lg:text-start text-center">
                India’s Largest RoRo/RoPax Ferry Service
              </h2>
              <h4 className="text-gray-900 font-semibold lg:text-start text-center">
                Milestones of RORO Ferry
              </h4>
              <p className="text-gray-500 text-base leading-relaxed lg:text-start text-center">
                ISPL under the brand name of DG SEA CONNECT is India’s first Roll On-Roll Off Ferry Service provider. 
                The project successfully reduces the travel distance between Hazira and Ghogha from 360km (12 hours by road) 
                to just 90km (4 hours by sea), offering a cost-effective and time-saving solution.
              </p>
              <p className="text-gray-500 text-base leading-relaxed lg:text-start text-center">
                Inaugurated by Honorable PM Shri Narendra Modi & Center Shipping Minister Shri Mansukh Mandaviya, 
                RoPax ferry has transported over:
              </p>
              <ul className="list-disc text-gray-500 pl-6">
                <li>8,70,000 Passengers</li>
                <li>1,23,000 Cars</li>
                <li>77,000 Bikes</li>
                <li>98,500 Cargo Vehicles</li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
