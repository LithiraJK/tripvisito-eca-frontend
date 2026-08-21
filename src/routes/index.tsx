import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "../contexts/authContext";
import { Toaster } from "react-hot-toast";
import { CreateTrip } from "../pages/trip/CreateTrip";
import TravelLoader from "../components/TravelLoader";

const TripDetails = lazy(() => import("../pages/trip/TripDetails"));
const LandingLayout = lazy(() => import("../pages/LandingLayout"));
const CreateUser = lazy(() => import("../pages/admin/CreateUser"));
const UpdateTrip = lazy(() => import("../pages/trip/UpdateTrip"));
const ThankyouMessage = lazy(() => import("../components/ThankyouMessage"));

const AdminLayout = lazy(() => import("../pages/AdminLayout"));
const Index = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Trips = lazy(() => import("../pages/admin/TripsPage"));
const AllUsers = lazy(() => import("../pages/admin/AllUsers"));
const PaymentsPage = lazy(() => import("../pages/admin/PaymentsPage"));
const ReviewsPage = lazy(() => import("../pages/admin/ReviewsPage"));




type RequiredAuthTypes = {
  children: React.ReactNode;
  roles?: string[];
};

const RequireAuth = ({ children, roles }: RequiredAuthTypes) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // SUPERADMIN has bypass access to all routes
  const isSuperAdmin = user.roles?.includes("SUPERADMIN");
  if (roles && !isSuperAdmin && !roles.some((role) => user.roles?.includes(role))) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};
const Router = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <TravelLoader />
          </div>
        }
      >
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#363636',
            },
          }}
        />
        <Routes>
          {/* Landing Page with Layout */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/trip/:tripId" element={<TripDetails />} />
          </Route>

          {/* Protected Payment Routes */}
          <Route
            element={
              <RequireAuth>
                <LandingLayout />
              </RequireAuth>
            }
          >
            <Route path="/trip/payment/success" element={<ThankyouMessage />} />
          </Route>

          {/* Auth Pages - Full Page (No Layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/all-users" element={<AllUsers />} />
            <Route path="/admin/trips" element={<Trips />} />
            <Route path="/admin/payments" element={<PaymentsPage />} />
            <Route path="/admin/reviews" element={<ReviewsPage />} />
            <Route path="/admin/user/create" element={<CreateUser />} />
          </Route>
          <Route
            element={
              <RequireAuth roles={["ADMIN"]}>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route path="/admin/trip/create" element={<CreateTrip />} />
            {/* Dynamic Routes */}
            <Route path="/admin/trip/:tripId" element={<TripDetails />} />
            <Route path="/admin/trip/edit/:tripId" element={<UpdateTrip />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
