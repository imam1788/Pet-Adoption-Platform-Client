import { useContext, useState } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import Swal from "sweetalert2";

const AdoptModal = ({ pet, onClose }) => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adoptionData = {
      petId: pet._id,
      petName: pet.name,
      petImage: pet.image,
      userName: user.displayName,
      email: user.email,
      phone,
      address,
      status: "pending",
      date: new Date(),
    };

    try {
      await axiosSecure.post("/adoptions", adoptionData);
      Swal.fire("Success", "Adoption request submitted!", "success");
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to submit adoption request", "error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center px-4 py-6 overflow-auto"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.25)", // lighter black overlay (25% opacity)
        backdropFilter: "blur(4px)",           // subtle blur effect behind
        WebkitBackdropFilter: "blur(4px)",     // Safari support
      }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          Adopt {pet.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={user.displayName}
              disabled
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter your phone number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Address
            </label>
            <textarea
              placeholder="Enter your address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptModal;
