import api from "./api";

export const getMyBookedTrips = async () => {
  const res = await api.get("/payment/my-bookings");
  return res.data;
};

export const fetchLatestPayments = async () => {
  const res = await api.get("/payment/latest");
  return res.data;
}

export const getAllBookings = async (page: number, limit: number) => {
  const res = await api.get(`/payment/all-bookings?page=${page}&limit=${limit}`);
  return res.data;
}

export const updatePaymentStatus = async (paymentId: number | string, status: string) => {
  const res = await api.put(`/payment/status/${paymentId}?status=${status}`);
  return res.data;
};
