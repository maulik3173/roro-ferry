import React from "react";
import Hero from "./hero/Hero";
import Contact from "../contact/ContactForm";
import Service from "./service/Service";
import ReviewPage from "../review/ReviewPage";

// import Faq from "../faq/FaqSection";
const Home = () => {
  return (
    <div className=" w-full min-h-screen pb-16">

    <Hero />
    
    <Service />
    
    <Contact />
   
    <ReviewPage/>
   
    </div>
  );
}; 

export default Home;
