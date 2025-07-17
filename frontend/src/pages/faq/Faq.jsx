import { useState } from "react";

const faqs = [
  {
    question: "How do I book a ticket for the RORO ferry?",
    answer:
      "You can book a ticket online through our website or mobile app, or visit the ticket counter at the terminal."
  },
  {
    question: "What are the operating hours of the RORO ferry?",
    answer:
      "Our ferries operate from 6:00 AM to 10:00 PM daily. Please check the schedule for specific departure times."
  },
  {
    question: "Can I bring my vehicle on the RORO ferry?",
    answer:
      "Yes, our RORO ferry allows vehicles, including cars, motorcycles, and trucks. Make sure to book a vehicle slot in advance."
  },
  {
    question: "What should I do if I lose my ticket?",
    answer:
      "If you lose your ticket, please visit the customer service desk at the terminal with a valid ID for assistance."
  },
  {
    question: "Are there food and beverages available on the ferry?",
    answer:
      "Yes, our ferries have onboard cafeterias and snack bars where you can purchase food and drinks."
  },
  {
    question: "Is there a refund policy for canceled trips?",
    answer:
      "Yes, refunds are available for canceled trips. Please contact our support team or visit the ticket counter for assistance."
  },
  {
    question: "Is there wheelchair access available on the ferry?",
    answer:
      "Yes, our ferries are equipped with wheelchair access to ensure a comfortable journey for passengers with disabilities."
  },
  {
    question: "Can I bring my pet on the ferry?",
    answer:
      "Yes, pets are allowed on the ferry but must be kept in a carrier or on a leash. Please check our pet policy for more details."
  }
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem]">Frequently Asked Questions</h2>
        </div>
        <div>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border border-gray-300 p-4 rounded-xl mb-8 transition-all duration-500 ease-in-out ${
                activeIndex === index ? "bg-indigo-50 border-indigo-600" : ""
              }`}
            >
              <button
                className="flex justify-between w-full text-lg font-normal text-gray-900 transition duration-500 hover:text-indigo-600"
                onClick={() => toggleAccordion(index)}
              >
                <h5>{faq.question}</h5>
                <span className="text-xl">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                  activeIndex === index ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"
                }`}
              >
                <div className="text-base text-gray-900">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;