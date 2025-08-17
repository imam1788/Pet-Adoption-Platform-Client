import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useRef } from 'react';
import { FaBullseye, FaHandHoldingUsd } from 'react-icons/fa';
import { Link } from 'react-router';

const fetchCampaigns = async ({ pageParam = 1 }) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/donation-campaigns?page=${pageParam}&limit=6`);
  return res.data;
};

const DonationCampaigns = () => {
  const observerRef = useRef();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['donation-campaigns'],
    queryFn: fetchCampaigns,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage]);

  if (status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="flex space-x-2">
          <span className="w-6 h-6 bg-primary dark:bg-white rounded-full animate-bounce"></span>
          <span className="w-6 h-6 bg-primary dark:bg-white rounded-full animate-bounce animation-delay-200"></span>
          <span className="w-6 h-6 bg-primary dark:bg-white rounded-full animate-bounce animation-delay-400"></span>
        </div>
        <p className="text-gray-700 dark:text-white text-lg font-semibold">
          Loading donation campaigns...
        </p>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold mb-10 text-center dark:text-white">Donation Campaigns</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.pages.map(page =>
          page.campaigns.map(campaign => (
            <div
              key={campaign.petId}
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
            >
              <img
                src={campaign.petImage}
                alt={campaign.petName}
                className="w-full h-52 object-cover"
              />
              <div className="p-5 space-y-2">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{campaign.petName}</h3>
                <p className="text-gray-600 dark:text-gray-300">{campaign.description}</p>
                <div className="text-sm font-medium flex items-center gap-2 dark:text-gray-200">
                  <FaBullseye className="text-rose-500" />
                  Target: <span className="text-rose-500">${campaign.targetAmount}</span>
                </div>
                <div className="text-sm font-medium flex items-center gap-2 dark:text-gray-200">
                  <FaHandHoldingUsd className="text-green-600" />
                  Donated: <span className="text-green-600">${campaign.donatedAmount}</span>
                </div>
                <Link to={`/donations/${campaign._id}`}>
                  <button className="w-full bg-primary text-white dark:text-black py-1.5 rounded hover:bg-opacity-90 transition">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <div ref={observerRef} className="flex flex-col items-center py-10 space-y-2">
        {isFetchingNextPage && (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex space-x-2">
              <span className="w-5 h-5 bg-primary dark:bg-white rounded-full animate-bounce"></span>
              <span className="w-5 h-5 bg-primary dark:bg-white rounded-full animate-bounce animation-delay-200"></span>
              <span className="w-5 h-5 bg-primary dark:bg-white rounded-full animate-bounce animation-delay-400"></span>
            </div>
            <p className="text-gray-700 dark:text-white text-sm font-medium">
              Loading more generous campaigns...
            </p>
          </div>
        )}

        {!hasNextPage && (
          <div className="flex flex-col items-center space-y-2">
            <svg
              className="w-12 h-12 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 7.89a3 3 0 004.24 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium text-center">
              All campaigns are loaded. Thanks for supporting pets!
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default DonationCampaigns;
