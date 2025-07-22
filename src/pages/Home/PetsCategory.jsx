import React from "react";
import { Link } from "react-router";
import cat from "../../assets/cat.png";
import dog from "../../assets/dog.png";
import rabbit from "../../assets/bunny.png";
import fish from "../../assets/fish.png";

const categories = [
  { id: "Cat", label: "Cats", image: cat, color: "from-pink-400 to-pink-600" },
  { id: "Dog", label: "Dogs", image: dog, color: "from-blue-400 to-blue-600" },
  { id: "Rabbit", label: "Rabbit", image: rabbit, color: "from-green-400 to-green-600" },
  { id: "Fish", label: "Fish", image: fish, color: "from-purple-400 to-purple-600" },
];

export default function PetsCategory() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16">
      <h2
        className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-gray-100"
        data-aos="fade-up"
      >
        Explore Pet Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
        {categories.map(({ id, label, image, color }, index) => (
          <Link
            key={id}
            to={`/pets?category=${id}`}
            data-aos="zoom-in"
            data-aos-delay={index * 100}
            className={`
              flex flex-col items-center justify-center
              rounded-3xl
              bg-gradient-to-br ${color}
              shadow-lg
              text-white
              py-8
              px-6
              cursor-pointer
              transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl
            `}
          >
            <div className="w-24 h-24 mb-4">
              <img
                src={image}
                alt={label}
                className="w-full h-full object-contain drop-shadow-lg"
                loading="lazy"
              />
            </div>
            <span className="text-xl font-semibold tracking-wide">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
