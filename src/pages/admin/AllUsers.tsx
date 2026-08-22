import Header from "../../components/Header";
import {
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
} from "react-icons/fi";
import Chip from "../../components/Chip";
import { useEffect, useState } from "react";
import { deleteUser, getAllUsers, updateUserStatus } from "../../services/auth";
import { formatDate } from "../../lib/utils";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);


const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllUsers(page, 6);
        const allUsers = response.data?.items || response.data?.users || [];
        const filteredUsers = allUsers.filter((user: any) => !user.roles.includes("SUPERADMIN"));
        setUsers(filteredUsers);
        setTotalPages(response.data?.totalPages || 1);
      } catch (error) {
        setError("Failed to fetch users");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
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

      // Show pages around current page
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


  const getRoleLabel = (roles: string[]) => {
    if (roles.includes("ADMIN")) return "Admin";
    return "User";
  };

  const getRoleVariant = (roles: string[]) => {
    if (roles.includes("ADMIN")) return "success";
    return "default";
  };

  const handleUserStatusToggle = async (userId: string, isBlock: boolean) => {
    const action = isBlock ? "Unblock" : "Block";
    const result = await MySwal.fire({
      title: `${action} User`,
      text: `Are you sure you want to ${action.toLowerCase()} this user?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: isBlock ? '#3b82f6' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await updateUserStatus(userId, !isBlock);
        setUsers((prevUsers) =>
          prevUsers.map((user) => {
            const currentId = user.id?.toString() || user._id;
            return currentId === userId ? { ...user, blocked: !isBlock, isBlock: !isBlock } : user;
          })
        );
        MySwal.fire({
          title: 'Success!',
          text: `User has been ${action.toLowerCase()}ed successfully.`,
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          timer: 2000
        });
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update user status. Please try again.';
        MySwal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  const handleUserDelete = async (userId: string) => {
    const result = await MySwal.fire({
      title: 'Delete User',
      text: 'Are you sure you want to delete this user? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(userId);
        setUsers((prevUsers) => prevUsers.filter((user) => (user.id?.toString() || user._id) !== userId));
        MySwal.fire({
          title: 'Deleted!',
          text: 'User has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          timer: 2000
        });
      } catch (error: any) {
        console.error("Failed to delete user", error);
        const errorMessage = error?.response?.data?.message || error?.message;
        MySwal.fire({
          title: 'Error!',
          text: errorMessage || 'Failed to delete user. Please try again.',
          icon: 'error',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col gap-10 max-w-7xl mx-auto px-4 lg:px-8">
      <Header title="All Users" description="Manage all users here" ctaText="Add new User" ctaURL="/admin/user/create" icon={<FaPlus />} />
      <section>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Date Joined
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Is Block</th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => {
                    const userId = user.id?.toString() || user._id;
                    const isBlocked = user.blocked !== undefined ? user.blocked : user.isBlock;
                    const profileImage = user.profileImg || user.profileimg || "/default-avatar.png";
                    return (
                      <tr
                        key={userId}
                        className="hover:bg-blue-50 transition-colors group"
                      >
                        <td className="py-4 px-4 flex items-center gap-3">
                          <img
                            src={profileImage}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {user.name}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {formatDate(user.joinedAt)}
                        </td>
                        <td className="py-4 px-4">
                          <Chip
                            className="py-0.5"
                            label={getRoleLabel(user.roles)}
                            variant={getRoleVariant(user.roles)}
                          />
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button 
                            onClick={() => {
                            handleUserStatusToggle(userId, isBlocked);
                            console.log('Toggle user:', userId);
                            }}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            isBlocked ? 'bg-gray-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              isBlocked ? 'translate-x-5' : 'translate-x-1'
                            }`}
                            />
                          </button>
                        </td>
                        <td className="py-4 px-4 text-right flex justify-end gap-3.5">
                          <button
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            onClick={() => navigate(`/admin/user/edit/${userId}`, { state: { editUser: user } })}
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button className="text-gray-400 hover:text-red-500 transition-colors" onClick={() => {handleUserDelete(userId)}}>
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
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

export default AllUsers;
