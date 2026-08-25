  import { useEffect, useState } from "react";
  import Header from "../../components/Header";
  import StatsCard from "../../components/StatsCard";
  import TripCard from "../../components/TripCard";
  import { fetchLatestUsers, getMyDetails, updateUserStatus } from "../../services/auth";
  import { fetchAllReviews } from "../../services/review";
  import { FaPlus } from "react-icons/fa6";
  import Swal from "sweetalert2";
  import withReactContent from "sweetalert2-react-content";

  const MySwal = withReactContent(Swal);
  import { getAllTrips } from "../../services/trip";
  import { TripTrendsChart } from "../../components/TripTrendsChart";
  import { UserGrowthChart } from "../../components/UserGrowthChart";
  import {
    fetchDashboardStats,
    fetchUserGrowthPerDay,
  } from "../../services/overview";
  import Chip from "../../components/Chip";
  import { fetchLatestPayments } from "../../services/payment";
  import { cn } from "../../lib/utils";
  import { motion } from "framer-motion";
  import {
    pageVariants,
    staggerContainerVariants,
    staggerItemVariants,
    fadeInUpVariants,
    scrollRevealViewport
  } from "../../lib/animations";

  const Dashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [allTrips, setAllTrips] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [growthData, setGrowthData] = useState({ labels: [], values: [] });
    const [latestUsers, setLatestUsers] = useState<any[]>([]);
    const [latestBookings, setLatestBookings] = useState<any[]>([]);
    const [latestReviews, setLatestReviews] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<"users" | "payments" | "reviews">("users");

    useEffect(() => {
      let isMounted = true;

      const getUserDetails = async () => {
        try {
          const response = await getMyDetails();
          console.log(response);
          if (isMounted) {
            setUser(response.data);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      const fetchAllTrips = async () => {
        try {
          const response = await getAllTrips(1, 4);
          console.log("All Trips Data:", response);
          setAllTrips(response.data.items || response.data.trips || []);
        } catch (error) {
          console.error("Error loading popular trips:", error);
        }
      };

      const fetchStats = async () => {
        try {
          const response = await fetchDashboardStats();
          setStats(response.data);
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
        }
      };

      const loadLatestUsers = async () => {
        try {
          const response = await fetchLatestUsers();
          setLatestUsers(response.data);
        } catch (error) {
          console.error("Error loading latest users:", error);
        }
      };

      const fetchBookings = async () => {
          try {
              const response = await fetchLatestPayments(); 
              console.log("Latest Bookings Response:", response);
              setLatestBookings(response.data || []);
          } catch (error) {
              console.error("Error loading latest bookings:", error);
          }
      };

      const loadLatestReviews = async () => {
          try {
              const response = await fetchAllReviews(1, 5);
              console.log("Latest Reviews Response:", response);
              setLatestReviews(response.data?.items || []);
          } catch (error) {
              console.error("Error loading latest reviews:", error);
          }
      };

      const fetchGrowth = async () => {
        try {
          const response = await fetchUserGrowthPerDay();
          const rawData = response.data;

          const labels = rawData.map((item: any) => {
            const date = new Date(item._id);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          });

          const values = rawData.map((item: any) => item.count);

          setGrowthData({ labels, values });
        } catch (error) {
          console.error("Error formatting chart data:", error);
        }
      };

      getUserDetails();
      fetchAllTrips();
      fetchStats();
      fetchGrowth();
      loadLatestUsers();
      fetchBookings();
      loadLatestReviews();

      return () => {
        isMounted = false;
      };
    }, []);

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
          setLatestUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId ? { ...user, isBlock: !isBlock } : user
            )
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

    const getTripName = (tripId: string) => {
      const trip = allTrips.find((t) => t.id === tripId);
      return trip?.tripDetails?.name || `Trip (ID: ${tripId.substring(0, 8)}...)`;
    };

    return (
      <motion.main 
        className="flex flex-col gap-10 w-full pb-20 max-w-7xl mx-auto px-4 lg:px-8"
        initial="initial"
        animate="animate"
        variants={pageVariants}
      >
        <Header
          title={`Welcome, ${user?.name ?? "Guest"} 👋`}
          description="Track activity, trends and popular destinations"
          ctaText="Create a trip"
          ctaURL="/admin/trips?create=true"
          icon={<FaPlus />}
        />

        <section className="flex flex-col gap-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={scrollRevealViewport}
            variants={staggerContainerVariants}
          >
            {/* Total Users Card */}
            <StatsCard
              headerTitle="Total Users"
              total={stats?.users?.total || 0}
              currentMonthCount={stats?.users?.currentMonth || 0}
              lastMonthCount={stats?.users?.lastMonth || 0}
              chartData={stats?.users?.trend || []}
            />

            {/* Total Trips Card */}
            <StatsCard
              headerTitle="Total Trips"
              total={stats?.trips?.total || 0}
              currentMonthCount={stats?.trips?.currentMonth || 0}
              lastMonthCount={stats?.trips?.lastMonth || 0}
              chartData={stats?.trips?.trend || []}
            />

            {/* Active Users Card */}
            <StatsCard
              headerTitle="Active Users"
              total={stats?.active?.total || 0}
              currentMonthCount={stats?.active?.currentMonth || 0}
              lastMonthCount={stats?.active?.lastMonth || 0}
              chartData={stats?.active?.trend || []}
            />
          </motion.div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-9 mt-2.5">
            <motion.h1 
              className="text-xl font-semibold text-black"
              initial="hidden"
              whileInView="visible"
              viewport={scrollRevealViewport}
              variants={fadeInUpVariants}
            >
              Trips
            </motion.h1>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7"
              initial="hidden"
              whileInView="visible"
              viewport={scrollRevealViewport}
              variants={staggerContainerVariants}
            >
              {allTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  id={trip.id}
                  name={trip.tripDetails?.name || ""}
                  location={trip.tripDetails?.location?.city || ""}
                  imageUrl={trip.imageUrls?.[0] || ""}
                  tags={[
                    trip.tripDetails?.budget,
                    trip.tripDetails?.travelStyle,
                    Array.isArray(trip.tripDetails?.interests)
                      ? trip.tripDetails.interests[0]
                      : trip.tripDetails?.interests,
                  ].filter(Boolean)}
                  price={trip.tripDetails?.estimatedPrice || ""}
                />
              ))}
            </motion.div>
          </div>
        </section>
        <motion.section 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={scrollRevealViewport}
          variants={staggerContainerVariants}
        >
          {/* User Growth Card */}
          <motion.div 
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[350px]"
            variants={staggerItemVariants}
          >
            <h3 className="text-lg font-bold mb-4">User Growth</h3>
            <div className="h-[250px]">
              <UserGrowthChart
                labels={growthData.labels}
                values={growthData.values}
              />
            </div>
          </motion.div>

          {/* Trip Trends Card */}
          <motion.div 
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[350px]"
            variants={staggerItemVariants}
          >
            <h3 className="text-lg font-bold mb-4">Trip Trends</h3>
            <div className="h-[250px]">
              <TripTrendsChart />
            </div>
          </motion.div>
        </motion.section>

        <motion.section 
          className="w-full mt-10 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
          initial="hidden"
          whileInView="visible"
          viewport={scrollRevealViewport}
          variants={fadeInUpVariants}
        >
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">System Records Manager</h2>
              <p className="text-sm text-gray-500 mt-1">Monitor recent registrations, payments, and reviews</p>
            </div>
            
            <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100 self-start md:self-auto">
              <button
                onClick={() => setActiveTab("users")}
                className={cn(
                  "px-4 py-2 text-xs font-semibold rounded-lg transition-all",
                  activeTab === "users" 
                    ? "bg-white text-blue-600 shadow-sm border border-gray-100" 
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={cn(
                  "px-4 py-2 text-xs font-semibold rounded-lg transition-all",
                  activeTab === "payments" 
                    ? "bg-white text-blue-600 shadow-sm border border-gray-100" 
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                Payments
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={cn(
                  "px-4 py-2 text-xs font-semibold rounded-lg transition-all",
                  activeTab === "reviews" 
                    ? "bg-white text-blue-600 shadow-sm border border-gray-100" 
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                Reviews
              </button>
            </div>
          </div>

          {/* Tab Contents */}
          <div className="overflow-x-auto">
            {activeTab === "users" && (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-100">
                    <th className="pb-4 font-normal">User</th>
                    <th className="pb-4 font-normal">Joined Date</th>
                    <th className="pb-4 font-normal">Status</th>
                    <th className="pb-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {latestUsers.map((u) => (
                    <tr key={u._id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <img
                          src={u.profileImg || u.profileimg || "/default-avatar.png"}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-bold text-black">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {new Date(u.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <Chip label={u.isBlock ? "Blocked" : "Active"} variant={u.isBlock ? "danger" : "success"} />
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => handleUserStatusToggle(u._id, u.isBlock)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            u.isBlock ? 'bg-gray-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              u.isBlock ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {latestUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                        No recent users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "payments" && (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-100">
                    <th className="pb-4 font-normal">Trip & User</th>
                    <th className="pb-4 font-normal">Amount</th>
                    <th className="pb-4 font-normal">Date</th>
                    <th className="pb-4 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestBookings.map((payment) => {
                    let tripInfo = { name: "Unnamed Trip" };
                    try {
                      if (payment.tripId?.tripDetails) {
                        tripInfo = typeof payment.tripId.tripDetails === 'string' 
                          ? JSON.parse(payment.tripId.tripDetails) 
                          : payment.tripId.tripDetails;
                      }
                    } catch (error) {
                      console.error('Error parsing trip details:', error);
                    }

                    return (
                      <tr key={payment._id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={payment.userId?.profileimg || '/default-avatar.png'} 
                              alt={payment.userId?.name || 'User'} 
                              className="w-10 h-10 rounded-full object-cover" 
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-black truncate max-w-[200px]">
                                {tripInfo.name || "Unnamed Trip"}
                              </span>
                              <span className="text-xs text-gray-400">
                                {payment.userId?.name || 'Unknown'} • {payment.userId?.email || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-sm font-semibold text-gray-700">
                          ${payment.amount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-4 text-right">
                          <span className={cn(
                            "px-3 py-1 text-[10px] font-bold rounded-full",
                            payment.status === "CONFIRMED" ? "bg-green-50 text-green-600" :
                            payment.status === "PENDING" ? "bg-yellow-50 text-yellow-600" : 
                            "bg-red-50 text-red-600"
                          )}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {latestBookings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                        No recent bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "reviews" && (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-100">
                    <th className="pb-4 font-normal">Reviewer & Trip</th>
                    <th className="pb-4 font-normal">Rating</th>
                    <th className="pb-4 font-normal">Comment</th>
                    <th className="pb-4 font-normal text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {latestReviews.map((review) => (
                    <tr key={review.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.userProfileImg || "/default-avatar.png"}
                            alt={review.userName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-bold text-black">{review.userName}</p>
                            <p className="text-xs text-blue-500 font-medium">{getTripName(review.tripId)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-0.5 text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="text-sm">
                              {i < review.rating ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-600 max-w-xs truncate">
                        {review.description}
                      </td>
                      <td className="py-4 text-right text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {latestReviews.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                        No reviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </motion.section>
      </motion.main>
    );
  };

  export default Dashboard;
