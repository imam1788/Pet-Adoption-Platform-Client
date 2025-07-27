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
    AOS.init({ duration: 600 });
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-rose-500" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-20 text-rose-600 dark:text-rose-300 font-semibold text-lg">
        No adoption requests found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-aos="fade-up">
      <h2 className="text-4xl font-extrabold text-rose-600 dark:text-rose-300 mb-8 text-center">
        Adoption Requests
      </h2>

      {/* Desktop Grid Table */}
      <div className="hidden md:block bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-rose-200 dark:border-gray-700 overflow-x-auto">
        <div
          className="grid grid-cols-[1.5fr_1.5fr_2fr_1.5fr_1.5fr_1fr_1fr] gap-4 text-rose-800 dark:text-rose-200 text-sm font-semibold uppercase bg-rose-100 dark:bg-gray-700 border-b border-rose-300 dark:border-gray-600"
          style={{ alignItems: "center" }}
        >
          <div className="text-center">Pet Name</div>
          <div className="text-center">Requester</div>
          <div>Email</div>
          <div>Phone</div>
          <div className="capitalize">Location</div>
          <div className="text-center">Status</div>
          <div className="text-center">Actions</div>
        </div>

        {requests.map((req) => (
          <div
            key={req._id}
            className="grid grid-cols-[1.5fr_1.5fr_2fr_1.5fr_1.5fr_1fr_1fr] gap-4 border-b border-rose-200 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-gray-700 transition-colors duration-200"
            style={{ alignItems: "center", padding: "12px 16px" }}
          >
            <div className="dark:text-gray-200">{req.petName}</div>
            <div className="dark:text-gray-200">{req.userName}</div>
            <div className="dark:text-gray-200 truncate">{req.email}</div>
            <div className="dark:text-gray-200">{req.phone}</div>
            <div className="capitalize dark:text-gray-300 truncate">{req.address}</div>
            <div className="text-center font-semibold capitalize">
              <span
                className={`badge px-3 py-1 rounded-full text-sm ${req.status === "pending"
                    ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"
                    : req.status === "accepted"
                      ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"
                      : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100"
                  }`}
              >
                {req.status}
              </span>
            </div>
            <div className="text-center flex items-center justify-center gap-3">
              <button
                onClick={() =>
                  req.status === "pending" && handleUpdateStatus(req._id, "accepted")
                }
                className={`btn btn-sm bg-green-500 text-white hover:bg-green-600 rounded-md flex items-center justify-center ${req.status !== "pending" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={req.status !== "pending"}
                aria-label="Accept request"
                title="Accept"
                style={{ height: 32, width: 32, padding: 0, lineHeight: 1 }}
              >
                <FaCheckCircle />
              </button>
              <button
                onClick={() =>
                  req.status === "pending" && handleUpdateStatus(req._id, "rejected")
                }
                className={`btn btn-sm bg-red-500 text-white hover:bg-red-600 rounded-md flex items-center justify-center ${req.status !== "pending" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={req.status !== "pending"}
                aria-label="Reject request"
                title="Reject"
                style={{ height: 32, width: 32, padding: 0, lineHeight: 1 }}
              >
                <FaTimesCircle />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-6">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg border border-rose-200 dark:border-gray-700 p-4 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold dark:text-white truncate">{req.petName}</h3>
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
            </div>
            <p className="dark:text-gray-200">
              <strong>Requester: </strong> {req.userName}
            </p>
            <p className="dark:text-gray-200 truncate">
              <strong>Email: </strong> {req.email}
            </p>
            <p className="dark:text-gray-200">
              <strong>Phone: </strong> {req.phone}
            </p>
            <p className="dark:text-gray-200 truncate">
              <strong>Location: </strong> {req.address}
            </p>

            <div className="flex gap-4 mt-2 justify-end">
              <button
                onClick={() =>
                  req.status === "pending" && handleUpdateStatus(req._id, "accepted")
                }
                className={`btn btn-sm bg-green-500 text-white hover:bg-green-600 rounded-md flex items-center justify-center gap-2 flex-1 ${req.status !== "pending" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={req.status !== "pending"}
                aria-label="Accept request"
                title="Accept"
              >
                <FaCheckCircle />
                Accept
              </button>
              <button
                onClick={() =>
                  req.status === "pending" && handleUpdateStatus(req._id, "rejected")
                }
                className={`btn btn-sm bg-red-500 text-white hover:bg-red-600 rounded-md flex items-center justify-center gap-2 flex-1 ${req.status !== "pending" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={req.status !== "pending"}
                aria-label="Reject request"
                title="Reject"
              >
                <FaTimesCircle />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdoptionRequests;
