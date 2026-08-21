import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoClose,
  IoStar,
  IoStarOutline,
  IoTrashOutline,
} from "react-icons/io5";
import Header from "../../components/Header";
import TripCard from "../../components/TripCard";
import toast from "react-hot-toast";
import { getMyDetails, updateProfile } from "../../services/auth";
import { getMyBookedTrips } from "../../services/payment";
import { submitTripReview, getMyReviews, deleteReview } from "../../services/review";
import api from "../../services/api";
import { useAuth } from "../../contexts/authContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  pageVariants,
  modalVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "../../lib/animations";

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"CONFIRMED" | "PENDING" | "REVIEWS">("CONFIRMED");
  const [isProcessing, setIsProcessing] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const { user: authUser } = useAuth();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const openProfileModal = () => {
    setProfileName(user?.name || authUser?.name || "");
    setProfileFile(null);
    setProfilePreview(user?.profileimg || user?.profileImg || authUser?.profileimg || authUser?.profileImg || null);
    setShowProfileModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      setIsUpdatingProfile(true);
      await updateProfile(profileName, profileFile || undefined);
      toast.success("Profile updated successfully!");
      
      const uRes = await getMyDetails();
      setUser(uRes.data || uRes);
      setShowProfileModal(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
      console.error(err);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const refreshReviews = async () => {
    try {
      const rRes = await getMyReviews();
      setReviews(rRes.data || rRes || []);
    } catch (error) {
      console.error("Error refreshing reviews:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch User Details
      try {
        const uRes = await getMyDetails();
        console.log("[UserDashboard] User details response:", uRes);
        setUser(uRes.data || uRes);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }

      // 2. Fetch Booked Trips
      try {
        const bRes = await getMyBookedTrips();
        console.log("[UserDashboard] Booked trips response:", bRes);
        setBookings(bRes.data?.items || bRes.data || bRes || []);
      } catch (error) {
        console.error("Failed to load user bookings:", error);
        toast.error("Failed to load your booking history.");
      }

      // 3. Fetch Reviews
      try {
        const rRes = await getMyReviews();
        console.log("[UserDashboard] Reviews response:", rRes);
        setReviews(rRes.data || rRes || []);
      } catch (error) {
        console.error("Failed to load user reviews:", error);
      }
    };
    fetchData();
  }, []);

  const handleReviewSubmit = async () => {
    try {
        const tripId = selectedBooking?.tripId?._id || selectedBooking?.tripId?.id;

        if (!tripId || rating === 0) {
            toast.error("Please provide a rating before submitting.");
            return;
        }

        await submitTripReview({
            tripId,
            rating,
            comment: reviewText
        });

        toast.success(`Thank you! Your review for ${selectedBooking?.tripId?.tripDetails?.name} is live.`);
        
        setShowReviewModal(false);
        setRating(0);
        setReviewText("");
        refreshReviews();
        
    } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to submit review";
        toast.error(errorMessage);
        console.error("Review Error:", err);
    }
  };

  const handlePayNow = async (booking: any) => {
    try {
      setIsProcessing(true);
      const response = await api.post("/payment/checkout", {
        tripId: booking.tripId?._id || booking.tripId?.id,
        tripName: booking.tripName || booking.tripId?.tripDetails?.name,
        amount: booking.amount,
        userProfileImg: user?.profileimg || user?.profileImg,
      });

      const checkoutUrl = response.data?.data?.url || response.data?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteReview = async (reviewId: number | string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted successfully.");
      refreshReviews();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  const filteredTrips = bookings.filter((b) => b.status === activeTab);

  return (
    <motion.main 
      className="relative flex flex-col gap-8 w-full pb-20 max-w-7xl mx-auto px-4 lg:px-8"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >

      {/* --- HEADER --- */}
      <div className="flex justify-between items-center bg-gray-50/50 p-8 rounded-4xl border border-gray-100/80">
        <Header
          title={`Welcome, ${user?.name || authUser?.name || "Guest"} 👋`}
          description="Manage your bookings and stay updated."
        />
        <button
          onClick={openProfileModal}
          className="px-6 py-3 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-500 rounded-2xl text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
        >
          Edit Profile
        </button>
      </div>

      {/* --- BOOKING TABS --- */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-gray-800">My Trip History</h2>
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("CONFIRMED")}
            className={`px-6 py-3 font-semibold text-sm transition-all ${
              activeTab === "CONFIRMED"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Confirmed Trips ({bookings.filter((b) => b.status === "CONFIRMED").length})
          </button>
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`px-6 py-3 font-semibold text-sm transition-all ${
              activeTab === "PENDING"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Pending Payments ({bookings.filter((b) => b.status === "PENDING").length})
          </button>
          <button
            onClick={() => setActiveTab("REVIEWS")}
            className={`px-6 py-3 font-semibold text-sm transition-all ${
              activeTab === "REVIEWS"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            My Reviews ({reviews.length})
          </button>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7"
          key={activeTab}
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
        >
          {activeTab === "REVIEWS" ? (
            reviews.length > 0 ? (
              reviews.map((rev) => (
                <motion.div 
                  key={rev.id} 
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col gap-4 relative group"
                  variants={staggerItemVariants}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <IoStar 
                          key={star} 
                          className={star <= rev.rating ? "text-amber-400" : "text-gray-200"} 
                          size={18} 
                        />
                      ))}
                    </div>
                    <button 
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete Review"
                    >
                      <IoTrashOutline size={18} />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm italic leading-relaxed flex-1">
                    "{rev.description}"
                  </p>
                  <div className="border-t border-gray-50 pt-3 mt-auto">
                    <p className="text-xs font-bold text-blue-500">Trip ID: {rev.tripId}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-gray-400 italic bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                You haven't written any reviews yet.
              </div>
            )
          ) : filteredTrips.length > 0 ? (
            filteredTrips.map((book) => {
              const trip = book.tripId;
              const details = trip?.tripDetails;

              return (
                <motion.div 
                   key={book._id || book.id} 
                  className="flex flex-col gap-3 group"
                  variants={staggerItemVariants}
                >
                  <TripCard
                    id={trip?._id || trip?.id}
                    name={details?.name || "Booking Information"}
                    location={details?.country || "Location not set"}
                    imageUrl={trip?.imageUrls?.[0] || ""}
                    tags={[
                      details?.budget,
                      details?.travelStyle,
                      Array.isArray(details?.interests)
                        ? details.interests[0]
                        : details?.interests,
                    ].filter(Boolean)}
                    price={book.amount}
                  />
                  
                  {/* Confirmed Trips Action Buttons */}
                  {activeTab === "CONFIRMED" && (
                    <div className="flex gap-2 w-full mt-1">
                      <Link
                        to={`/trip/${trip?._id || trip?.id}`}
                        className="flex-1 text-center py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center border border-gray-100"
                      >
                        View Details
                      </Link>
                      <motion.button
                        onClick={() => { setSelectedBooking(book); setShowReviewModal(true); }}
                        className="flex-1 py-2.5 bg-blue-50 text-blue-500 rounded-2xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-xs cursor-pointer border border-blue-100/50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Review
                      </motion.button>
                    </div>
                  )}

                  {/* Pending Payments Action Buttons */}
                  {activeTab === "PENDING" && (
                    <div className="flex gap-2 w-full mt-1">
                      <Link
                        to={`/trip/${trip?._id || trip?.id}`}
                        className="flex-1 text-center py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center border border-gray-100"
                      >
                        View Details
                      </Link>
                      <motion.button
                        onClick={() => handlePayNow(book)}
                        disabled={isProcessing}
                        className="flex-1 py-2.5 bg-green-50 text-green-600 rounded-2xl text-xs font-bold hover:bg-green-600 hover:text-white transition-all shadow-xs cursor-pointer border border-green-100/50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-none"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isProcessing ? "Processing..." : "Pay Now"}
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-gray-400 italic bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
              No {activeTab.toLowerCase()} trips found.
            </div>
          )}
        </motion.div>
      </section>

      {/* --- REVIEW MODAL --- */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div 
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div 
              className="bg-white w-full max-w-md rounded-4xl shadow-2xl p-8 flex flex-col gap-6"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">Trip Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                <IoClose size={24} />
              </button>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest text-center">
                How was your experience in {selectedBooking?.tripId?.tripDetails?.country}?
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="hover:scale-110 transition-transform">
                    {star <= rating ? (
                      <IoStar size={36} className="text-amber-400" />
                    ) : (
                      <IoStarOutline size={36} className="text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <textarea 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Tell us about your adventure..."
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button 
              onClick={handleReviewSubmit}
              disabled={rating === 0}
              className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-200 disabled:shadow-none transition-all active:scale-95"
            >
              Submit Review
            </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PROFILE MODAL --- */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div 
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
          >
            <motion.form 
              onSubmit={handleProfileUpdate}
              className="bg-white w-full max-w-md rounded-4xl shadow-2xl p-8 flex flex-col gap-6"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-900">Profile Settings</h3>
                <button type="button" onClick={() => setShowProfileModal(false)} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                  <IoClose size={24} />
                </button>
              </div>

              {/* Photo Preview & Hidden Upload Trigger */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative group w-28 h-28">
                  <label htmlFor="profile-upload" className="cursor-pointer block w-full h-full">
                    <div className="w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden relative bg-blue-50 flex items-center justify-center transition-all group-hover:scale-105">
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-black text-blue-500">
                          {(profileName || "G").charAt(0).toUpperCase()}
                        </span>
                      )}
                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change Photo</span>
                      </div>
                    </div>
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-400">Click circle to upload a photo</p>
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Display Name</span>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </label>
              </div>

              <button 
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-200 disabled:shadow-none transition-all active:scale-95"
              >
                {isUpdatingProfile ? "Updating..." : "Save Changes"}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default UserDashboard;