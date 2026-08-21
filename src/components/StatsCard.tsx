import { FaArrowUp, FaArrowDown, FaArrowRightLong } from "react-icons/fa6";
import { calculateTrendPercentage, cn } from "../lib/utils";
import TrendChart from "./TrendChart";
import { motion } from "framer-motion";
import { fadeInUpVariants, scrollRevealViewport } from "../lib/animations";

export interface StatsCardProps {
  headerTitle: string;
  total: number;
  lastMonthCount: number;
  currentMonthCount: number;
  chartData?: number[];
}

const StatsCard = ({
  headerTitle,
  total,
  lastMonthCount,
  currentMonthCount,
  chartData,
}: StatsCardProps) => {
  const { trend, percentage } = calculateTrendPercentage(
    currentMonthCount,
    lastMonthCount
  );

  const isDecrement = trend === "decrement";
  const isIncrement = trend === "increment";
  const mappedTrend = trend === "no change" ? "neutral" : trend;

  return (
    <motion.article 
      className="p-6 flex flex-col gap-5 bg-white shadow-sm border border-gray-100 rounded-[20px] text-black"
      initial="hidden"
      whileInView="visible"
      viewport={scrollRevealViewport}
      variants={fadeInUpVariants}
    >
      <h3 className="text-base font-medium text-gray-600">{headerTitle}</h3>

      <div className="flex flex-row md:flex-col-reverse xl:flex-row xl:items-center gap-3 justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-bold">{total.toLocaleString()}</h2>
          <div className="flex items-center gap-2">
            <figure className="flex items-center gap-1">
              {/* Conditional Icon Rendering */}
              {isDecrement ? (
                <FaArrowDown className="text-red-500 size-4" />
              ) : isIncrement ? (
                <FaArrowUp className="text-green-500 size-4" />
              ) : (
                <FaArrowRightLong className="text-gray-400 size-4" />
              )}
              
              <figcaption
                className={cn(
                  "text-sm font-semibold",
                  isDecrement ? "text-red-500" : isIncrement ? "text-green-500" : "text-gray-500"
                )}
              >
                {Math.round(percentage)}%
              </figcaption>
            </figure>
            <p className="text-sm font-medium text-gray-400 truncate">
              vs last month
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <TrendChart trend={mappedTrend} data={chartData} />
        </div>
      </div>
    </motion.article>
  );
};

export default StatsCard;