import React from "react";

export default function WhyAdopt() {
  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-16 px-6 rounded-2xl">
      <div
        className="max-w-screen-xl mx-auto text-center"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <h2 className="text-4xl font-extrabold mb-6 text-gray-800 dark:text-white">
          Why Adopt From Us?
        </h2>
        <p
          className="text-lg mb-10 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          We ensure every pet is healthy, vaccinated, and ready for a loving home. Our adoption process is easy, transparent, and built around the best interests of both pets and families.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <h3 className="text-xl font-semibold mb-3 text-indigo-600">
              Health Checked
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              All pets receive proper medical exams, vaccinations, and necessary treatments before adoption.
            </p>
          </div>
          <div
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <h3 className="text-xl font-semibold mb-3 text-green-600">
              Pre-Loved Pets
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Many pets come from families or shelters and are already trained and socialized.
            </p>
          </div>
          <div
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow"
            data-aos="zoom-in"
            data-aos-delay="500"
          >
            <h3 className="text-xl font-semibold mb-3 text-pink-600">
              Supportive Adoption
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our team supports you even after adoption with guidance and resources.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
