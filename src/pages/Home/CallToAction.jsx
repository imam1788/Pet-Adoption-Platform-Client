import React from "react";
import { Link } from "react-router";

export default function CallToAction() {
  return (
    <section
      className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-16 md:py-20 px-6 rounded-2xl"
      data-aos="fade-up"
    >
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=600&q=80"
            alt="Happy adopted pet"
            className="rounded-3xl shadow-lg w-full h-full object-cover"
            data-aos="zoom-in"
          />
        </div>
        
        <div className="md:w-1/2 text-center md:text-left">
          <h2
            className="text-3xl md:text-4xl font-extrabold mb-6 drop-shadow-lg"
            data-aos="fade-left"
          >
            Give a Pet a Loving Home Today
          </h2>
          <p className="text-base md:text-lg mb-8 leading-relaxed drop-shadow-md" data-aos="fade-left">
            Every pet deserves a second chance at happiness. By adopting a pet, you not only
            save a life but gain a loyal friend for life. Start your journey of love and compassion now!
          </p>
          <Link
            to="/pets"
            className="inline-block rounded-full bg-white text-primary font-semibold px-8 py-3 hover:bg-white/90 transition"
            data-aos="fade-up"
          >
            Find Your New Friend
          </Link>
        </div>
      </div>
    </section>
  );
}
