import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AOS from "aos";

const AdoptionRequests = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.refresh(); // ensure AOS works if dynamic content added
  }, [requests]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosSecure.get("/adoptions/my-requests");
        setRequests(res.data);
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

  if (loading)
    return (
      <p className="text-center text-lg font-medium dark:text-gray-300">
        Loading adoption requests...
      </p>
    );

  if (requests.length === 0)
    return (
      <p className="text-center text-lg font-semibold text-gray-500 dark:text-gray-400">
        No adoption requests found.
      </p>
    );

  return (
    <div
      className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen"
      data-aos="fade-up"
    >
      <h2 className="text-2xl font-bold mb-4">Adoption Requests</h2>
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <table className="table w-full text-sm md:text-base">
          <thead className="bg-gray-100 text-gray-700 uppercase dark:bg-gray-800 dark:text-gray-300">
            <tr>
              <th className="py-3 px-4">Pet Name</th>
              <th className="py-3 px-4">Requester</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 border-b border-gray-200 dark:border-gray-700"
              >
                <td className="py-3 px-4">{req.petName}</td>
                <td className="py-3 px-4">{req.userName}</td>
                <td className="py-3 px-4">{req.email}</td>
                <td className="py-3 px-4">{req.phone}</td>
                <td className="py-3 px-4">{req.address}</td>
                <td className="py-3 px-4 font-semibold capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${req.status === "pending"
                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-700 dark:text-yellow-300"
                        : req.status === "accepted"
                          ? "bg-green-100 text-green-600 dark:bg-green-700 dark:text-green-300"
                          : "bg-red-100 text-red-600 dark:bg-red-700 dark:text-red-300"
                      }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() =>
                        req.status === "pending" &&
                        handleUpdateStatus(req._id, "accepted")
                      }
                      className={`btn btn-sm ${req.status === "pending"
                          ? "bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700"
                          : "bg-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-600 dark:text-gray-500"
                        }`}
                      disabled={req.status !== "pending"}
                      title="Accept"
                    >
                      <FaCheckCircle className="text-lg" />
                    </button>
                    <button
                      onClick={() =>
                        req.status === "pending" &&
                        handleUpdateStatus(req._id, "rejected")
                      }
                      className={`btn btn-sm ${req.status === "pending"
                          ? "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700"
                          : "bg-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-600 dark:text-gray-500"
                        }`}
                      disabled={req.status !== "pending"}
                      title="Reject"
                    >
                      <FaTimesCircle className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdoptionRequests;
