import { useState, useEffect} from "react";
import ComboBox from "../../components/ComboBox";
import Header from "../../components/Header";
import WorldMap from "../../components/WorldMap";
import Button from "../../components/Button";
import { BsStars } from "react-icons/bs";
import { TbLoader3 } from "react-icons/tb";
import Chip from "../../components/Chip";
import { toast } from "react-hot-toast";
import { generateTrip } from "../../services/trip";
import { useNavigate } from "react-router-dom";
import { budgetOptions, groupTypes, interests, travelStyles } from "../../constants";

export interface Country {
  cca2: string;
  name: {
    common: string;
  };
  flags?: {
    png: string;
    svg: string;
  };
}

export interface TripFormData {
  country: string;
  travelStyle: string;
  interests: string;
  budget: string;
  duration: number;
  groupType: string;
}

const fallbackCountries: Country[] = [
  { name: { common: "Sri Lanka" }, cca2: "LK", flags: { png: "https://flagcdn.com/w320/lk.png" } },
  { name: { common: "United States" }, cca2: "US", flags: { png: "https://flagcdn.com/w320/us.png" } },
  { name: { common: "United Kingdom" }, cca2: "GB", flags: { png: "https://flagcdn.com/w320/gb.png" } },
  { name: { common: "Australia" }, cca2: "AU", flags: { png: "https://flagcdn.com/w320/au.png" } },
  { name: { common: "Japan" }, cca2: "JP", flags: { png: "https://flagcdn.com/w320/jp.png" } },
  { name: { common: "France" }, cca2: "FR", flags: { png: "https://flagcdn.com/w320/fr.png" } },
  { name: { common: "Italy" }, cca2: "IT", flags: { png: "https://flagcdn.com/w320/it.png" } },
  { name: { common: "Germany" }, cca2: "DE", flags: { png: "https://flagcdn.com/w320/de.png" } },
  { name: { common: "Canada" }, cca2: "CA", flags: { png: "https://flagcdn.com/w320/ca.png" } },
  { name: { common: "Singapore" }, cca2: "SG", flags: { png: "https://flagcdn.com/w320/sg.png" } },
  { name: { common: "Switzerland" }, cca2: "CH", flags: { png: "https://flagcdn.com/w320/ch.png" } },
  { name: { common: "Maldives" }, cca2: "MV", flags: { png: "https://flagcdn.com/w320/mv.png" } },
  { name: { common: "Thailand" }, cca2: "TH", flags: { png: "https://flagcdn.com/w320/th.png" } },
  { name: { common: "India" }, cca2: "IN", flags: { png: "https://flagcdn.com/w320/in.png" } },
  { name: { common: "New Zealand" }, cca2: "NZ", flags: { png: "https://flagcdn.com/w320/nz.png" } },
  { name: { common: "United Arab Emirates" }, cca2: "AE", flags: { png: "https://flagcdn.com/w320/ae.png" } },
  { name: { common: "Spain" }, cca2: "ES", flags: { png: "https://flagcdn.com/w320/es.png" } },
  { name: { common: "Netherlands" }, cca2: "NL", flags: { png: "https://flagcdn.com/w320/nl.png" } },
  { name: { common: "Malaysia" }, cca2: "MY", flags: { png: "https://flagcdn.com/w320/my.png" } },
  { name: { common: "Indonesia" }, cca2: "ID", flags: { png: "https://flagcdn.com/w320/id.png" } },
  { name: { common: "South Korea" }, cca2: "KR", flags: { png: "https://flagcdn.com/w320/kr.png" } },
  { name: { common: "China" }, cca2: "CN", flags: { png: "https://flagcdn.com/w320/cn.png" } },
  { name: { common: "Brazil" }, cca2: "BR", flags: { png: "https://flagcdn.com/w320/br.png" } },
  { name: { common: "Mexico" }, cca2: "MX", flags: { png: "https://flagcdn.com/w320/mx.png" } },
  { name: { common: "South Africa" }, cca2: "ZA", flags: { png: "https://flagcdn.com/w320/za.png" } },
  { name: { common: "Egypt" }, cca2: "EG", flags: { png: "https://flagcdn.com/w320/eg.png" } },
  { name: { common: "Turkey" }, cca2: "TR", flags: { png: "https://flagcdn.com/w320/tr.png" } },
  { name: { common: "Greece" }, cca2: "GR", flags: { png: "https://flagcdn.com/w320/gr.png" } },
  { name: { common: "Austria" }, cca2: "AT", flags: { png: "https://flagcdn.com/w320/at.png" } },
  { name: { common: "Vietnam" }, cca2: "VN", flags: { png: "https://flagcdn.com/w320/vn.png" } }
];

