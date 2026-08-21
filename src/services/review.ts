import api from "./api";

export const submitTripReview = async (reviewData: { tripId: string; rating: number; comment?: string; description?: string }) => {
    const payload = {
        tripId: reviewData.tripId,
        rating: reviewData.rating,
        description: reviewData.description || reviewData.comment || ""
    };
    const res = await api.post("/reviews/submit", payload);
    return res.data;
};

export const fetchTripReviews = async (tripId: string) => {
    const res = await api.get(`/reviews/trip/${tripId}`);
    return res.data;
};

export const fetchAllReviews = async (page: number, limit: number) => {
    const res = await api.get(`/reviews?page=${page}&limit=${limit}`);
    return res.data;
};

export const getMyReviews = async () => {
    const res = await api.get("/reviews/user");
    return res.data;
};

export const deleteReview = async (reviewId: number | string) => {
    const res = await api.delete(`/reviews/${reviewId}`);
    return res.data;
};