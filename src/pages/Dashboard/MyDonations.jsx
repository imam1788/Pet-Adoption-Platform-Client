import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'aos/dist/aos.css';
import AOS from 'aos';
import UseAxiosSecure from '@/hooks/UseAxiosSecure';

const MyDonations = () => {
  const axiosSecure = UseAxiosSecure();
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800, offset: 100 });
  }, []);

  useEffect(() => {
    axiosSecure
      .get('/donations/my')
      .then((res) => setDonations(res.data))
      .catch((err) => console.error('Error fetching donations:', err));
  }, [axiosSecure]);

  const handleRefund = (donationId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to request a refund. This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, refund it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/donations/${donationId}`)
          .then((res) => {
            if (res.data.success) {
              Swal.fire('Refunded!', 'Your donation has been removed.', 'success');
              setDonations(donations.filter((d) => d._id !== donationId));
            }
          })
          .catch((err) => {
            console.error(err);
            Swal.fire('Error', 'Something went wrong.', 'error');
          });
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center" data-aos="fade-down">
        My Donations
      </h2>

      {donations.length === 0 ? (
        <p className="text-center text-gray-500 mt-10" data-aos="fade-up">
          You haven't made any donations yet.
        </p>
      ) : (
        <div className="grid gap-6" data-aos="fade-up">
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white shadow-lg rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <img
                  src={donation.petImage}
                  alt={donation.petName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-lg">{donation.petName}</h4>
                  <p className="text-sm text-gray-600">Txn: {donation.transactionId}</p>
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="text-base font-medium text-gray-700">
                  Amount: <span className="text-green-600">${donation.amount.toFixed(2)}</span>
                </p>
              </div>

              <div>
                <button
                  onClick={() => handleRefund(donation._id)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-200"
                >
                  Ask for Refund
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;
