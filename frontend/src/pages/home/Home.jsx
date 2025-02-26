import React from "react";
import Hero from "./hero/Hero";
import Service from "./service/Service";
const Home = () => {
  return (
    <div className=" w-full min-h-screen pb-16">
    {/* hero */}
    <Hero />
    {/* service */}
    <Service />
   
    </div>
  );
}; 

export default Home;
