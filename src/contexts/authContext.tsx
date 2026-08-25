import { createContext, useContext, useEffect, useState } from "react";
import { getMyDetails } from "../services/auth";

const AuthContext = createContext<any>(null);

const DUMMY_USER = {
  id: 1,
  name: "Super Admin",
  email: "admin@tripvisito.com",
  role: "ADMIN",
  roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN", "ROLE_USER"],
  isAuthenticated: true,
  profileImg: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  profileimg: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
};

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(DUMMY_USER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setLoading(true);
      getMyDetails()
        .then((res) => {
          if (res.data) setUser(res.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []); // Run only once on mount

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
