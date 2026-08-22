import api from "./api"

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password })
  return res.data
}

export const register = async (name: string, email: string, password: string) => {
  const res = await api.post("/auth/register", { name, email, password })
  return res.data
}

export const getMyDetails = async () => {
  const res = await api.get("/auth/me")
  return res.data
}

export const getAllUsers = async (page:number , limit:number) => {
  const res = await api.get(`/auth/users?page=${page}&limit=${limit}`)
  return res.data;
}

export const refreshTokens = async (refreshToken: string) => {
  const res = await api.post("/auth/refresh", {
    refreshToken: refreshToken
  })
  return res.data
}

export const addNewUser = async (formData: FormData) => {
  const res = await api.post("/auth/register/new-user", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return res.data
}

export const updateUserStatus = async (userId: string, isBlock: boolean) => {
  const res = await api.put(`/auth/status/${userId}`, { isBlock });
  return res.data;
}

export const deleteUser = async (userId: string) => {
  const res = await api.delete(`/auth/delete/${userId}`);
  return res.data;
}

export const fetchLatestUsers = async () => {
  const res = await api.get("/auth/latest-users");
  return res.data;
}

export const updateProfile = async (name: string, profileimg?: File) => {
  const formData = new FormData();
  formData.append("name", name);
  if (profileimg) {
    formData.append("profileimg", profileimg);
  }
  const res = await api.put("/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const editUserDetails = async (userId: string, formData: FormData) => {
  const res = await api.put(`/auth/users/edit/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};
