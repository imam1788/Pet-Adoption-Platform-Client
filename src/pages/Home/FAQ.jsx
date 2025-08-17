import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I adopt a pet from PetHaven?",
    answer:
      "You can start by browsing available pets, filling out an adoption application, and scheduling a meet-and-greet. Once approved, you can take your new friend home!",
  },
  {
    question: "What is the adoption fee?",
    answer:
      "Adoption fees vary depending on the pet’s age and medical needs. Fees typically cover vaccinations, microchipping, and spay/neuter services.",
  },
  {
    question: "Can I foster a pet before adoption?",
    answer:
      "Yes! Fostering is a great way to provide temporary care for pets while deciding if adoption is right for you.",
  },
  {
    question: "Are pets vaccinated and spayed/neutered?",
    answer:
      "Yes, all pets available for adoption are fully vaccinated, microchipped, and spayed/neutered before joining their forever homes.",
  },
  {
    question: "Can I return a pet if it’s not a good fit?",
    answer:
      "We understand sometimes it doesn’t work out. Pets can be returned safely to us, and we’ll help you find a better match.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-950 dark:text-cyan-400">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full p-4 text-left focus:outline-none"
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="p-4 pt-0 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
