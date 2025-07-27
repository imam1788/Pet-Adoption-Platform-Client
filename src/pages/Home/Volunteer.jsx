import React from "react";
import playingWithPets from "../../assets/playing-with-their-pets.jpg"

export default function Volunteer() {
  return (
    <section className="py-16 px-6 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-2xl">
      <div
        className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-10"
        data-aos="fade-up"
      >
        {/* Text Side */}
        <div className="md:w-1/2" data-aos="fade-right" data-aos-delay="200">
          <h2 className="text-4xl font-extrabold mb-6">Become a Volunteer</h2>
          <p className="mb-6 text-lg leading-relaxed">
            Want to help animals but can’t adopt? You can still make a big impact by volunteering your time. From helping at adoption events to fostering pets, there's a role for everyone.
          </p>
          <button className="bg-white text-teal-700 font-semibold px-6 py-3 rounded-full hover:bg-teal-100 transition">
            Sign Up to Volunteer
          </button>
        </div>

        {/* Image Side */}
        <div className="md:w-1/2" data-aos="fade-left" data-aos-delay="400">
          <img
            src={playingWithPets}
            alt="Volunteer with pets"
            className="rounded-3xl shadow-lg w-96 h-80 md:ml-28 object-cover"
          />
        </div>
      </div>
    </section>
  );
}
