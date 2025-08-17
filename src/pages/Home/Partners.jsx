import React from "react";

import image1 from '../../assets/Untitled design.png'
import image2 from '../../assets/Untitled design (1).png'
import image3 from '../../assets/Untitled design (3).png'
import image4 from '../../assets/Pet Lovers (1).png'
import image5 from '../../assets/Pet Lovers.png'

const partners = [
  {
    name: "Animal Welfare Org",
    logo: image1,
  },
  {
    name: "PetCare Clinic",
    logo: image2,
  },
  {
    name: "Happy Paws NGO",
    logo: image3,
  },
  {
    name: "Vet Partners",
    logo: image4,
  },
  {
    name: "Pet Lovers Foundation",
    logo: image5,
  },
];

const Partners = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-cyan-950 dark:text-cyan-400">
          Our Trusted Partners
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
          We collaborate with amazing organizations and sponsors who support our
          mission of finding loving homes for every pet.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {partners.map((partner, index) => (
            <div key={index} className="flex justify-center">
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-24 object-contain transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
