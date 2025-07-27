import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaTrashAlt, FaEdit, FaCheck } from "react-icons/fa";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";
import Swal from "sweetalert2";

const MyPets = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const { isLoading, refetch } = useQuery({
    queryKey: ["myPets", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-pets?email=${user?.email}`);
      const data = Array.isArray(res.data.pets) ? res.data.pets : [];
      setPets(data);
      return data;
    },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the pet permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/pets/${id}`);
        Swal.fire("Deleted!", "The pet has been deleted.", "success");
        refetch();
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  const handleMarkAdopted = async (id) => {
    try {
      await axiosSecure.patch(`/pets/adopt/${id}`);
      refetch();
      Swal.fire("Success!", "Pet marked as adopted.", "success");
    } catch {
      Swal.fire("Error!", "Failed to update pet status.", "error");
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "#",
        cell: ({ row }) => row.index + 1,
      },
      {
        header: "Photo",
        cell: ({ row }) => (
          <img
            src={row.original.image || "https://via.placeholder.com/48"}
            alt={row.original.name}
            className="w-12 h-12 object-cover rounded"
          />
        ),
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Category",
        accessorKey: "category",
      },
      {
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`badge px-2 py-1 rounded ${row.original.adopted
              ? "bg-green-500 text-white dark:bg-green-700"
              : "bg-yellow-400 text-black dark:bg-yellow-600 dark:text-gray-900"
              }`}
          >
            {row.original.adopted ? "Adopted" : "Not Adopted"}
          </span>
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleMarkAdopted(row.original._id)}
              disabled={row.original.adopted}
              className="btn btn-sm btn-outline dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Mark as Adopted"
            >
              <FaCheck />
            </button>
            <button
              onClick={() =>
                window.location.assign(`/dashboard/update-pet/${row.original._id}`)
              }
              className="btn btn-sm btn-outline dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Edit"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="btn btn-sm btn-error"
              title="Delete"
            >
              <FaTrashAlt />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: pets,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-rose-500" />
      </div>
    );
  }

  if (!Array.isArray(pets) || pets.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-20">
        You haven’t added any pets yet.
      </p>
    );
  }

  return (
    <div
      className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen"
      data-aos="fade-up"
    >
      <h2 className="text-3xl font-bold mb-6">My Pets</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc"
                      ? " 🔼"
                      : header.column.getIsSorted() === "desc"
                        ? " 🔽"
                        : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {table.getPageCount() > 1 && (
          <div className="flex justify-between items-center mt-4 p-2 text-gray-900 dark:text-gray-100">
            <button
              className="btn btn-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              className="btn btn-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-6">
        {pets.map((pet, index) => (
          <div
            key={pet._id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg border border-rose-200 dark:border-gray-700 p-4 flex gap-4 items-center"
          >
            <div>
              <span className="font-semibold text-rose-600 dark:text-rose-300">
                {index + 1}.
              </span>
            </div>
            <img
              src={pet.image || "https://via.placeholder.com/64"}
              alt={pet.name}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold dark:text-white">{pet.name}</h3>
              <p className="capitalize text-rose-700 dark:text-rose-300">{pet.category}</p>
              <span
                className={`badge px-3 py-1 rounded-full text-sm mt-1 inline-block ${pet.adopted
                  ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"
                  : "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"
                  }`}
              >
                {pet.adopted ? "Adopted" : "Not Adopted"}
              </span>
            </div>

            <div className="flex flex-col gap-2 items-center">
              <button
                onClick={() => handleMarkAdopted(pet._id)}
                disabled={pet.adopted}
                className={`btn btn-sm text-white rounded-md px-2 ${pet.adopted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
                  }`}
                aria-label="Mark as Adopted"
                style={{ height: 32, width: 32, padding: 0, lineHeight: 1 }}
                title={pet.adopted ? "Already Adopted" : "Mark as Adopted"}
              >
                <FaCheck />
              </button>

              <button
                onClick={() => window.location.assign(`/dashboard/update-pet/${pet._id}`)}
                className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md flex items-center justify-center"
                aria-label="Edit pet"
                style={{ height: 32, width: 32, padding: 0, lineHeight: 1 }}
                title="Edit"
              >
                <FaEdit />
              </button>

              <button
                onClick={() => handleDelete(pet._id)}
                className="btn btn-sm bg-red-500 text-white hover:bg-red-600 rounded-md flex items-center justify-center"
                aria-label="Delete pet"
                style={{ height: 32, width: 32, padding: 0, lineHeight: 1 }}
                title="Delete"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPets;
