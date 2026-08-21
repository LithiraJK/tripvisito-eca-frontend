import { Link, useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import React, { useState } from "react";
import { login } from "../services/auth";
import { useAuth } from "../contexts/authContext";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google"; 
import axios from "axios";
import api from "../services/api";
import logo from "../assets/icons/logo.svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. MANUAL LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please Enter both email and password!");
      return;
    }

    try {
      const response: any = await login(email, password);

      if (response?.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        const userDetails = response.data.user;
        setUser(userDetails);

        const loggedInUser = response.data.user;
        setUser(loggedInUser);

          const defaultPath = loggedInUser.roles.includes("ADMIN") || loggedInUser.roles.includes("SUPERADMIN")
          ? "/admin/dashboard"
          : "/";

        const redirectPath = location.state?.from
          ? `${location.state.from.pathname}${location.state.from.search || ""}`
          : defaultPath;

        toast.success("Welcome back to Tripvisito!");
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 100);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed, please check your credentials");
    }
  };

  // --- 2. GOOGLE LOGIN LOGIC ---
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Google profile pic
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        console.log("Actual Google User:", res.data);

        const googleUser = res.data;

        const response = await api.post("/auth/google-login", {
          name: googleUser.name,
          email: googleUser.email,
          profileImg: googleUser.picture,
        });

        const backendData = response.data.data;
        console.log("Backend Response:", backendData)

        if (backendData.accessToken) {
          localStorage.setItem("accessToken", backendData.accessToken);
          localStorage.setItem("refreshToken", backendData.refreshToken);

          const loggedInUser = backendData.user;
          setUser(loggedInUser);
          
          const defaultPath = loggedInUser.roles.includes("ADMIN") || loggedInUser.roles.includes("SUPERADMIN")
            ? "/admin/dashboard"
            : "/";

          const redirectPath = location.state?.from
            ? `${location.state.from.pathname}${location.state.from.search || ""}`
            : defaultPath;

          toast.success("Logged in with Google!");
          navigate(redirectPath, { replace: true });
        }
      } catch (error) {
        console.error("Google Login Error:", error);
        toast.error("Google Login failed!");
      }
    },
    onError: () => toast.error("Google Login Failed!"),
  });

  return (
    <main className='w-full h-screen flex justify-center items-center min-h-screen bg-[url("https://res.cloudinary.com/dxs4vmk1i/image/upload/v1767602259/auth-img_nyrdnw.webp")] bg-cover bg-no-repeat'>
      <section className="size-full bg-[rgba(255,255,255,0.3)] glassmorphism flex justify-center items-center px-2 sm:px-4 overflow-y-auto">
        <div className="w-full max-w-6xl px-2 xs:px-4 sm:px-8 md:px-12 py-6 sm:py-8 md:py-12 bg-[rgba(255,255,255,0.4)] backdrop-blur-lg rounded-2xl sm:rounded-3xl my-4 sm:my-8 space-y-6 sm:space-y-8 md:space-y-0 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <header className="md:flex md:flex-col md:justify-center md:h-full space-y-6">
            <Link to="/" className="nav-link flex flex-row items-center space-x-3 mb-4 group transition-all">
              <img src={logo} alt="logo" className="md:size-10 transition-transform group-hover:scale-110" />
              <h1 className="sm:text-2xl font-bold bg-linear-to-r from-cyan-500 to-sky-600 bg-clip-text text-transparent">Tripvisito</h1>
            </Link>
            <article className="space-y-2 md:space-y-4">
              <h2 className="sm:text-xl text-2xl md:text-4xl font-bold text-gray-800 leading-tight">Start Your Travel Journey</h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md">Log in to manage your trips, discover new destinations, and create unforgettable travel experiences.</p>
            </article>
          </header>
          
          <div className="w-full">
            <div className="py-4 sm:py-6 flex flex-col justify-center">
              <div className="relative py-2 sm:py-3 w-full max-w-xl mx-auto drop-shadow-xl">
                <div className="absolute inset-0 bg-linear-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-2xl sm:rounded-3xl"></div>
                <div className="relative px-4 py-6 xs:px-6 xs:py-8 sm:p-10 bg-white shadow-lg rounded-2xl sm:rounded-3xl">
                  <div className="w-full mx-auto">
                    <div className="flex flex-col justify-center items-center mb-4 sm:mb-6">
                      <h1 className="sm:text-xl text-2xl md:text-4xl font-bold text-gray-800 mb-2">Login</h1>
                      <p className="text-lg sm:text-base text-gray-500">Welcome back!</p>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="relative">
                        <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                        <input type="text" value={email} className="text-xs xs:text-sm py-2 px-3 xs:px-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="relative">
                        <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
                        <input type="password" value={password} className="text-xs xs:text-sm py-2 px-3 xs:px-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                      </div>
                      <div className="relative pt-1 sm:pt-2">
                        <button onClick={handleLogin} className="w-full bg-linear-to-r from-cyan-400 to-sky-500 text-white text-sm sm:text-base font-semibold rounded-lg px-4 py-2 hover:opacity-90 transition-all cursor-pointer">Login</button>
                      </div>
                      
                      <p className="text-center text-xs sm:text-sm text-gray-500 py-1 sm:py-2">or</p>
                      
                      {/* --- GOOGLE LOGIN BUTTON --- */}
                      <div className="relative">
                        <button 
                          onClick={() => googleLogin()}
                          className="w-full border border-gray-300 rounded-xl py-2 flex items-center justify-center hover:bg-gray-50 transition-all cursor-pointer"
                        >
                          <FcGoogle className="mr-2 text-lg sm:text-xl" />
                          <span className="text-xs xs:text-sm sm:text-base">Continue with Google</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex justify-center mt-4 sm:mt-6">
                    <p className="text-lg xs:text-sm text-center">Don't have an account? <Link to="/register" state={{ from: location.state?.from }} className="text-blue-500 hover:underline font-medium">Sign Up</Link></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;