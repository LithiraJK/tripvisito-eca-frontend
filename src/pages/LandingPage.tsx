import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getAllTrips } from "../services/trip";
import TripCard from "../components/TripCard";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { fetchAllReviews } from "../services/review";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  staggerContainerVariants, 
  staggerItemVariants,
  scrollRevealViewport
} from "../lib/animations";

const Index = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const nextReview = () => {
  setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
};

const prevReview = () => {
  setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
};

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const response = await getAllTrips(page, 8);
        setTrips(response.data.items || response.data.trips || []);
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setError("Failed to load trips");
        setLoading(false);
      }
    };

    const loadReviews = async () => {
      try {
        const response = await fetchAllReviews(1, 3);

        setReviews(response.data.items || response.data.reviews || []);
      } catch (error) {
        console.error("Error loading reviews:", error);
      }
    };

    fetchTrips();
    loadReviews();
  }, [page]);

  return (
    <div className="absolute w-full top-0 left-0">
      {/* Hero Section */}
      <section id="home" className='w-full min-h-screen flex items-center bg-[url("https://res.cloudinary.com/dxs4vmk1i/image/upload/v1767602256/hero-img_yaygpb.png")] bg-cover bg-center bg-no-repeat'>
        <div className="absolute h-screen inset-0 bg-linear-to-br from-black/60 via-[#cff1ff3f] to-transparent"></div>

        <div className="relative w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div 
              className="max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={staggerContainerVariants}
            >
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-100 mb-6 leading-tight"
                variants={staggerItemVariants}
              >
                Plan Your
                <br />
                Trip with Ease
              </motion.h1>
              <motion.p 
                className="text-base sm:text-lg text-gray-100 mb-8 leading-relaxed"
                variants={staggerItemVariants}
              >
                Customize your travel itinerary in minutes—pick your
                destination, set your preferences, and explore with confidence.
              </motion.p>
              <motion.div variants={staggerItemVariants}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="inline-block bg-white/20 transition-colors px-8 py-3 font-semibold rounded-lg shadow-lg border-2  text-white"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Header
          title={"About Tripvisito"}
          description="Learn more about our mission to revolutionize personalized travel planning"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-all duration-300">
            <span className="text-4xl">🤖</span>
            <h3 className="text-xl font-bold mt-4 mb-2">AI-Powered Travel</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our advanced generative AI creates customized, day-by-day itineraries based on your budget, interests, and style in seconds.
            </p>
          </div>
          <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-all duration-300">
            <span className="text-4xl">☁️</span>
            <h3 className="text-xl font-bold mt-4 mb-2">Cloud Infrastructure</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Powered by secure GCP cloud architecture and microservices to deliver blazing-fast response times and reliable availability.
            </p>
          </div>
          <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-all duration-300">
            <span className="text-4xl">💳</span>
            <h3 className="text-xl font-bold mt-4 mb-2">Seamless Bookings</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Integrated with Stripe for instant, secure transactions so you can book your generated plans immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Handpicked Trips Section */}
      <section id="trips" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100">
        <Header
          title={"Handpicked Trips for You"}
          description="Browse well-planned trips designed for different travel styles and interests"
        />
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">Loading trips...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">No trips found</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7"
            initial="hidden"
            whileInView="visible"
            viewport={scrollRevealViewport}
            variants={staggerContainerVariants}
          >
            {trips.map((trip) => (
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
        )}

        <div className="flex justify-between items-center border-t border-gray-100 my-5 py-5">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 hover:scale-105 px-4 py-2 rounded-lg bg-white border-0 drop-shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <FiChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {/* First page */}
            <button
              onClick={() => setPage(1)}
              className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                page === 1
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              1
            </button>

            {/* Show ellipsis if current page is far from start */}
            {page > 3 && <span className="text-gray-400 px-1">...</span>}

            {/* Pages around current page */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p > 1 && p < totalPages && Math.abs(p - page) <= 1)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                    page === p
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}

            {/* Show ellipsis if current page is far from end */}
            {page < totalPages - 2 && (
              <span className="text-gray-400 px-1">...</span>
            )}

            {/* Last page */}
            {totalPages > 1 && (
              <button
                onClick={() => setPage(totalPages)}
                className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                  page === totalPages
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {totalPages}
              </button>
            )}
          </div>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 hover:scale-105 px-4 py-2 rounded-lg bg-white border-0 drop-shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Next
            <FiChevronRight size={16} />
          </button>
        </div>
      </section>

     <section id="reviews" className="relative mb-20 w-full min-h-[700px] flex items-center justify-center overflow-hidden">
    {/* 1. Background Image with Overlay */}
    <div 
      className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?')] bg-cover bg-center transition-all duration-700"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
      <div className="flex flex-col items-center gap-12">
        
        {/* Header with light text for dark background */}
        <div className="text-center">
           <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">What Our Guests Say</h2>
           <p className="text-gray-200 max-w-xl mx-auto">Real stories from travelers who explored the world with Tripvisito.</p>
        </div>

        {/* 2. Slider Container */}
        <div className="relative w-full max-w-4xl flex items-center justify-center">
          
          {/* Left Arrow */}
          <button 
            onClick={prevReview}
            className="absolute left-0 md:-left-20 z-20 p-4 bg-transparent rounded-full text-white backdrop-blur-md hover:bg-white/10 transition-all active:scale-95"
          >
            <FiChevronLeft size={60} />
          </button>

          <AnimatePresence mode="wait">
            {reviews.length > 0 && (
              <motion.div 
                key={currentReviewIndex}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-150 h-100 bg-white/10 backdrop-blur-xl p-10 md:p-16 rounded-[40px] shadow-2xl"
              >
              <div className="flex flex-col items-center text-center gap-8">
                
                <FaQuoteLeft className="text-white/20 size-16 absolute top-10 left-10" />

                

                <p className="text-xl md:text-2xl text-white font-medium leading-relaxed italic max-w-2xl">
                  "{reviews[currentReviewIndex].description || reviews[currentReviewIndex].comment}"
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < reviews[currentReviewIndex].rating ? "text-amber-400" : "text-white/20"} 
                      size={20}
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center gap-2">
                  <img 
                    src={reviews[currentReviewIndex].userProfileImg || reviews[currentReviewIndex].userId?.profileimg || "/default-avatar.png"} 
                    alt="user" 
                    className="size-16 rounded-full object-cover ring-4 ring-white/20"
                  />
                  <div>
                    
                    <h4 className="font-bold text-white text-lg">{reviews[currentReviewIndex].userName || reviews[currentReviewIndex].userId?.name || "Anonymous"}</h4>
                  
                  </div>
                </div>
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Arrow */}
          <button 
            onClick={nextReview}
            className="absolute right-0 md:-right-20 z-20 p-4 bg-transparent rounded-full text-white backdrop-blur-md hover:bg-white/10 transition-all active:scale-95"
          >
            <FiChevronRight size={60} />
          </button>
        </div>

        {/* Slider Indicators (Dots) */}
        <div className="flex gap-2">
          {reviews.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 transition-all duration-300 rounded-full ${idx === currentReviewIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  </section>

  <Footer />

    </div>
  );
};

export default Index;
