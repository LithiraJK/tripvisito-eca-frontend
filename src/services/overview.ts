import api from "./api";

export const fetchDashboardStats = async () => {
    const res = await api.get(`/dashboard/stats`);
    return res.data;

}

export const fetchUserGrowthPerDay = async () => {
    const res = await api.get(`/dashboard/user-growth`);
    return res.data;

}

export const fetchTripsCreatedPerDay = async () => {
    const res = await api.get(``);
    return res.data;

}

export const fetchTripsByTravelStyle = async () => {
    const res = await api.get(``);
    return res.data;

}