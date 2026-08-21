import api from "./api";

export const generateTrip = async (country: string,travelStyle: string,interests: string,budget: string,duration: number,groupType: string) => {
  const res = await api.post("/trip/generate-trip", {country,travelStyle,interests,budget,duration,groupType});
  return res.data;
};

export const getTripDetails = async (tripId: string) => {
  const res = await api.get(`/trip/${tripId}`);
  return res.data;
};

export const getAllTrips = async (page: number , limit:number) => {
  const res = await api.get(`/trip/all?page=${page}&limit=${limit}`);
  return res.data;
}

export const getTripsByUser = async (page: number , limit:number) => {
  const res = await api.get(`/trip/user-trips?page=${page}&limit=${limit}`);
  return res.data;
}

export const updateTrip = async (tripId: string, formData: FormData) => {
  const res = await api.put(`/trip/edit/${tripId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
}

export const deleteTrip = async (tripId: string) => {
  const res = await api.delete(`/trip/delete/${tripId}`);
  return res.data;
}
