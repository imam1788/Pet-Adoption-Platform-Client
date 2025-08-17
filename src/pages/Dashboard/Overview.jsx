import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import useAxiosSecure from "@/hooks/UseAxiosSecure";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Overview() {
  const axiosSecure = useAxiosSecure(); // <-- use your secure axios instance

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/stats"); // <-- secure call
      return res.data;
    }
  });

  if (isLoading) return <div className="p-6 text-center">Loading stats...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Failed to load stats</div>;

  const petsLabels = stats.petsPerMonth?.map(p => p.month) || [];
  const petsData = stats.petsPerMonth?.map(p => p.count) || [];

  const campaignsLabels = stats.campaignsPerMonth?.map(c => c.month) || [];
  const campaignsData = stats.campaignsPerMonth?.map(c => c.count) || [];

  const petsChartData = {
    labels: petsLabels,
    datasets: [
      {
        label: "Pets Added",
        data: petsData,
        backgroundColor: "#3b82f6"
      }
    ]
  };


  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold">Total Pets</h2>
          <p className="mt-2 text-2xl font-bold">{stats.totalPets || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold">Total Donations</h2>
          <p className="mt-2 text-2xl font-bold">{stats.totalDonations || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold">Pending Requests</h2>
          <p className="mt-2 text-2xl font-bold">{stats.pendingRequests || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold">Active Campaigns</h2>
          <p className="mt-2 text-2xl font-bold">{stats.activeCampaigns || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Pets Added Per Month</h3>
          {petsData.length > 0 ? <Bar data={petsChartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} /> : <p className="text-gray-500">No pets added yet.</p>}
        </div>

        
      </div>
    </div>
  );
}
