import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center flex-col">
    {/* hero */}
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-5xl text-neutral-800 font-bold">
          This is the Hero page
        </h1>
      </div>
    {/* About */}
      <div className="w-full h-screen flex items-center justify-center bg-neutral-950">
        <h1 className="text-5xl text-neutral-800 font-bold">
          This is the About page
        </h1>
      </div>
    </div>
  );
};

export default Home;
