import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { getAllTrips, createTripDirect, updateTripDirect, deleteTrip } from "../../services/trip";
import { FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

const TripManagement = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl1, setImgUrl1] = useState("");
  const [imgUrl2, setImgUrl2] = useState("");
  const [imgUrl3, setImgUrl3] = useState("");

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await getAllTrips(1, 100);
      setTrips(response.data?.items || response.data?.trips || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleReset = () => {
    setEditId(null);
    setName("");
    setCountry("");
    setDuration("");
    setPrice("");
    setDescription("");
    setImgUrl1("");
    setImgUrl2("");
    setImgUrl3("");
  };

  const handleEdit = (trip: any) => {
    setEditId(trip.id);
    setName(trip.tripDetails?.name || "");
    setCountry(trip.tripDetails?.country || "");
    setDuration(trip.tripDetails?.duration ? `${trip.tripDetails.duration} Days` : "");
    setPrice(trip.tripDetails?.estimatedPrice || "");
    setDescription(trip.tripDetails?.description || "");
    
    const urls = trip.imageUrls || [];
    setImgUrl1(urls[0] || "");
    setImgUrl2(urls[1] || "");
    setImgUrl3(urls[2] || "");
    toast.success("Loaded trip into form for editing!");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await deleteTrip(id);
      toast.success("Trip deleted successfully!");
      fetchTrips();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete trip");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !country || !duration || !price || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Convert duration string to number of days safely
    const parsedDuration = parseInt(duration) || 3;

    // Collect image URLs
    const imageUrlsList: string[] = [];
    if (imgUrl1.trim()) imageUrlsList.push(imgUrl1.trim());
    if (imgUrl2.trim()) imageUrlsList.push(imgUrl2.trim());
    if (imgUrl3.trim()) imageUrlsList.push(imgUrl3.trim());

    if (imageUrlsList.length === 0) {
      // Fallback placeholder image
      imageUrlsList.push("https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80");
    }

    const payload = {
      tripDetails: {
        name,
        description,
        estimatedPrice: price.toString(),
        duration: parsedDuration,
        budget: "Moderate",
        travelStyle: "Custom",
        country,
        interests: ["Sightseeing"],
        groupType: "Couple",
        location: {
          city: country,
          coordinates: [0, 0],
          openStreetMap: ""
        },
        itinerary: []
      },
      imageUrls: imageUrlsList,
      userId: "1"
    };

    setSubmitting(false);
    try {
      if (editId) {
        await updateTripDirect(editId, payload);
        toast.success("Trip updated successfully!");
      } else {
        await createTripDirect(payload);
        toast.success("Trip created successfully!");
      }
      handleReset();
      fetchTrips();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save trip");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Trip Management" description="Create, update, and delete trip itineraries." />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Trip Management Panel</h1>

        {/* CRUD Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editId ? "Update Trip Itinerary" : "Create New Trip Itinerary"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Trip Name / Title *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., 7-Day Romantic Paris Getaway"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination / Country *</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g., France"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (Days, number only) *</label>
                <input
                  type="number"
                  value={duration.replace(/\D/g, "")}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 7"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (USD) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., 1500"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the highlights and plans for this trip..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Images list inputs */}
            <div className="border-t border-gray-200 pt-4">
              <span className="block text-sm font-semibold text-gray-700 mb-2">Trip Images (1 to 3 Image URLs)</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Image URL 1</label>
                  <input
                    type="url"
                    value={imgUrl1}
                    onChange={(e) => setImgUrl1(e.target.value)}
                    placeholder="https://example.com/image1.jpg"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs"
                  />
                  {imgUrl1 && (
                    <img
                      src={imgUrl1}
                      alt="Preview 1"
                      className="mt-2 h-20 w-full object-cover rounded border"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Image URL 2</label>
                  <input
                    type="url"
                    value={imgUrl2}
                    onChange={(e) => setImgUrl2(e.target.value)}
                    placeholder="https://example.com/image2.jpg"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs"
                  />
                  {imgUrl2 && (
                    <img
                      src={imgUrl2}
                      alt="Preview 2"
                      className="mt-2 h-20 w-full object-cover rounded border"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Image URL 3</label>
                  <input
                    type="url"
                    value={imgUrl3}
                    onChange={(e) => setImgUrl3(e.target.value)}
                    placeholder="https://example.com/image3.jpg"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs"
                  />
                  {imgUrl3 && (
                    <img
                      src={imgUrl3}
                      alt="Preview 3"
                      className="mt-2 h-20 w-full object-cover rounded border"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50 flex items-center"
              >
                {editId ? "Update Trip" : "Save Trip"}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Trip List */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Existing Trip Plans</h2>
            <button
              onClick={fetchTrips}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <FiRefreshCw className="mr-1" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading trips...</div>
          ) : trips.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No trips found. Create one above!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip: any) => {
                const firstImage = trip.imageUrls?.[0] || "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80";
                return (
                  <div key={trip.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col bg-white hover:shadow-md transition">
                    <img
                      src={firstImage}
                      alt={trip.tripDetails?.name}
                      className="h-48 w-full object-cover"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            {trip.tripDetails?.country || "Global"}
                          </span>
                          <span className="text-gray-900 font-bold text-sm">
                            ${trip.tripDetails?.estimatedPrice || "0"}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1">
                          {trip.tripDetails?.name}
                        </h3>
                        <p className="text-gray-500 text-xs mb-3">
                          Duration: {trip.tripDetails?.duration || 0} Days
                        </p>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {trip.tripDetails?.description}
                        </p>
                      </div>
                      
                      {/* Edit / Delete Buttons */}
                      <div className="flex space-x-2 border-t border-gray-100 pt-3">
                        <button
                          onClick={() => handleEdit(trip)}
                          className="flex-1 flex items-center justify-center py-2 border border-blue-600 text-blue-600 rounded text-sm font-semibold hover:bg-blue-50 transition"
                        >
                          <FiEdit2 className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(trip.id)}
                          className="flex-1 flex items-center justify-center py-2 border border-red-600 text-red-600 rounded text-sm font-semibold hover:bg-red-50 transition"
                        >
                          <FiTrash2 className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripManagement;
