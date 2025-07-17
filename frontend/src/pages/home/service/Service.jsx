import React from "react";

const services = [
  {
    title: "Travel Year-round",
    description: " 1st Ro-Pax Ferry that operational year-round, even during monsoons.",
    image: "https://media.istockphoto.com/id/2188873188/photo/the-royal-teso-n-v-is-a-private-ferry-compagny-operating-boat-service-to-and-from-the-dutch.jpg?s=612x612&w=0&k=20&c=3CZEr3zefxPPpsXt-vdkxLL0twvjd9rSOy-keRjUCzE=",
    span: "md:col-span-2 md:row-span-2" 
  },
  {
    title: "Vehicle Deck",
    description: "Our vehicle deck can accommodate over 120 cars, two-wheelers, and even buses.",
    image: "https://media.istockphoto.com/id/1286794540/photo/ro-ro-ferry-india.jpg?s=612x612&w=0&k=20&c=7j2Nq99oU7FNlW9DlanI5V7GKdf6TYCr_JRMi3cFzDk=",
  },
  {
    title: "Cafeteria",
    description: "Our cafeteria is ready with your favourite bites & refreshments to add more flavour to your sails.",
    image: "https://media.istockphoto.com/id/1494881193/photo/view-from-inside-a-ferry.jpg?s=612x612&w=0&k=20&c=tlJrDjHrR_EH7-fq3FcJFvU7yrqKzjo5q-AsE9bROFw=",
  },
  {
    title: "Lounge Area",
    description: "Our spacious indoor lounge area is equipped with all the amenities for a comfortable sail.",
    image: "https://media.istockphoto.com/id/486789007/photo/passengers-rest-inside-the-ferry.jpg?s=612x612&w=0&k=20&c=Y0rE62eeKBoyKYsSCURbRo7BX02E2-aJixGEIO1vbWQ=",
    // span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Secure Online Payments",
    description: "Users can pay safely via credit/debit cards, digital wallets, and other payment options.",
    image: "https://media.istockphoto.com/id/1952832315/photo/online-shopping-man-hold-credit-or-debit-card-make-online-purchase.jpg?s=612x612&w=0&k=20&c=1bGkjnW6YJ76d3tF4Wn6-nSh56iORYt7DcbowHtTdRM=",
  },
];

const Service = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full flex items-center p-8 justify-center text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome To <span className="text-primary">Roro Ferry</span></h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div key={index} className={`relative overflow-hidden rounded-2xl shadow-lg group ${service.span || ""}`}>
              <img src={service.image} alt={service.title} className="w-full h-48 md:h-full object-cover" />
              
              {/* Centered Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                <h4 className="text-2xl font-bold text-white">{service.title}</h4>
                <p className="text-white">{service.description}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
