import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaEdit, FaTrashAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { Link } from "react-router";
import useAuth from "@/hooks/UseAuth";
import useAdmin from "@/hooks/UseAdmin";

const ManagePets = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();

  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  const { data: pets = [], refetch, isLoading } = useQuery({
    queryKey: ["admin-pets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/pets");
      return res.data.pets.map((pet) => ({
        ...pet,
        status: pet.adopted ? "adopted" : "not adopted",
        photo: pet.image || "https://via.placeholder.com/48",
      }));
    },
    enabled: user?.email && isAdmin && !isAdminLoading,
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This pet will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await axiosSecure.delete(`/pets/${id}`);
      Swal.fire("Deleted!", "Pet has been removed.", "success");
      refetch();
    }
  };

  const handleToggleStatus = async (pet) => {
    const newAdopted = pet.status !== "adopted";
    await axiosSecure.patch(`/pets/status/${pet._id}`, { adopted: newAdopted });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-rose-500" />
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="text-center py-20 text-rose-600 font-semibold text-lg">
        No pets found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-aos="fade-up">
      <h2 className="text-4xl font-extrabold text-rose-600 mb-8 text-center">
        Manage All Pets
      </h2>

      {/* Desktop Grid Table */}
      <div className="hidden md:block bg-white shadow-lg rounded-lg border border-rose-200 overflow-x-auto">
        <div
          className="grid grid-cols-[40px_80px_1fr_1fr_100px_60px_120px] gap-4 text-rose-800 text-sm font-semibold uppercase bg-rose-100 border-b border-rose-300"
          style={{ alignItems: "center" }}
        >
          <div className="text-center">#</div>
          <div className="text-center">Photo</div>
          <div>Name</div>
          <div className="capitalize">Category</div>
          <div className="text-center">Status</div>
          <div className="text-center">Toggle</div>
          <div className="text-center">Actions</div>
        </div>

        {pets.map((pet, index) => (
          <div
            key={pet._id}
            className="grid grid-cols-[40px_80px_1fr_1fr_100px_60px_120px] gap-4 border-b border-rose-200 hover:bg-rose-50 transition-colors duration-200"
            style={{ alignItems: "center", padding: "12px 16px" }}
          >
            <div className="text-center">{index + 1}</div>
            <div className="text-center">
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-14 h-14 rounded-md object-cover mx-auto"
              />
            </div>
            <div>{pet.name}</div>
            <div className="capitalize">{pet.category}</div>
            <div className="text-center">
              <span
                className={`badge px-3 py-1 rounded-full text-sm ${pet.status === "adopted"
                  ? "bg-green-200 text-green-800"
                  : "bg-yellow-200 text-yellow-800"
                  }`}
              >
                {pet.status}
              </span>
            </div>
            <div className="text-center">
              <button
                className={`btn btn-sm text-white rounded-md px-2 ${pet.status === "adopted"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-500 hover:bg-green-600"
                  }`}
                onClick={() => handleToggleStatus(pet)}
                aria-label="Toggle adoption status"
                style={{
                  height: 32,
                  width: 32,
                  padding: 0,
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {pet.status === "adopted" ? <FaToggleOff /> : <FaToggleOn />}
              </button>
            </div>
            <div className="text-center flex items-center justify-center gap-3">
              <Link to={`/dashboard/update-pet/${pet._id}`}>
                <button
                  className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md flex items-center justify-center"
                  aria-label="Edit pet"
                  style={{ height: 32, width: 32, padding: 0, lineHeight: 1 }}
                >
                  <FaEdit />
                </button>
              </Link>
              <button
                className="btn btn-sm bg-red-500 text-white hover:bg-red-600 rounded-md flex items-center justify-center"
                onClick={() => handleDelete(pet._id)}
                aria-label="Delete pet"
                style={{ height: 32, width: 32, padding: 0, lineHeight: 1 }}
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-6">
        {pets.map((pet, index) => (
          <div
            key={pet._id}
            className="bg-white shadow rounded-lg border border-rose-200 p-4 flex gap-4 items-center"
          >
            <div>
              <span className="font-semibold text-rose-600">{index + 1}.</span>
            </div>
            <img
              src={pet.photo}
              alt={pet.name}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{pet.name}</h3>
              <p className="capitalize text-rose-700">{pet.category}</p>
              <span
                className={`badge px-3 py-1 rounded-full text-sm mt-1 inline-block ${pet.status === "adopted"
                  ? "bg-green-200 text-green-800"
                  : "bg-yellow-200 text-yellow-800"
                  }`}
              >
                {pet.status}
              </span>
            </div>

            <div className="flex flex-col gap-2 items-center">
              <button
                className={`btn btn-sm text-white rounded-md px-2 ${pet.status === "adopted"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-500 hover:bg-green-600"
                  }`}
                onClick={() => handleToggleStatus(pet)}
                aria-label="Toggle adoption status"
                style={{
                  height: 32,
                  width: 32,
                  padding: 0,
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {pet.status === "adopted" ? <FaToggleOff /> : <FaToggleOn />}
              </button>

              <Link to={`/dashboard/update-pet/${pet._id}`}>
                <button
                  className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md flex items-center justify-center"
                  aria-label="Edit pet"
                  style={{ height: 32, width: 32, padding: 0, lineHeight: 1 }}
                >
                  <FaEdit />
                </button>
              </Link>

              <button
                className="btn btn-sm bg-red-500 text-white hover:bg-red-600 rounded-md flex items-center justify-center"
                onClick={() => handleDelete(pet._id)}
                aria-label="Delete pet"
                style={{ height: 32, width: 32, padding: 0, lineHeight: 1 }}
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePets;
