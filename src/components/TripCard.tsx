import { Link, useLocation } from "react-router-dom";
import Chip from "./Chip";
import { IoLocationOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { cardHoverVariants, fadeInUpVariants, scrollRevealViewport } from "../lib/animations";


export interface TripCardProps {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  tags: string[];
  price: string | number;
}

const TripCard = ({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
}: TripCardProps) => {
  const path = useLocation();

  const isAdmin = path.pathname.startsWith("/admin");

  const tripLink = id ? (isAdmin ? `/admin/trip/${id}` : `/trip/${id}`) : "#";

  const fallbackImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
  };

  const formattedPrice = typeof price === "number" 
    ? `$${price.toFixed(2)}` 
    : price 
      ? (price.toString().startsWith("$") ? price : `$${price}`) 
      : "$0.00";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={scrollRevealViewport}
      variants={fadeInUpVariants}
    >
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
      >
        <Link
          to={tripLink}
          className="bg-white rounded-2xl flex-col w-full relative shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out block"
        >
          <img
            src={imageUrl || fallbackImage}
            alt={name}
            onError={handleImageError}
            className="w-full h-40 rounded-t-xl object-cover aspect-video"
          />
          <article className="flex flex-col gap-3 mt-4 pl-[18px] pr-3.5">
            <h2 className="text-sm md:text-lg font-semibold line-clamp-2">
              {name}
            </h2>
            <figure className="flex items-center gap-2">
              <IoLocationOutline />
              <figcaption className="text-xs md:text-sm font-normal text-gray-600">
                {location}
              </figcaption>
            </figure>
          </article>
          <div className="mt-5 pl-[18px] pr-3.5 pb-5 flex gap-3">
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                variant={
                  index === 0
                    ? "success"
                    : index === 1
                    ? "pink"
                    : index === 2
                    ? "warning"
                    : "default"
                }
              />
            ))}
          </div>
          <article className="bg-white py-1 px-2.5 w-fit rounded-2xl absolute top-2.5 right-4 text-dark-100 text-sm font-semibold">
            {formattedPrice}
          </article>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default TripCard;
