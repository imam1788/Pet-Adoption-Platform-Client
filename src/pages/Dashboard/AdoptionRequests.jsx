import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AdoptionRequests = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosSecure.get("/adoptions/my-requests");
        setRequests(res.data || []);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to load adoption requests", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [axiosSecure]);

  const handleUpdateStatus = async (requestId, newStatus) => {
    const result = await Swal.fire({
      title: `Are you sure you want to ${newStatus} this request?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "accepted" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${newStatus}`,
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch(`/adoptions/${requestId}/status`, {
        status: newStatus,
      });
      Swal.fire("Success", `Request ${newStatus}`, "success");

      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update request status", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-aos="fade-up">
      <h2 className="text-4xl font-extrabold text-rose-600 dark:text-rose-300 mb-8 text-center">
        Adoption Requests
      </h2>

      <div className="overflow-x-auto border rounded shadow bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-rose-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-rose-800 dark:text-rose-200">Pet Name</th>
              <th className="px-4 py-3 text-left font-semibold text-rose-800 dark:text-rose-200">Requester</th>
              <th className="px-4 py-3 text-left font-semibold text-rose-800 dark:text-rose-200">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-rose-800 dark:text-rose-200">Phone</th>
              <th className="px-4 py-3 text-left font-semibold text-rose-800 dark:text-rose-200">Location</th>
              <th className="px-4 py-3 text-center font-semibold text-rose-800 dark:text-rose-200">Status</th>
              <th className="px-4 py-3 text-center font-semibold text-rose-800 dark:text-rose-200">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  <span className="loading loading-spinner loading-lg text-rose-500" />
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-rose-600 dark:text-rose-300">
                  No adoption requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr
                  key={req._id}
                  className="hover:bg-rose-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="px-4 py-3 dark:text-gray-200">{req.petName}</td>
                  <td className="px-4 py-3 dark:text-gray-200">{req.userName}</td>
                  <td className="px-4 py-3 dark:text-gray-200">{req.email}</td>
                  <td className="px-4 py-3 dark:text-gray-200">{req.phone}</td>
                  <td className="px-4 py-3 capitalize dark:text-gray-300">{req.address}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`badge px-3 py-1 rounded-full text-sm font-semibold capitalize ${req.status === "pending"
                          ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"
                          : req.status === "accepted"
                            ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"
                            : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100"
                        }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          req.status === "pending" && handleUpdateStatus(req._id, "accepted")
                        }
                        className={`btn btn-sm bg-green-500 text-white hover:bg-green-600 ${req.status !== "pending" ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        disabled={req.status !== "pending"}
                        title="Accept"
                      >
                        <FaCheckCircle />
                      </button>
                      <button
                        onClick={() =>
                          req.status === "pending" && handleUpdateStatus(req._id, "rejected")
                        }
                        className={`btn btn-sm bg-red-500 text-white hover:bg-red-600 ${req.status !== "pending" ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        disabled={req.status !== "pending"}
                        title="Reject"
                      >
                        <FaTimesCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdoptionRequests;
