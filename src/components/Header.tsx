import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { slideInLeftVariants, slideInRightVariants, scrollRevealViewport } from "../lib/animations";

interface Props {
  title: string;
  description: string;
  ctaText?: string;
  ctaURL?: string;
  ctaOnClick?: () => void;
  icon?: React.ReactNode;
}
const Header = ({ title, description, ctaText , ctaURL, ctaOnClick, icon }: Props) => {

  {/* Track location for dynamic styling Header using useLocation hook */}
  const location = useLocation()

  return (
    <header className="flex flex-col justify-between md:flex-row ">
      <motion.article
        initial="hidden"
        whileInView="visible"
        viewport={scrollRevealViewport}
        variants={slideInLeftVariants}
      >
        <h1 className={ cn("text-gray-900 text-2xl font-bold mb-2", location.pathname === '/' ? 'text-2xl md:text-4xl font-bold' : 'text-xl md:text-2xl font-semibold' )}>{title}</h1>
        <p className={ cn("text-gray-600 mb-4" , location.pathname === '/' ? 'text-lg md:text-xl' : 'text-sm md:text-base' ) }>{description}</p>
      </motion.article> 

      {ctaText && icon && (ctaURL || ctaOnClick) && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={scrollRevealViewport}
          variants={slideInRightVariants}
        >
          {ctaURL ? (
            <Link to={ctaURL}>
              <button className="bg-blue-500 w-full md:w-60 text-white p-2 font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-none">{icon}{ctaText}</button>
            </Link>
          ) : (
            <button onClick={ctaOnClick} className="bg-blue-500 w-full md:w-60 text-white p-2 font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-none">{icon}{ctaText}</button>
          )}
        </motion.div>
      )}


    </header>
  );
};

export default Header;