export const getCountries = async (): Promise<Country[]> => {
  // Step 1: Try primary restcountries API
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,flags"
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common)
        );
      }
    }
  } catch (error) {
    console.warn("Primary restcountries API failed, trying secondary raw GitHub CDN...", error);
  }

  // Step 2: Try backup GitHub CDN
  try {
    const backupResponse = await fetch(
      "https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json"
    );
    if (backupResponse.ok) {
      const backupData = await backupResponse.json();
      if (Array.isArray(backupData) && backupData.length > 0) {
        // Map fields to match restcountries schema
        const mappedData: Country[] = backupData.map((item: any) => ({
          cca2: item.cca2 || item.cca3?.slice(0, 2) || "",
          name: {
            common: item.name?.common || item.name || ""
          },
          flags: {
            png: item.flags?.png || `https://flagcdn.com/w320/${(item.cca2 || "").toLowerCase()}.png`,
            svg: item.flags?.svg || `https://flagcdn.com/w320/${(item.cca2 || "").toLowerCase()}.png`
          }
        }));
        return mappedData.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common)
        );
      }
    }
  } catch (backupError) {
    console.warn("Secondary raw GitHub CDN failed, using built-in fallback destinations...", backupError);
  }

  // Step 3: Fall back to static predefined popular list
  return fallbackCountries.sort((a: Country, b: Country) =>
    a.name.common.localeCompare(b.name.common)
  );
};

export const CreateTrip = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [formData, setFormData] = useState<TripFormData>({
    country: "",
    travelStyle: "",
    interests: "",
    budget: "",
    duration: 0,
    groupType: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCountries = async () => {
      const data = await getCountries();
      setCountries(data);
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !formData.country ||
      !formData.duration ||
      !formData.groupType ||
      !formData.travelStyle ||
      !formData.interests ||
      !formData.budget
    ) {
      setError("Please fill all required fields.");
      setLoading(false);
      toast.error("Please fill all required fields.");
      return;
    }

    if (formData.duration < 1 || formData.duration > 10) {
      setError("Duration must be between 1 and 10 days");
      setLoading(false);
      toast.error("Duration must be between 1 and 10 days");
      return;
    }

    try {
      console.log("Form submitted:", formData);
      setLoading(true);
      const tripData = await generateTrip(
        formData.country,
        formData.travelStyle,
        formData.interests,
        formData.budget,
        formData.duration,
        formData.groupType
      );

      if(!tripData){
        setError("No trip data received from server");
      }

      console.log("Generated Trip Data:", tripData);
      setLoading(false);

      //navigate to edit page with tripData
      const id = tripData.data?.id || tripData.data?.tripId;
      if (tripData.data && id) {
        navigate(`/admin/trip/${id}`);
      } else {
        setError("Invalid trip data received from server");
      }

    } catch (error) {
      console.error("Error generating trip:", error);
      setLoading(false);
    }
  };

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const countryOptions = countries.map((country) => ({
    value: country.name.common,
    label: country.name.common,
    icon: country.flags?.png || country.flags?.svg,
  }));

  return (
    <main className="flex flex-col gap-10 pb-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
      <Header
        title="Add a New Trip"
        description="View and edit AI Generated travel plans"
      />
      <section className="mt-2.5 w-full max-w-3xl px-4 lg:px-8 mx-auto">
        <form
          className="flex flex-col gap-6 py-6 bg-white rounded-xl shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="country"
            >
              Country
            </label>
            <ComboBox
              options={countryOptions}
              value={formData.country}
              onChange={(value) => handleChange("country", value)}
              placeholder="Select a country..."
            />
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400 "
              htmlFor="duration"
            >
              Duration
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              placeholder="Enter a number of days..."
              value={formData.duration || ""}
              className="w-full pl-4 pr-10 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="groupType"
            >
              Group Type
            </label>
            <ComboBox
              options={groupTypes}
              value={formData.groupType}
              onChange={(value) => handleChange("groupType", value)}
              placeholder="Select group type..."
            />
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="travelStyle"
            >
              Travel Style
            </label>
            <ComboBox
              options={travelStyles}
              value={formData.travelStyle}
              onChange={(value) => handleChange("travelStyle", value)}
              placeholder="Select a travel style..."
            />
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="interest"
            >
              Interests
            </label>
            <ComboBox
              options={interests}
              value={formData.interests}
              onChange={(value) => handleChange("interests", value)}
              placeholder="Select your interests..."
            />
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="travelStyle"
            >
              Budget Estimate
            </label>
            <ComboBox
              options={budgetOptions}
              value={formData.budget}
              onChange={(value) => handleChange("budget", value)}
              placeholder="Select your budget preference"
            />
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="worldMap"
            >
              Location on the world map
            </label>
            <div className="w-full h-[300px] md:h-[400px] border-2 rounded-lg duration-200 bg-white border-gray-200 overflow-hidden">
              <WorldMap
                selectedCountry={formData.country}
                onCountryClick={(countryName) =>
                  handleChange("country", countryName)
                }
              />
            </div>
          </div>

          <div className="bg-gray-200 h-px w-full" />

          {error && (
            <div className="px-6">
              <Chip
                variant="danger"
                label={error}
                className="rounded-md w-full justify-center py-2"
              />
            </div>
          )}

          <footer className="w-full px-6">
            <Button
              type="submit"
              ctaText={loading ? "Generating Trip..." : "Generate Trip"}
              icon={
                loading ? <TbLoader3 className="animate-spin" /> : <BsStars />
              }
              variant="primary"
              fullWidth={true}
              disabled={loading}
            />
          </footer>
        </form>
      </section>
    </main>
  );
};
