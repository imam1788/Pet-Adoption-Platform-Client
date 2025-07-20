import React from "react";
import image from "../../assets/eric-ward-ISg37AI2A-s-unsplash.jpg";

export default function AboutUs() {
  return (
    <section
      className="max-w-screen-xl mx-auto px-6 py-16"
      data-aos="fade-up"
    >
      <h2
        className="text-4xl font-extrabold mb-8 text-center text-gray-800 dark:text-gray-100"
        data-aos="zoom-in"
      >
        About Us
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Left Image */}
        <div className="md:w-1/2" data-aos="fade-right">
          <img
            src={image}
            alt="Caring for pets"
            className="rounded-3xl shadow-lg w-full object-cover"
          />
        </div>

        {/* Right Text */}
        <div
          className="md:w-1/2 text-gray-700 dark:text-gray-300 text-lg space-y-6"
          data-aos="fade-left"
        >
          <p>
            Our mission is to create a compassionate community where every pet finds a loving home.
            This platform connects pet lovers and rescues to streamline the adoption process,
            making it easier and faster to give animals a second chance at life.
          </p>
          <p>
            We believe that every animal deserves love, care, and a forever family. Through our
            easy-to-use website, we provide a trusted space for users to discover pets, start adoption
            journeys, and contribute to animal welfare.
          </p>
          <p>
            Join us in making a difference—adopt, donate, or volunteer to help pets find happiness and hope.
          </p>
        </div>
      </div>
    </section>
  );
}
