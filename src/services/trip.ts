import api from "./api";
import { AxiosError } from "axios";

/**
 * Extracts a user-friendly error message from an API error response.
 */
const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    // Server responded with an error
    const data = error.response?.data;
    if (data?.message) return data.message;
    if (typeof data === "string") return data;

    // Network / timeout errors
    if (error.code === "ECONNABORTED") {
      return "Request timed out. AI generation can take up to 60 seconds — please try again.";
    }
    if (error.code === "ERR_NETWORK") {
      return "Network error. Please check your connection and ensure the server is running.";
    }
  }
  return fallback;
};

export const generateTrip = async (
  country: string,
  travelStyle: string,
  interests: string,
  budget: string,
  duration: number,
  groupType: string
) => {
  try {
    const res = await api.post(
      "/trip/generate-trip",
      {
        country,
        travelStyle,
        interests: [interests], // Backend expects List<String>
        budget,
        duration,
        groupType,
      },
      {
        timeout: 120000, // 2 minutes — AI generation can take 10-60s
      }
    );
    return res.data;
  } catch (error) {
    const message = extractErrorMessage(error, "Failed to generate trip. Please try again.");
    throw new Error(message);
  }
};

export const getTripDetails = async (tripId: string) => {
  try {
    const res = await api.get(`/trip/${tripId}`);
    return res.data;
  } catch (error) {
    const message = extractErrorMessage(error, "Failed to load trip details.");
    throw new Error(message);
  }
};

export const getAllTrips = async (page: number, limit: number) => {
  try {
    const res = await api.get(`/trip/all?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    const message = extractErrorMessage(error, "Failed to load trips.");
    throw new Error(message);
  }
};

export const getTripsByUser = async (page: number, limit: number) => {
  try {
    const res = await api.get(`/trip/user-trips?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    const message = extractErrorMessage(error, "Failed to load your trips.");
    throw new Error(message);
  }
};

export const updateTrip = async (tripId: string, formData: FormData) => {
  try {
    const res = await api.put(`/trip/edit/${tripId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    const message = extractErrorMessage(error, "Failed to update trip.");
    throw new Error(message);
  }
};

export const deleteTrip = async (tripId: string) => {
  try {
    const res = await api.delete(`/trip/delete/${tripId}`);
    return res.data;
  } catch (error) {
    const message = extractErrorMessage(error, "Failed to delete trip.");
    throw new Error(message);
  }
};
