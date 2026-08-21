import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { deleteTrip, getTripsByUser } from "../../services/trip";
import { FiChevronLeft, FiChevronRight, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const TripsPage = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTripsByUser(page, 8);
      setTrips(response.data?.items || response.data?.trips || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [page]);

  const handleDeleteClick = async (tripId: string) => {
    const result = await MySwal.fire({
      title: "Delete Trip?",
      text: "Are you sure you want to delete this trip itinerary? This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteTrip(tripId);
        MySwal.fire({
          title: "Deleted!",
          text: "Trip has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#3b82f6",
          timer: 2000,
        });
        fetchTrips(); // Reload after delete
      } catch (err: any) {
        console.error("Failed to delete trip:", err);
        const errMsg = err?.response?.data?.message || err?.message || "Failed to delete trip.";
        MySwal.fire({
          title: "Error!",
          text: errMsg,
          icon: "error",
          confirmButtonColor: "#3b82f6",
        });
      }
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
              page === i
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
            page === 1
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          1
        </button>
      );

      if (page > 3) {
        buttons.push(
          <span key="ellipsis1" className="text-gray-400 px-1">
            ...
          </span>
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
              page === i
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {i}
          </button>
        );
      }

      if (page < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="text-gray-400 px-1">
            ...
          </span>
        );
      }

      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
            page === totalPages
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <main className="w-full min-h-screen flex flex-col gap-10 max-w-7xl mx-auto px-4 lg:px-8">
      <Header
        title="Trips"
        description="Manage all trips here"
        ctaText="Create a Trip"
        ctaURL="/admin/trip/create"
        icon={<FaPlus />}
      />
      <section>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No trips found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Trip Details
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Style / Group
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Est. Price
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {trips.map((trip) => {
                    const details = trip.tripDetails || {};
                    const destination = `${details.location?.city || ""}, ${details.country || ""}`;
                    const coverImage = trip.imageUrls?.[0] || "/default-trip.png";
                    return (
                      <tr
                        key={trip.id}
                        className="hover:bg-blue-50/50 transition-colors group"
                      >
                        <td className="py-4 px-4 flex items-center gap-3">
                          <img
                            src={coverImage}
                            alt={details.name || "Trip"}
                            className="w-12 h-12 rounded-xl object-cover shadow-sm"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">
                              {details.name || "Unnamed Trip"}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              ID: #{trip.id.substring(0, 8)}...
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {destination}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {details.duration} Days
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
                            {details.budget}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-700">{details.travelStyle}</span>
                            <span className="text-[11px] text-gray-400">{details.groupType}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-gray-800">
                          ${details.estimatedPrice || "0.00"}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/trip/${trip.id}`}
                              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                              title="View Details"
                            >
                              <FiEye size={16} />
                            </Link>
                            <Link
                              to={`/admin/trip/edit/${trip.id}`}
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                              title="Edit Trip"
                            >
                              <FiEdit2 size={16} />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(trip.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete Trip"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`flex items-center gap-1 text-sm px-4 py-2 rounded-lg bg-white border-0 drop-shadow-xl ${
                  page === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700 hover:scale-105"
                }`}
              >
                <FiChevronLeft size={16} />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {renderPaginationButtons()}
              </div>

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className={`flex items-center gap-1 text-sm px-4 py-2 rounded-lg bg-white border-0 drop-shadow-xl ${
                  page === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700 hover:scale-105"
                }`}
              >
                Next
                <FiChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default TripsPage;
