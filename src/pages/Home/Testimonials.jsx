import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const testimonialsData = [
  {
    name: "Sarah Williams",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    message:
      "Adopting Max was the best decision ever! He has brought so much joy and love into our home.",
  },
  {
    name: "James Anderson",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    message:
      "The adoption process was smooth and the team was very supportive. Bella is now part of our family!",
  },
  {
    name: "Emily Johnson",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    message:
      "I highly recommend PetHaven. Their volunteers are amazing and I found my perfect furry companion here.",
  },
  {
    name: "Michael Brown",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    message:
      "Fantastic experience! The team helped me adopt Buddy quickly, and he is full of love and energy.",
  },
  {
    name: "Olivia Martinez",
    photo: "https://randomuser.me/api/portraits/women/22.jpg",
     message:
    "PetHaven makes adoption so easy and personal. Our new kitten Luna is perfect! We love the support from the team.",
  },
  {
    name: "David Wilson",
    photo: "https://randomuser.me/api/portraits/men/50.jpg",
    message:
      "I can't thank the volunteers enough. They helped us find Charlie, who fits right into our family.",
  },
];

export default function Testimonials() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [navigationReady, setNavigationReady] = useState(false);

  // Wait for buttons to be in DOM
  useEffect(() => {
    setNavigationReady(true);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-950 dark:text-cyan-400">
        Happy Adopters
      </h2>

      {navigationReady && (
        <Swiper
          modules={[Autoplay, Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          className="pb-12"
        >
          {testimonialsData.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md flex flex-col items-center text-center mb-12">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-16 h-16 rounded-full mb-4 object-cover border-2 border-indigo-500"
                />
                <p className="text-gray-700 dark:text-gray-200 mb-4">
                  "{t.message}"
                </p>
                <h3 className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {t.name}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Navigation Arrows Below */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          ref={prevRef}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          &#8592;
        </button>
        <button
          ref={nextRef}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          &#8594;
        </button>
      </div>
    </section>
  );
}
