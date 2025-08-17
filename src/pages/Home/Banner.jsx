import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules"; // Removed Navigation

import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router";

// Example images
import banner1 from "../../assets/front-view-beautiful-dog-with-copy-space.jpg";
import banner3 from "../../assets/image-cheerful-young-man-rejoicing-looking-cute-black-dog-pug-smiling-standing-white.jpg";
import banner2 from "../../assets/closeup-shot-snouts-cute-dog-cat-sitting-cheek-cheek.jpg";

export default function Banner() {
  return (
    <section className="w-full max-w-screen-xl mx-auto -mt-6">
      <Swiper
        modules={[Autoplay, Pagination]} // Removed Navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        className="rounded-lg overflow-hidden shadow-lg"
      >
        {/* Slide 1 */}
        <SwiperSlide className="relative flex items-center justify-center min-h-[320px] md:min-h-[450px] px-6 py-32 text-white">
          <img
            src={banner1}
            alt="Adopt a Loving Pet"
            className="absolute inset-0 w-full h-full object-cover brightness-75"
          />
          <div className="relative text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Adopt a Loving Pet</h2>
            <p className="mb-8 text-base md:text-lg max-w-3xl mx-auto">
              Give a furry friend a forever home and experience unconditional love.
            </p>
            <Link
              to="/pets"
              className="inline-block bg-white text-indigo-700 font-semibold px-6 py-3 rounded-md hover:bg-indigo-100 transition"
            >
              See Pets
            </Link>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide className="relative flex items-center justify-center min-h-[320px] md:min-h-[450px] px-6 py-32 text-white">
          <img
            src={banner2}
            alt="Donation Campaigns"
            className="absolute inset-0 w-full h-full object-cover brightness-75"
          />
          <div className="relative text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Support Our Donation Campaigns</h2>
            <p className="mb-8 text-base md:text-lg max-w-3xl mx-auto">
              Help us provide food and shelter to pets in need.
            </p>
            <Link
              to="/donations"
              className="inline-block bg-white text-green-700 font-semibold px-6 py-3 rounded-md hover:bg-green-100 transition"
            >
              Donate Now
            </Link>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide className="relative flex items-center justify-center min-h-[320px] md:min-h-[450px] px-6 py-32 text-white">
          <img
            src={banner3}
            alt="Join Community"
            className="absolute inset-0 w-full h-full object-cover brightness-75"
          />
          <div className="relative text-center max-w-4xl mx-auto">
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
