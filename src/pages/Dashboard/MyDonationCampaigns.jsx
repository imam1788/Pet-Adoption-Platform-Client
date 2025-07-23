import { useEffect, useState } from "react";
import useAuth from "@/hooks/UseAuth";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router";
import useAxiosSecure from "@/hooks/UseAxiosSecure";

const MyDonationCampaigns = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [donatorsModalOpen, setDonatorsModalOpen] = useState(false);
  const [donators, setDonators] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    setError(null);

    axiosSecure
      .get("/donation-campaigns/my")
      .then((res) => {
        setCampaigns(res.data.campaigns || []);
      })
      .catch(() => {
        setError("Failed to load your donation campaigns");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.email, axiosSecure]);

  const togglePause = async (campaign) => {
    try {
      await axiosSecure.patch(`/donation-campaigns/pause/${campaign._id}`, {
        paused: !campaign.paused,
      });
      setCampaigns((prev) =>
        prev.map((c) =>
          c._id === campaign._id ? { ...c, paused: !campaign.paused } : c
        )
      );
    } catch {
      alert("Failed to update pause status");
    }
  };

  const openDonatorsModal = async (campaign) => {
    try {
      const res = await axiosSecure.get("/donations", {
        params: { donationId: campaign._id },
      });
      setDonators(res.data.donations || []);
      setSelectedCampaign(campaign);
      setDonatorsModalOpen(true);
    } catch {
      alert("Failed to load donators");
    }
  };

  const closeModal = () => {
    setDonatorsModalOpen(false);
    setDonators([]);
    setSelectedCampaign(null);
  };

  const progressPercent = (donatedAmount, targetAmount) => {
    if (!targetAmount) return 0;
    return Math.min((donatedAmount / targetAmount) * 100, 100);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Donation Campaigns</h1>

      {loading && <p>Loading campaigns...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && campaigns.length === 0 && (
        <p>You have not created any donation campaigns yet.</p>
      )}

      {!loading && campaigns.length > 0 && (
        <div
          data-aos="fade-up"
          className="overflow-x-auto border rounded shadow"
        >
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Pet Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Max Donation Amount
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Donation Progress
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign._id}>
                  <td className="px-6 py-4">{campaign.petName}</td>
                  <td className="px-6 py-4">
                    ${campaign.targetAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 w-64">
                    <div className="w-full bg-gray-200 rounded-full h-5">
                      <div
                        className={`h-5 rounded-full ${progressPercent(
                          campaign.donatedAmount,
                          campaign.targetAmount
                        ) === 100
                          ? "bg-green-500"
                          : "bg-blue-500"
                          }`}
                        style={{
                          width: `${progressPercent(
                            campaign.donatedAmount,
                            campaign.targetAmount
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm mt-1">
                      ${campaign.donatedAmount.toFixed(2)} raised
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => togglePause(campaign)}
                      className={`px-3 py-1 rounded ${campaign.paused
                        ? "bg-yellow-400 text-black"
                        : "bg-red-500 text-white"
                        }`}
                      title={
                        campaign.paused ? "Unpause donation" : "Pause donation"
                      }
                    >
                      {campaign.paused ? "Unpause" : "Pause"}
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/edit-campaign/${campaign._id}`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => openDonatorsModal(campaign)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      View Donators
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      }

      {/* Donators Modal */}
      {
        donatorsModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white p-6 rounded max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">
                Donators for {selectedCampaign?.petName}
              </h2>
              {donators.length === 0 && <p>No donators yet.</p>}
              {donators.length > 0 && (
                <ul className="max-h-64 overflow-y-auto divide-y divide-gray-300">
                  {donators.map((donation) => (
                    <li key={donation._id} className="py-2 flex justify-between">
                      <span>{donation.donorEmail}</span>
                      <span>${donation.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default MyDonationCampaigns;
