import React from "react";
import Hero from "./hero/Hero";
import Contact from "../contact/ContactForm";
import Service from "./service/Service";
import FeedbackReview from "../feedback/FeedbackReview";
const Home = () => {
  return (
    <div className=" w-full min-h-screen pb-16">
    {/* hero */}
    <Hero />
    {/* service */}
    <Service />
    {/* <About /> */}

    <Contact />
    <FeedbackReview />
    </div>
  );
}; 

export default Home;
