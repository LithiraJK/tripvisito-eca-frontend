import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { sidebarItems } from "../constants/index.ts";
import logo from "../assets/icons/logo.svg";
import logoutIcon from "../assets/icons/logout.svg";

// Services
import { getMyDetails } from "../services/auth.ts";

const NavItems = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // 1. Initial Data Load
  useEffect(() => {
    let isMounted = true;

    const loadSidebarData = async () => {
      try {
        const uRes = await getMyDetails();
        if (isMounted) {
          setUser(uRes.data || uRes);
        }
      } catch (error) {
        console.error("Error loading user profile details:", error);
      }
    };

    loadSidebarData();
    return () => { isMounted = false; };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <section className="flex flex-col h-full relative">
      
      {/* --- TOP SECTION: LOGO --- */}
      <div className="flex items-center justify-between pr-4 relative">
        <Link
          to="/"
          className="nav-link flex flex-row items-center space-x-2 p-4"
        >
          <img src={logo} alt="logo" className="size-9" />
          <h1 className="text-2xl font-bold">Tripvisito</h1>
        </Link>
      </div>

      {/* --- NAVIGATION ITEMS --- */}
      <div className="flex flex-col gap-9 mt-6 flex-1 px-4">
        <nav>
          {sidebarItems.map(({ id, href, icon: Icon, label }) => (
            <NavLink
              to={href}
              key={id}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3.5 font-medium rounded-xl mb-2 transition-all ${
                  isActive
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon className="size-5" />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* --- USER FOOTER --- */}
        {user && (
          <footer className="flex items-center gap-3 pb-8 mt-auto border-t border-gray-100 pt-6">
            <img
              src={user.profileimg || user.profileImg || "/default-avatar.png"}
              alt={user.name}
              className="size-10 rounded-full shrink-0 border-2 border-white shadow-sm"
            />
            <article className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-900 truncate">{user.name}</h2>
              <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
            </article>
            <button
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              onClick={handleLogout}
            >
              <img src={logoutIcon} alt="Logout" className="size-6 opacity-70 group-hover:opacity-100" />
            </button>
          </footer>
        )}
      </div>
    </section>
  );
};

export default NavItems;