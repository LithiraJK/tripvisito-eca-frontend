import { IoMdHome } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { FaRegMap } from "react-icons/fa";
import { MdCreditCard, MdRateReview } from "react-icons/md";

export const sidebarItems = [
  {
    id: 1,
    icon: IoMdHome,
    label: "Dashboard",
    href: "admin/dashboard",
  },
  {
    id: 2,
    icon: FaUsers,
    label: "All Users",
    href: "admin/all-users",
  },
  {
    id: 3,
    icon: FaRegMap,
    label: "AI Trips",
    href: "admin/trips",
  },
  {
    id: 4,
    icon: MdCreditCard,
    label: "Payments",
    href: "admin/payments",
  },
  {
    id: 5,
    icon: MdRateReview,
    label: "Reviews",
    href: "admin/reviews",
  },
];

export const chartOneData: object[] = [
  {
    x: "Jan",
    y1: 0.5,
    y2: 1.5,
    y3: 0.7,
  },
  {
    x: "Feb",
    y1: 0.8,
    y2: 1.2,
    y3: 0.9,
  },
  {
    x: "Mar",
    y1: 1.2,
    y2: 1.8,
    y3: 1.5,
  },
  {
    x: "Apr",
    y1: 1.5,
    y2: 2.0,
    y3: 1.8,
  },
  {
    x: "May",
    y1: 1.8,
    y2: 2.5,
    y3: 2.0,
  },
  {
    x: "Jun",
    y1: 2.0,
    y2: 2.8,
    y3: 2.5,
  },
];

export const travelStyles = [
  {
    value: "relaxed",
    label: "Relaxed",
  },
  {
    value: "luxury",
    label: "Luxury",
  },
  {
    value: "adventure",
    label: "Adventure",
  },

  {
    value: "cultural",
    label: "Cultural",
  },
  {
    value: "nature_outdoors",
    label: "Nature & Outdoors",
  },
  {
    value: "city_exploration",
    label: "City Exploration",
  },
];

export const interests = [
  {
    value: "nature",
    label: "Nature",
  },
  {
    value: "history",
    label: "History",
  },
  {
    value: "food",
    label: "Food",
  },
  {
    value: "art",
    label: "Art",
  },
  {
    value: "wildlife",
    label: "Wildlife",
  },
  {
    value: "adventure_sports",
    label: "Adventure Sports",
  },
  {
    value: "beaches",
    label: "Beaches",
  },
  {
    value: "mountains",
    label: "Mountains",
  },
];

export const budgetOptions = [
                { value: "budget", label: "Budget" },
                { value: "midrange", label: "Mid-range" },
                { value: "luxury", label: "Luxury" },
              ]

export const groupTypes = [
                { value: "family", label: "Family" },
                { value: "friends", label: "Friends" },
                { value: "solo", label: "Solo" },
                { value: "couple", label: "Couple" },
                { value: "business", label: "Business" }
              ];

export const footers = ["Terms & Condition", "Privacy Policy"];

// export const selectItems = [
//   "groupType",
//   "travelStyle",
//   "interest",
//   "budget",
// ] as (keyof TripFormData)[];

// export const comboBoxItems = {
//   groupType: groupTypes,
//   travelStyle: travelStyles,
//   interest: interests,
//   budget: budgetOptions,
// } as Record<keyof TripFormData, string[]>;

export const CONFETTI_SETTINGS = {
  particleCount: 200, // Number of confetti pieces
  spread: 60, // Spread of the confetti burst
  colors: ["#ff0", "#ff7f00", "#ff0044", "#4c94f4", "#f4f4f4"], // Confetti colors
  decay: 0.95, // Gravity decay of the confetti
};

export const LEFT_CONFETTI = {
  ...CONFETTI_SETTINGS,
  angle: 45, // Direction of the confetti burst (90 degrees is top)
  origin: { x: 0, y: 1 }, // Center of the screen
};

export const RIGHT_CONFETTI = {
  ...CONFETTI_SETTINGS,
  angle: 135,
  origin: { x: 1, y: 1 },
};

//////////////////////////////////////////////////////////////////////////////////
export const dashboardStats = {
  totalUsers: 1500,
  totalTrips: 300,
  usersJoined: { currentMonth: 218, lastMonth: 180 },
  tripsCreated: { total: 62, currentMonth: 150, lastMonth: 210 },
  userGrowth: { total: 60, currentMonth: 25, lastMonth: 20 },
};
