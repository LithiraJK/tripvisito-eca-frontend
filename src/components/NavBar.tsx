import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/icons/logo.svg";
import logoutIcon from "../assets/icons/logout.svg";
import { getMyDetails } from "../services/auth";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate()
  const location = useLocation();


   useEffect(() => {
    let isMounted = true;
    
    const getUserDetails = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUser(null);
        return;
      }
      
      try {
        const response = await getMyDetails();
        console.log(response)
        if (isMounted) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUser(null);
      }
    }

    getUserDetails();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/login')

  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="w-full flex justify-between items-center py-4 bg-transparent">
        <Link to="/" className="flex flex-row items-center gap-2 z-50">
          <img src={logo} alt="logo" className="size-8 sm:size-9" />
          {
            location.pathname === '/' ? (
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100">
                Tripvisito
              </h1>
            ) : (
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Tripvisito
              </h1>
            )
          }
        </Link>

        <div className="hidden lg:flex items-center gap-8 z-50">
          <a href="/#home" className={`${location.pathname === '/' ? 'text-gray-100 hover:text-white' : 'text-gray-700 hover:text-blue-600'} font-medium transition-colors`}>Home</a>
          <a href="/#trips" className={`${location.pathname === '/' ? 'text-gray-100 hover:text-white' : 'text-gray-700 hover:text-blue-600'} font-medium transition-colors`}>Trips</a>
          <a href="/#reviews" className={`${location.pathname === '/' ? 'text-gray-100 hover:text-white' : 'text-gray-700 hover:text-blue-600'} font-medium transition-colors`}>Reviews</a>
          <Link to="/admin/trips" className={`${location.pathname === '/' ? 'text-gray-100 hover:text-white' : 'text-gray-700 hover:text-blue-600'} font-medium transition-colors`}>Manage Trips</Link>
        </div>

        {user ? (
          <div className="hidden lg:flex items-center gap-4 z-50">
            <img
              src={user?.profileimg || user?.profileImg || "/default-avatar.png"}
              alt={user?.name || "User"}
              className="size-10 rounded-full shrink-0 border border-gray-200/50 shadow-xs"
            />
            <article className="flex-1 min-w-0">
              <h2 className="font-medium truncate">{user?.name || "Guest"}</h2>
              <p className="text-sm text-gray-600 truncate">{user?.email || "guest@example.com"}</p>
            </article>
            <button className="btn-logout cursor-pointer shrink-0"
              onClick={handleLogout}>
              <img src={logoutIcon} alt="Logout" className="size-8" />
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-3 z-50">
            
            <Link 
              to="/login" 
              className="px-6 py-2 text-white font-medium hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="lg:hidden z-50 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <Link
              to="/"
              onClick={closeSidebar}
              className="flex items-center gap-2"
            >
              <img src={logo} alt="logo" className="size-8" />
              <h1 className="text-xl font-bold text-gray-900">Tripvisito</h1>
            </Link>
            <button
              onClick={closeSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex flex-col flex-1 px-4 py-6 gap-2">
            <a href="/#home" onClick={closeSidebar} className="text-gray-700 font-semibold hover:text-blue-600 transition-colors p-2 rounded-xl hover:bg-blue-50/50">Home</a>
            <a href="/#trips" onClick={closeSidebar} className="text-gray-700 font-semibold hover:text-blue-600 transition-colors p-2 rounded-xl hover:bg-blue-50/50">Trips</a>
            <a href="/#reviews" onClick={closeSidebar} className="text-gray-700 font-semibold hover:text-blue-600 transition-colors p-2 rounded-xl hover:bg-blue-50/50">Reviews</a>
            <Link to="/admin/trips" onClick={closeSidebar} className="text-gray-700 font-semibold hover:text-blue-600 transition-colors p-2 rounded-xl hover:bg-blue-50/50">Manage Trips</Link>
            {user ? (
              <div className='flex items-center gap-2.5 pb-8 mt-auto p-4 border-t border-gray-200'>
                  <img src={user?.profileimg || user?.profileImg || '/default-avatar.png'} alt={user?.name || 'User'} className='size-10 rounded-full shrink-0 border border-gray-200/50 shadow-xs' />
                  <article className='flex-1 min-w-0'>
                    <h2 className='font-medium truncate'>{user?.name || 'Guest'}</h2>
                    <p className='text-sm text-gray-600 truncate'>{user?.email || 'guest@example.com'}</p>
                  </article>
                  <button className='btn-logout cursor-pointer shrink-0' onClick={handleLogout}>
                    <img src={logoutIcon} alt="Logout" className='size-8' />
                  </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 mt-auto pb-8 px-4">
                <Link 
                  to="/login" 
                  onClick={closeSidebar}
                  className="px-6 py-2 text-center bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  onClick={closeSidebar}
                  className="px-6 py-2 text-center border border-blue-500 text-blue-500 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavBar;
