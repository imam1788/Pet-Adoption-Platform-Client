import { useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import AOS from 'aos';
import 'aos/dist/aos.css';
import debounce from 'lodash.debounce';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router';

const categories = ['All', 'Dog', 'Cat', 'Fish', 'Rabbit'];

const PetListing = () => {
  const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });


  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const debouncedSetSearch = useCallback(
    debounce((val) => setDebouncedSearch(val), 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    setSearchParams({ category: selected });
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['pets', debouncedSearch, category],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosPublic.get('/pets', {
        params: {
          search: debouncedSearch,
          category,
          page: pageParam,
          limit: 9,
        },
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap(p => p.pets).length;
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
  });

  const pets = data?.pages.flatMap(page => page.pets) || [];

  // Infinite scroll trigger
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <section className="px-4 sm:px-10 py-10 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-10 text-primary dark:text-white">
        Adoptable Pets
      </h2>

      {/* Filters */}
      <div className="max-w-[50%] mx-auto flex flex-col sm:flex-row justify-between mb-8 gap-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search pets by name"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded px-4 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={category}
          onChange={handleCategoryChange}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Pet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pets.map((pet) => (
          <div
            key={pet._id}
            data-aos="zoom-in-up"
            className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden transition-transform hover:scale-[1.02]"
          >
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-52 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-bold text-primary dark:text-white">{pet.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {(pet.description || pet.shortDesc || '').slice(0, 80)}...
              </p>
              <div className="flex flex-wrap justify-between items-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                <span><strong>Age:</strong> {pet.age}</span>
                <span className='mr-8'><strong>Type:</strong> {pet.category}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300">
                <span><strong>Location:</strong> {pet.location}</span>
                <span><strong>Date:</strong> {new Date(pet.date).toLocaleDateString()}</span>
              </div>
              <div className="mt-3">
                <Link to={`/pets/${pet._id}`} className="w-full">
                  <button className="w-full bg-primary text-white dark:text-black py-1.5 rounded hover:bg-opacity-90 transition">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLoading && <p className="text-center mt-10 dark:text-white">Loading pets...</p>}
      {isError && <p className="text-center mt-10 text-red-600 dark:text-red-400">Failed to load pets. Try again later.</p>}
      {isFetchingNextPage && <p className="text-center mt-6 dark:text-white">Loading more pets...</p>}
      {!hasNextPage && !isLoading && (
        <p className="text-center mt-6 text-gray-500 dark:text-gray-400">No more pets to show.</p>
      )}
    </section>
  );
};

export default PetListing;
