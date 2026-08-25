import Header from "../../components/Header";
import { FiChevronLeft, FiChevronRight, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { fetchAllReviews, deleteReview } from "../../services/review";
import { getAllTrips } from "../../services/trip";
import { formatDate } from "../../lib/utils";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await getAllTrips(1, 100);
        setTrips(response.data?.trips || []);
      } catch (err) {
        console.error("Error loading trips lookup:", err);
      }
    };
    fetchTrips();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchAllReviews(page, 8);
        console.log("All Reviews Response:", response);
        setReviews(response.data?.items || []);
        setTotalPages(response.data?.totalPages || 1);
      } catch (err) {
        setError("Failed to fetch reviews.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [page]);

  const getTripName = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    return trip?.tripDetails?.name || `Trip (ID: ${tripId.substring(0, 8)}...)`;
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter((review) => review.id !== reviewId));
      } catch (err) {
        console.error("Failed to delete review:", err);
        alert("Failed to delete review.");
      }
    }
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
      <Header title="Trip Reviews & Feedback" description="Monitor customer ratings and comments" ctaText="" ctaURL="" icon={null} />
      <section>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Review ID
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Reviewer
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Trip Name
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Comment
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reviews.map((review) => (
                    <tr
                      key={review.id}
                      className="hover:bg-blue-50/50 transition-colors group"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        #{review.id}
                      </td>
                      <td className="py-4 px-4 flex items-center gap-3">
                        <img
                          src={review.userProfileImg || "/default-avatar.png"}
                          alt={review.userName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {review.userName}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                        {getTripName(review.tripId)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-0.5 text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="text-lg">
                              {i < review.rating ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 max-w-sm truncate" title={review.description}>
                        {review.description}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-sm text-right">
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-lg hover:bg-red-50 inline-flex items-center"
                          title="Delete Review"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handlePreviousPage}
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
                onClick={handleNextPage}
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

export default ReviewsPage;
