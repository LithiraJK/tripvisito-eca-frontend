import Header from "../../components/Header";
import Button from "../../components/Button";
import ComboBox from "../../components/ComboBox";
import { useState, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { MdAdd, MdDelete } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import { deleteTrip, getTripDetails, updateTrip } from "../../services/trip";
import toast from "react-hot-toast";

interface Activity {
  time: "Morning" | "Afternoon" | "Evening";
  description: string;
}

interface DayItinerary {
  day: number;
  location: string;
  activities: Activity[];
}

const UpdateTrip = () => {
  
  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this trip? This action cannot be undone."
      )
    ) {
      try {
        toast.loading("Deleting trip...");
        await deleteTrip(tripId!);
        toast.dismiss();
        toast.success("Trip deleted successfully!");
        navigate("/admin/trips");
      } catch (error: any) {
        toast.dismiss();
        console.error("Error deleting trip:", error);
        toast.error(error.response?.data?.message || "Failed to delete trip");
      }
    }
  };

  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    estimatedPrice: "",
    duration: 5,
    budget: "",
    travelStyle: "",
    country: "",
    interests: "",
    groupType: "",
  });

  const [itinerary, setItinerary] = useState<DayItinerary[]>([
    {
      day: 1,
      location: "",
      activities: [
        { time: "Morning", description: "" },
        { time: "Afternoon", description: "" },
        { time: "Evening", description: "" },
      ],
    },
  ]);

  const [bestTimeToVisit, setBestTimeToVisit] = useState<string[]>([""]);
  const [weatherInfo, setWeatherInfo] = useState<string[]>([""]);

  const [images, setImages] = useState<(string | null)[]>([null, null, null]);

  useEffect(() => {
    const fetchTripData = async () => {
      if (!tripId) {
        toast.error("Trip ID is missing");
        navigate("/admin/trips");
        return;
      }

      try {
        setLoading(true);
        const response = await getTripDetails(tripId);
        const trip = response.data?.trip || response.data;

        console.log(trip);

        const tripDetails =
          typeof trip?.tripDetails === "string"
            ? JSON.parse(trip.tripDetails)
            : trip?.tripDetails;

        // Helper function to capitalize first letter of each word
        const capitalizeWords = (str: string) => {
          if (!str || typeof str !== "string") return "";
          return str
            .split("-")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join("-");
        };

        setFormData({
          name: tripDetails.name || "",
          description: tripDetails.description || "",
          estimatedPrice: tripDetails.estimatedPrice || "",
          duration: tripDetails.duration || 5,
          budget: capitalizeWords(tripDetails.budget || ""),
          travelStyle: capitalizeWords(tripDetails.travelStyle || ""),
          country: tripDetails.country || "",
          interests: capitalizeWords(tripDetails.interests || ""),
          groupType: capitalizeWords(tripDetails.groupType || ""),
        });

        if (tripDetails.itinerary && tripDetails.itinerary.length > 0) {
          setItinerary(tripDetails.itinerary);
        }

        if (
          tripDetails.bestTimeToVisit &&
          tripDetails.bestTimeToVisit.length > 0
        ) {
          setBestTimeToVisit(tripDetails.bestTimeToVisit);
        }

        if (tripDetails.weatherInfo && tripDetails.weatherInfo.length > 0) {
          setWeatherInfo(tripDetails.weatherInfo);
        }

        // Set existing images
        if (trip.imageUrls && trip.imageUrls.length > 0) {
          const existingImages = [...images];
          trip.imageUrls.forEach((url: string, index: number) => {
            if (index < 3) {
              existingImages[index] = url;
            }
          });
          setImages(existingImages);
        }

        toast.success("Trip data loaded successfully");
      } catch (error: any) {
        console.error("Error fetching trip:", error);
        toast.error(
          error.response?.data?.message || "Failed to load trip data"
        );
        navigate("/admin/trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, navigate]);

  const handleChange = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleItineraryChange = (
    dayIndex: number,
    value: string
  ) => {
    setItinerary((prev) => {
      const updated = [...prev];
      updated[dayIndex].location = value;
      return updated;
    });
  };

  const handleActivityChange = (
    dayIndex: number,
    activityIndex: number,
    value: string
  ) => {
    setItinerary((prev) => {
      const updated = [...prev];
      updated[dayIndex].activities[activityIndex].description = value;
      return updated;
    });
  };

  const addDay = () => {
    setItinerary((prev) => [
      ...prev,
      {
        day: prev.length + 1,
        location: "",
        activities: [
          { time: "Morning", description: "" },
          { time: "Afternoon", description: "" },
          { time: "Evening", description: "" },
        ],
      },
    ]);
  };

  const removeDay = (dayIndex: number) => {
    setItinerary((prev) =>
      prev
        .filter((_, index) => index !== dayIndex)
        .map((day, index) => ({
          ...day,
          day: index + 1,
        }))
    );
  };

  const handleBestTimeChange = (index: number, value: string) => {
    setBestTimeToVisit((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addBestTime = () => {
    setBestTimeToVisit((prev) => [...prev, ""]);
  };

  const removeBestTime = (index: number) => {
    setBestTimeToVisit((prev) => prev.filter((_, i) => i !== index));
  };

  const handleWeatherChange = (index: number, value: string) => {
    setWeatherInfo((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addWeather = () => {
    setWeatherInfo((prev) => [...prev, ""]);
  };

  const removeWeather = (index: number) => {
    setWeatherInfo((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (index: number, file: File | null) => {
    if (!file) return;

    // Store the actual file for upload
    setImageFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = file;
      return newFiles;
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImages((prev) => {
        const newImages = [...prev];
        newImages[index] = reader.result as string;
        return newImages;
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
    setImageFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = null;
      return newFiles;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least 3 images are present
    const validImages = images.filter((img) => img !== null);
    if (validImages.length < 3) {
      toast.error("Please upload at least 3 images");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Create trip details object
      const tripDetails = {
        name: formData.name,
        description: formData.description,
        estimatedPrice: formData.estimatedPrice,
        duration: formData.duration,
        budget: formData.budget,
        travelStyle: formData.travelStyle,
        country: formData.country,
        interests: formData.interests,
        groupType: formData.groupType,
        itinerary: itinerary,
        bestTimeToVisit: bestTimeToVisit.filter((item) => item.trim() !== ""),
        weatherInfo: weatherInfo.filter((item) => item.trim() !== ""),
      };

      // Append trip details as JSON string
      formDataToSend.append("tripDetails", JSON.stringify(tripDetails));

      imageFiles.forEach((file) => {
        if (file) {
          formDataToSend.append("imageURLs", file);
        }
      });

      const existingImages = images
        .map((img, index) => (imageFiles[index] ? null : img))
        .filter((img) => img !== null && typeof img === "string");

      if (existingImages.length > 0) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      }

      toast.loading("Updating trip...");

      await updateTrip(tripId!, formDataToSend);

      toast.dismiss();
      toast.success("Trip updated successfully!");
      navigate("/admin/trips");
    } catch (error: any) {
      toast.dismiss();
      console.error("Error updating trip:", error);
      toast.error(error.response?.data?.message || "Failed to update trip");
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col gap-10 pb-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
        <Header
          title="Loading Trip Details..."
          description="Please wait while we fetch the trip information"
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-10 pb-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
      <Header
        title="Edit Trip Details"
        description="Modify existing trip information here"
      />
      <section className="mt-2.5 w-full px-4 lg:px-8 mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-xl p-8"
        >
          <div className="grid grid-cols-1 gap-10">
            {/* Basic Trip Information */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Basic Trip Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trip Name */}
                <div className="flex flex-col gap-2.5">
                  <label
                    className="text-sm font-normal text-gray-400"
                    htmlFor="name"
                  >
                    Trip Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter trip name..."
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none"
                  />
                </div>

                {/* Country */}
                <div className="flex flex-col gap-2.5">
                  <label
                    className="text-sm font-normal text-gray-400"
                    htmlFor="country"
                  >
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    placeholder="Enter country..."
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2.5">
                <label
                  className="text-sm font-normal text-gray-400"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter trip description..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none resize-none"
                />
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2.5">
                  <label
                    className="text-sm font-normal text-gray-400"
                    htmlFor="estimatedPrice"
                  >
                    Estimated Price
                  </label>
                  <input
                    id="estimatedPrice"
                    type="text"
                    placeholder="$1000"
                    value={formData.estimatedPrice}
                    onChange={(e) =>
                      handleChange("estimatedPrice", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <label
                    className="text-sm font-normal text-gray-400"
                    htmlFor="duration"
                  >
                    Duration (days)
                  </label>
                  <input
                    id="duration"
                    type="number"
                    placeholder="5"
                    value={formData.duration || ""}
                    onChange={(e) =>
                      handleChange("duration", Number(e.target.value))
                    }
                    className="w-full px-4 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <label
                    className="text-sm font-normal text-gray-400"
                    htmlFor="budget"
                  >
                    Budget
                  </label>
                  <ComboBox
                    options={[
                      { value: "Budget", label: "Budget" },
                      { value: "Mid-Range", label: "Mid-Range" },
                      { value: "Luxury", label: "Luxury" },
                    ]}
                    value={formData.budget}
                    onChange={(value) => handleChange("budget", value)}
                    placeholder="Select budget..."
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <label
                    className="text-sm font-normal text-gray-400"
                    htmlFor="groupType"
                  >
                    Group Type
                  </label>
                  <ComboBox
                    options={[
                      { value: "Solo", label: "Solo" },
                      { value: "Couple", label: "Couple" },
                      { value: "Family", label: "Family" },
                      { value: "Friends", label: "Friends" },
                    ]}
                    value={formData.groupType}
                    onChange={(value) => handleChange("groupType", value)}
                    placeholder="Select group..."
                  />
                </div>
              </div>

              {/* Travel Style & Interests */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2.5">
                  <label
                    className="text-sm font-normal text-gray-400"
                    htmlFor="travelStyle"
                  >
                    Travel Style
                  </label>
                  <ComboBox
                    options={[
                      { value: "Adventure", label: "Adventure" },
                      { value: "Relaxation", label: "Relaxation" },
                      { value: "Cultural", label: "Cultural" },
                      { value: "Romantic", label: "Romantic" },
                    ]}
                    value={formData.travelStyle}
                    onChange={(value) => handleChange("travelStyle", value)}
                    placeholder="Select style..."
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <label
                    className="text-sm font-normal text-gray-400"
                    htmlFor="interests"
                  >
                    Interests
                  </label>
                  <ComboBox
                    options={[
                      { value: "Nature", label: "Nature" },
                      { value: "History", label: "History" },
                      { value: "Food", label: "Food" },
                      { value: "Art", label: "Art" },
                    ]}
                    value={formData.interests}
                    onChange={(value) => handleChange("interests", value)}
                    placeholder="Select interests..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-200 h-px w-full" />

            {/* Day-by-Day Itinerary */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Day-by-Day Itinerary
                </h2>
                <button
                  type="button"
                  onClick={addDay}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MdAdd className="w-5 h-5" />
                  Add Day
                </button>
              </div>

              {itinerary.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="border-2 border-gray-200 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Day {day.day}
                    </h3>
                    {itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDay(dayIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MdDelete className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2.5">
                      <label className="text-sm font-normal text-gray-400">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="Enter location..."
                        value={day.location}
                        onChange={(e) =>
                          handleItineraryChange(
                            dayIndex,
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none"
                      />
                    </div>

                    {day.activities.map((activity, activityIndex) => (
                      <div
                        key={activityIndex}
                        className="flex flex-col gap-2.5"
                      >
                        <label className="text-sm font-semibold text-gray-600">
                          {activity.time}
                        </label>
                        <textarea
                          placeholder={`Enter ${activity.time.toLowerCase()} activity...`}
                          value={activity.description}
                          onChange={(e) =>
                            handleActivityChange(
                              dayIndex,
                              activityIndex,
                              e.target.value
                            )
                          }
                          rows={3}
                          className="w-full px-4 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-200 h-px w-full" />

            {/* Best Time to Visit */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Best Time to Visit
                </h2>
                <button
                  type="button"
                  onClick={addBestTime}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <MdAdd className="w-5 h-5" />
                  Add Item
                </button>
              </div>

              {bestTimeToVisit.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="☀️ December to March: Best time for..."
                    value={item}
                    onChange={(e) =>
                      handleBestTimeChange(index, e.target.value)
                    }
                    className="flex-1 px-4 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none"
                  />
                  {bestTimeToVisit.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBestTime(index)}
                      className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gray-200 h-px w-full" />

            {/* Weather Information */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Weather Information
                </h2>
                <button
                  type="button"
                  onClick={addWeather}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <MdAdd className="w-5 h-5" />
                  Add Item
                </button>
              </div>

              {weatherInfo.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="☀️ Dry Season: 27-31°C (81-88°F)"
                    value={item}
                    onChange={(e) => handleWeatherChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none"
                  />
                  {weatherInfo.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWeather(index)}
                      className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gray-200 h-px w-full" />

            {/* Trip Images */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Trip Images
              </h2>

              {/* Large Image Upload Box */}
              <div className="relative group">
                <input
                  id="imageUpload0"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleImageUpload(0, e.target.files[0])
                  }
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload0"
                  className={`relative flex flex-col items-center justify-center cursor-pointer border-2 border-dashed rounded-lg transition-all duration-200 overflow-hidden ${
                    images[0]
                      ? "border-gray-300"
                      : "border-gray-300 bg-gray-50 hover:border-blue-400"
                  }`}
                  style={{ height: "280px" }}
                >
                  {images[0] ? (
                    <>
                      <img
                        src={images[0]}
                        alt="Preview 1"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeImage(0);
                        }}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <FiUpload className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="text-gray-600 font-medium mb-1">
                        Drop your image here
                      </p>
                      <p className="text-gray-400 text-sm mb-1">or</p>
                      <span className="text-blue-500 font-medium hover:text-blue-600">
                        Select Click to browse
                      </span>
                    </>
                  )}
                </label>
              </div>

              {/* Small Image Upload Boxes */}
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((index) => (
                  <div key={index} className="relative group">
                    <input
                      id={`imageUpload${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files &&
                        handleImageUpload(index, e.target.files[0])
                      }
                      className="hidden"
                    />
                    <label
                      htmlFor={`imageUpload${index}`}
                      className={`relative flex flex-col items-center justify-center cursor-pointer border-2 border-dashed rounded-lg transition-all duration-200 overflow-hidden ${
                        images[index]
                          ? "border-gray-300"
                          : "border-gray-300 bg-gray-50 hover:border-blue-400"
                      }`}
                      style={{ height: "140px" }}
                    >
                      {images[index] ? (
                        <>
                          <img
                            src={images[index]}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeImage(index);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-blue-500 text-sm font-medium hover:text-blue-600">
                            Click to browse
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500">
                You need to add at least 3 images
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-4">
                <Button
                  type="submit"
                  ctaText="Save Trip"
                  variant="primary"
                  fullWidth={true}
                />
                <Button
                  type="button"
                  ctaText="Delete"
                  icon={<MdDelete />}
                  variant="danger"
                  fullWidth={false}
                  className="px-8"
                  onClick={() => {
                    handleDelete();
                  }}
                />
              </div>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default UpdateTrip;
