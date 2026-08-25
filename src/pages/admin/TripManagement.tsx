import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { getAllTrips, createTripDirect, updateTripDirect, deleteTrip } from "../../services/trip";
import { FiEdit2, FiTrash2, FiRefreshCw, FiUploadCloud, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const TripManagement = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await getAllTrips(1, 100);
      const items = response.data?.items || response.data?.trips || [];
      setTrips(items);

      // Check query parameter after trips are loaded
      const queryParams = new URLSearchParams(window.location.search);
      const editParamId = queryParams.get("edit");
      if (editParamId) {
        const tripToEdit = items.find((t: any) => t.id === editParamId);
        if (tripToEdit) {
          setEditId(tripToEdit.id);
          setName(tripToEdit.tripDetails?.name || "");
          setCountry(tripToEdit.tripDetails?.country || "");
          setDuration(tripToEdit.tripDetails?.duration ? `${tripToEdit.tripDetails.duration}` : "");
          setPrice(tripToEdit.tripDetails?.estimatedPrice || "");
          setDescription(tripToEdit.tripDetails?.description || "");
          setUploadedImages(tripToEdit.imageUrls || []);
          setIsFormOpen(true);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("create") === "true") {
      handleReset();
      setIsFormOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleReset = () => {
    setEditId(null);
    setName("");
    setCountry("");
    setDuration("");
    setPrice("");
    setDescription("");
    setUploadedImages([]);
  };

  const handleEdit = (trip: any) => {
    setEditId(trip.id);
    setName(trip.tripDetails?.name || "");
    setCountry(trip.tripDetails?.country || "");
    setDuration(trip.tripDetails?.duration ? `${trip.tripDetails.duration}` : "");
    setPrice(trip.tripDetails?.estimatedPrice || "");
    setDescription(trip.tripDetails?.description || "");
    setUploadedImages(trip.imageUrls || []);
    setIsFormOpen(true);
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

  // Drag & Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const currentCount = uploadedImages.length;
    const filesArray = Array.from(files);

    if (currentCount + filesArray.length > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }

    filesArray.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file.`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !country || !duration || !price || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const parsedDuration = parseInt(duration) || 3;
    const imageUrlsList = [...uploadedImages];

    if (imageUrlsList.length === 0) {
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

    setSubmitting(true);
    try {
      if (editId) {
        await updateTripDirect(editId, payload);
        toast.success("Trip updated successfully!");
      } else {
        await createTripDirect(payload);
        toast.success("Trip created successfully!");
      }
      handleReset();
      setIsFormOpen(false);
      fetchTrips();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save trip");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Header
            title="Trips"
            description="Manage all trips here"
            ctaText="Create a Trip"
            icon={<span className="text-lg font-bold mr-1">+</span>}
            ctaOnClick={() => {
              handleReset();
              setIsFormOpen(true);
            }}
          />
        </div>

        {/* Main Content: Existing Trip Plans Grid */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Existing Trip Plans</h2>
            <button
              onClick={fetchTrips}
              className="flex items-center text-sm font-semibold text-gray-900 hover:text-gray-700 hover:underline transition"
            >
              <FiRefreshCw className="mr-1.5" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-500">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <span>Loading trips...</span>
            </div>
          ) : trips.length === 0 ? (
            <div className="py-20 text-center text-gray-500 border border-dashed border-gray-200 rounded-xl bg-gray-50">
              <p className="text-base font-medium">No trips found.</p>
              <p className="text-xs text-gray-400 mt-1">Click the "+ Create a Trip" button above to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip: any) => {
                const firstImage = trip.imageUrls?.[0] || "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80";
                return (
                  <div
                    key={trip.id}
                    className="group rounded-2xl overflow-hidden flex flex-col bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                  >
                    {/* Link wrapper for the clickable top area */}
                    <Link to={`/admin/trip/${trip.id}`} className="flex-1 flex flex-col">
                      {/* Cover Image & Price Badge */}
                      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                        <img
                          src={firstImage}
                          alt={trip.tripDetails?.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e: any) => {
                            e.target.src = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
                          USD {trip.tripDetails?.estimatedPrice || "0"} per person
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                              {trip.tripDetails?.country || "Global"}
                            </span>
                            <span className="text-gray-300 text-xs">•</span>
                            <span className="text-gray-500 text-xs font-medium">
                              {trip.tripDetails?.duration || 0} Days
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
                            {trip.tripDetails?.name}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-5 leading-relaxed">
                            {trip.tripDetails?.description}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* Card Actions (Placed outside the Link, stops propagation to prevent navigation) */}
                    <div className="px-5 pb-5 flex space-x-2 border-t border-gray-100 pt-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEdit(trip);
                        }}
                        className="flex-1 flex items-center justify-center py-2.5 border border-blue-600 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 transition duration-200"
                      >
                        <FiEdit2 className="mr-1.5" /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(trip.id);
                        }}
                        className="flex-1 flex items-center justify-center py-2.5 border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 hover:border-red-600 transition duration-200"
                      >
                        <FiTrash2 className="mr-1.5" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col relative transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editId ? "Update Trip Itinerary" : "Create New Trip Itinerary"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  handleReset();
                }}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Trip Name / Title *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., 7-Day Romantic Paris Getaway"
                    className="mt-1.5 block w-full border border-gray-200 rounded-lg bg-white px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition shadow-sm text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Destination / Country *</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g., France"
                    className="mt-1.5 block w-full border border-gray-200 rounded-lg bg-white px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition shadow-sm text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Duration (Days, number only) *</label>
                  <input
                    type="number"
                    value={duration.replace(/\D/g, "")}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 7"
                    className="mt-1.5 block w-full border border-gray-200 rounded-lg bg-white px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition shadow-sm text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Price (USD) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 1500"
                    className="mt-1.5 block w-full border border-gray-200 rounded-lg bg-white px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition shadow-sm text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the highlights and plans for this trip..."
                  className="mt-1.5 block w-full border border-gray-200 rounded-lg bg-white px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition shadow-sm text-sm"
                  required
                />
              </div>

              {/* Drag & Drop Image upload zone */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <label className="block text-sm font-semibold text-gray-700">Trip Images (Up to 3 images) *</label>

                {uploadedImages.length < 3 && (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition duration-200 ${
                      isDragActive
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <FiUploadCloud className={`w-10 h-10 mb-2.5 ${isDragActive ? "text-blue-500" : "text-gray-400"}`} />
                    <p className="text-sm font-medium text-gray-700">
                      Drag & drop images here or <span className="text-blue-600 hover:underline">click to browse</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP (Max 3 files, up to 5MB each)</p>
                  </div>
                )}

                {/* Thumbnail Previews */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-100 h-24 bg-gray-50">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e: any) => {
                            e.target.src = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedImages((prev) => prev.filter((_, i) => i !== index));
                          }}
                          className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition"
                        >
                          <FiX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer Actions (Aligned to bottom right) */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    handleReset();
                  }}
                  className="px-4.5 py-2 border border-gray-200 text-gray-700 bg-white rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4.5 py-2 border border-gray-200 text-gray-600 bg-white rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center shadow-md shadow-blue-500/10"
                >
                  {submitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  {editId ? "Update Trip" : "Save Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripManagement;
