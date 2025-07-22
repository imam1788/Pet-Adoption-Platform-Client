import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/payments/CheckoutForm";
import { FaBullseye, FaHandHoldingUsd } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const DonationDetails = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [recommended, setRecommended] = useState([]);

  const navigate = useNavigate();

  const { data: donation, isLoading } = useQuery({
    queryKey: ["donation", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/donation-campaigns/${id}`);
      return res.data;
    },
  });

  // Fetch recommended campaigns excluding current
  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    if (!donation?._id) return;

    axios
      .get(`http://localhost:5000/recommended-campaigns/${donation._id}`)
      .then(res => setRecommended(res.data))
      .catch(err => console.error(err));
  }, [donation]);

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Campaign Image */}
      <img
        src={donation.petImage}
        alt={donation.petName}
        className="w-full h-72 object-cover rounded-xl"
        data-aos="fade-up"
      />

      {/* Campaign Info */}
      <h2 className="text-3xl font-bold mt-6" data-aos="fade-up" data-aos-delay="100">
        {donation.petName}
      </h2>
      <p className="text-gray-700 my-4" data-aos="fade-up" data-aos-delay="200">
        {donation.description}
      </p>

      <div
        className="flex gap-8 items-center mt-4 text-lg"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <div className="font-medium flex items-center gap-2">
          <FaBullseye className="text-rose-500" />
          Target: <span className="text-rose-500">${donation.targetAmount}</span>
        </div>
        <div className="font-medium flex items-center gap-2">
          <FaHandHoldingUsd className="text-green-600" />
          Donated: <span className="text-green-600">${donation.donatedAmount}</span>
        </div>
      </div>

      {/* Donate Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary text-white px-6 py-2 mt-6 rounded hover:bg-opacity-90"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        Donate Now
      </button>

      {/* Stripe Donation Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <Dialog.Title className="text-xl font-semibold">
              Donate to {donation.petName}
            </Dialog.Title>

            {/* Donation Amount Input */}
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full border p-2 rounded"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              min={1}
            />

            {/* Stripe Checkout Form */}
            {donationAmount > 0 && (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  amount={parseFloat(donationAmount)}
                  campaignId={donation._id}
                  onClose={() => setIsOpen(false)}
                />
              </Elements>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Recommended Campaigns Section */}
      {recommended.length > 0 && (
        <section className="mt-16">
          <h3 className="text-2xl font-semibold mb-6" data-aos="fade-up">
            Recommended Donations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommended.map((camp, index) => (
              <div
                key={camp._id}
                className="border rounded p-4 shadow hover:shadow-lg cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={100 * (index + 1)}
                onClick={() => navigate(`/donations/${camp._id}`)}  // navigate on click
              >
                <img
                  src={camp.petImage}
                  alt={camp.petName}
                  className="w-full h-40 object-cover rounded"
                />
                <h4 className="mt-2 font-bold">{camp.petName}</h4>
                <p className="text-sm text-gray-600">{camp.description.slice(0, 60)}...</p>
                <p className="mt-1 text-green-600 font-semibold">${camp.donatedAmount} raised</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DonationDetails;
