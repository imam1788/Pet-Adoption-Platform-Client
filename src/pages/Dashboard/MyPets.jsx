import { useEffect, useMemo, useState } from "react";
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
            src={row.original.image}
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
                ? "bg-green-500 text-white"
                : "bg-yellow-400 text-black"
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
              className="btn btn-sm btn-outline"
              title="Mark as Adopted"
            >
              <FaCheck />
            </button>
            <button
              onClick={() =>
                window.location.assign(`/dashboard/update-pet/${row.original._id}`)
              }
              className="btn btn-sm btn-outline"
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

  return (
    <div className="p-4" data-aos="fade-up">
      <h2 className="text-2xl font-semibold mb-4">My Pets</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : !Array.isArray(pets) || pets.length === 0 ? (
        <p className="text-gray-500">You haven’t added any pets yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-4 py-3 font-semibold text-gray-700 cursor-pointer"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
            <tbody className="divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
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
            <div className="flex justify-between items-center mt-4 p-2">
              <button
                className="btn btn-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
              <span>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
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
      )}
    </div>
  );
};

export default MyPets;
