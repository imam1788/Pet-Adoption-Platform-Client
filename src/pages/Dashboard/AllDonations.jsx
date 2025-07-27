import useAxiosSecure from "@/hooks/UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FaPause, FaPlay, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router";
import Swal from "sweetalert2";

const AllDonations = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch all donation campaigns (filtered from backend)
  const { data: campaigns = [], refetch, isLoading } = useQuery({
    queryKey: ["admin-donations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/all-donations");
      return res.data;
    },
  });

  // Handle Pause / Unpause
  const handleTogglePause = async (id, currentStatus) => {
    const action = currentStatus ? "unpause" : "pause";
    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this campaign?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/admin/campaigns/toggle-pause/${id}`, {
          paused: !currentStatus,
        });
        Swal.fire(`Success!`, `Campaign has been ${action}d.`, "success");
        refetch();
      } catch (err) {
        Swal.fire("Error", "Something went wrong.", "error");
      }
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the campaign!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/admin/campaigns/${id}`);
        Swal.fire("Deleted!", "Campaign has been deleted.", "success");
        refetch();
      } catch (err) {
        Swal.fire("Error", "Failed to delete campaign.", "error");
      }
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading campaigns...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-rose-700 text-center">
        All Donation Campaigns
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
          <thead className="bg-rose-200 text-rose-900">
            <tr>
              <th className="px-4 py-3 text-left">Pet</th>
              <th className="px-4 py-3 text-right">Target</th>
              <th className="px-4 py-3 text-right">Donated</th>
              <th className="px-4 py-3 text-center">Last Date</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campaigns.map((campaign) => (
              <tr
                key={campaign._id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-4 py-3 flex items-center gap-3">
                  <img
                    src={campaign.petImage}
                    alt={campaign.petName}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <span className="font-medium">{campaign.petName}</span>
                </td>
                <td className="px-4 py-3 text-right">${campaign.targetAmount}</td>
                <td className="px-4 py-3 text-right">${campaign.donatedAmount}</td>
                <td className="px-4 py-3 text-center">
                  {campaign.lastDate
                    ? new Date(campaign.lastDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-4 py-3 text-center">
                  {campaign.paused ? (
                    <span className="text-red-600 font-semibold">Paused</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => handleTogglePause(campaign._id, campaign.paused)}
                    className={`inline-flex items-center justify-center p-1 rounded ${campaign.paused ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"
                      } text-white`}
                    title={campaign.paused ? "Unpause" : "Pause"}
                  >
                    {campaign.paused ? <FaPlay size={16} /> : <FaPause size={16} />}
                  </button>
                  <Link to={`/dashboard/edit-campaign/${campaign._id}`}>
                    <button
                      className="bg-blue-500 text-white p-1 rounded"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(campaign._id)}
                    className="bg-red-600 hover:bg-red-700 p-1 rounded text-white"
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign._id}
            className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={campaign.petImage}
                alt={campaign.petName}
                className="w-16 h-16 rounded object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-rose-700">
                  {campaign.petName}
                </h3>
                <p className="text-sm text-gray-600">
                  Target: <span className="font-medium">${campaign.targetAmount}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Donated: <span className="font-medium">${campaign.donatedAmount}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Last Date:{" "}
                  <span className="font-medium">
                    {campaign.lastDate
                      ? new Date(campaign.lastDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </p>
                <p className="text-sm font-semibold mt-1">
                  Status:{" "}
                  <span
                    className={`${campaign.paused ? "text-red-600" : "text-green-600"
                      }`}
                  >
                    {campaign.paused ? "Paused" : "Active"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleTogglePause(campaign._id, campaign.paused)}
                className={`text-white p-1 rounded ${campaign.paused ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                title={campaign.paused ? "Unpause" : "Pause"}
                aria-label={campaign.paused ? "Unpause campaign" : "Pause campaign"}
              >
                {campaign.paused ? <FaPlay size={16} /> : <FaPause size={16} />}
              </button>
              <Link to={`/dashboard/edit-campaign/${campaign._id}`}>
                <button
                  className="bg-blue-500 text-white p-1 rounded"
                  title="Edit"
                >
                  <FaEdit size={16} />
                </button>
              </Link>

              <button
                onClick={() => handleDelete(campaign._id)}
                className="bg-red-600 hover:bg-red-700 p-1 rounded text-white"
                title="Delete"
                aria-label="Delete campaign"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllDonations;
