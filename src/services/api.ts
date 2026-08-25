import axios from "axios";

const BASE_URL = "http://8.232.84.60:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
