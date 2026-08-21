import Header from "../../components/Header";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import { getAllBookings, updatePaymentStatus } from "../../services/payment";
import { formatDate } from "../../lib/utils";
import Chip from "../../components/Chip";
import toast from "react-hot-toast";

const PaymentsPage = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleStatusUpdate = async (paymentId: number | string, status: string) => {
    try {
      await updatePaymentStatus(paymentId, status);
      toast.success(`Payment status manually set to ${status}!`);
      const response = await getAllBookings(page, 8);
      setPayments(response.data?.items || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update payment status");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllBookings(page, 8);
        console.log("All Bookings Response:", response);
        setPayments(response.data?.items || []);
        setTotalPages(response.data?.totalPages || 1);
      } catch (err) {
        setError("Failed to fetch payments records.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
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
      <Header title="Payment Transactions" description="View and audit all stripe customer payments" ctaText="" ctaURL="" icon={null} />
      <section>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No payment transactions found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Customer / User
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Trip Name
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Stripe Reference
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-blue-50/50 transition-colors group"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        #{payment.id}
                      </td>
                      <td className="py-4 px-4 flex items-center gap-3">
                        <img
                          src={payment.userProfileImg || "/default-avatar.png"}
                          alt={payment.userName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{payment.userName}</p>
                          <p className="text-xs text-gray-500">{payment.userEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 max-w-[200px] truncate">
                        {payment.tripName || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-700">
                        ${payment.amount?.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <Chip
                          label={payment.status}
                          variant={
                            payment.status === "CONFIRMED" ? "success" :
                            payment.status === "PENDING" ? "warning" : "danger"
                          }
                        />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-400 font-mono max-w-[150px] truncate">
                        {payment.stripeSessionId}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleStatusUpdate(payment.id, "CONFIRMED")}
                            disabled={payment.status === "CONFIRMED"}
                            className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-600 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(payment.id, "CANCELLED")}
                            disabled={payment.status === "CANCELLED"}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                          >
                            Cancel
                          </button>
                        </div>
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

export default PaymentsPage;
