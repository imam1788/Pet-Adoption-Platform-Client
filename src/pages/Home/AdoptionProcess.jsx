import React from "react";
import { PawPrint } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Fill Out Application",
    desc: "Submit an adoption application with details about your home and lifestyle.",
  },
  {
    id: 2,
    title: "Meet Your Pet",
    desc: "Visit our shelter or meet foster families to connect with pets in need.",
  },
  {
    id: 3,
    title: "Adoption Approval",
    desc: "Our team reviews your application and ensures the right match for you and the pet.",
  },
  {
    id: 4,
    title: "Welcome Home",
    desc: "Bring your new friend home and start your amazing journey together.",
  },
];

const AdoptionProcess = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-950 dark:text-cyan-400">
        How Adoption Works
      </h2>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-700 mx-auto mb-4">
              <PawPrint className="text-indigo-600 dark:text-white" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdoptionProcess;
