import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import { useState } from "react";
import AdoptModal from "./AdopModal";

const PetDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [showModal, setShowModal] = useState(false);

  const { data: pet, isLoading, isError } = useQuery({
    queryKey: ['pet', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pets/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Pet not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-gray-900 rounded shadow p-6">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-64 object-cover rounded"
        />

        <h2 className="text-3xl font-bold mt-4 text-primary dark:text-primary">
          {pet.name}
        </h2>

        <p className="mt-2 text-gray-700 dark:text-gray-300">{pet.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-4 text-gray-800 dark:text-gray-300">
          <p><strong>Age:</strong> {pet.age}</p>
          <p><strong>Category:</strong> {pet.category}</p>
          <p><strong>Location:</strong> {pet.location}</p>
          <p><strong>Posted:</strong> {new Date(pet.date).toLocaleDateString()}</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 px-6 py-2 bg-primary text-white dark:text-black rounded hover:bg-opacity-90 transition"
        >
          Adopt
        </button>
      </div>

      {/* Adopt Modal */}
      {showModal && <AdoptModal pet={pet} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default PetDetails;
