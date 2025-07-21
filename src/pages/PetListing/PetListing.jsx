import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import AOS from 'aos';
import 'aos/dist/aos.css';
import debounce from 'lodash.debounce';
import useAxiosSecure from '@/hooks/UseAxiosSecure';
import { Link } from 'react-router';

const categories = ['All', 'Dog', 'Cat', 'Fish', 'Rabbit'];

const PetListing = () => {
  const axiosSecure = useAxiosSecure();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  // Debounce the search input
  const debouncedSetSearch = useCallback(
    debounce((val) => {
      setDebouncedSearch(val);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const { data = {}, isLoading, isError } = useQuery({
    queryKey: ['pets', debouncedSearch, category],
    queryFn: async () => {
      const res = await axiosSecure.get('/pets', {
        params: { search: debouncedSearch, category }
      });
      return res.data;
    }
  });

  const pets = data.pets || [];

  return (
    <section className="px-4 sm:px-10 py-10 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-10 text-primary">Adoptable Pets</h2>

      {/* Filters */}
      <div className="max-w-[50%] mx-auto flex flex-col sm:flex-row justify-between mb-8 gap-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search pets by name"
          className="border border-gray-300 rounded px-4 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={category}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="bg-white shadow-lg rounded-2xl overflow-hidden transition-transform hover:scale-[1.02]"
          >
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-52 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-bold text-primary">{pet.name}</h3>
              <p className="text-gray-600 text-sm">{pet.description.slice(0, 80)}...</p>
              <div className="flex flex-wrap justify-between items-center text-sm text-gray-700 mt-3">
                <span><strong>Age:</strong> {pet.age}</span>
                <span className='mr-8'><strong>Type:</strong> {pet.category}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-700">
                <span><strong>Location:</strong> {pet.location}</span>
                <span><strong>Date:</strong> {new Date(pet.date).toLocaleDateString()}</span>
              </div>
              <div className="mt-3">
                <Link to={`/pets/${pet._id}`} className="w-full">
                  <button className="w-full bg-primary text-white py-1.5 rounded hover:bg-opacity-90">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PetListing;
