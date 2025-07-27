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
    return <p className="text-center mt-10 text-xl font-medium">Loading...</p>;
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

      <div ref={observerRef} className="text-center font-semibold py-10">
        {isFetchingNextPage && <p className="text-blue-600 font-medium">Loading more...</p>}
        {!hasNextPage && <p className="text-gray-500 dark:text-gray-400">All campaigns are loaded.</p>}
      </div>
    </div>
  );
};

export default DonationCampaigns;
