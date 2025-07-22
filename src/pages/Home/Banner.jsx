// src/components/Banner.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router";

export default function Banner() {
  return (
    <section className="w-full max-w-screen-xl mx-auto">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        className="rounded-lg overflow-hidden shadow-lg"
      >
        <SwiperSlide className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center min-h-[320px] md:min-h-[450px] px-6 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Adopt a Loving Pet</h2>
            <p className="mb-8 text-base md:text-lg max-w-3xl mx-auto">
              Give a furry friend a forever home and experience unconditional love.
            </p>
            <button>
              <Link
                to="/pets"
                className="inline-block bg-white text-indigo-700 font-semibold px-6 py-3 rounded-md hover:bg-indigo-100 transition"
              >
                See Pets
              </Link>
            </button>
          </div>
        </SwiperSlide>

        <SwiperSlide className="relative bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white flex items-center justify-center min-h-[320px] md:min-h-[450px] px-6 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Support Our Donation Campaigns</h2>
            <p className="mb-8 text-base md:text-lg max-w-3xl mx-auto">
              Help us provide food and shelter to pets in need.
            </p>
            <button>
              <Link
                to="/donations"
                className="inline-block bg-white text-green-700 font-semibold px-6 py-3 rounded-md hover:bg-green-100 transition"
              >
                Donate Now
              </Link>
            </button>
          </div>
        </SwiperSlide>

        <SwiperSlide className="relative bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white flex items-center justify-center min-h-[320px] md:min-h-[450px] px-6 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Join Our Community</h2>
            <p className="mb-8 text-base md:text-lg max-w-3xl mx-auto">
              Connect with fellow pet lovers and share your adoption story.
            </p>
            <button className="bg-white text-yellow-700 font-semibold px-6 py-3 rounded-md hover:bg-yellow-100 transition">
              Get Involved
            </button>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}
