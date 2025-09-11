import { useEffect, useRef, useState } from "react";
import { MdAdsClick, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { motion } from "framer-motion";
import { Image } from "cloudinary-react";
import { Link } from "react-router-dom";


interface RowContainerProps {
  flag: boolean;
  data: any;
  scrollValue: any;
  viewMode?: "grid" | "list";
}

const RowContainer: React.FC<RowContainerProps> = ({
  flag,
  data,
  scrollValue,
  viewMode = "grid",
}) => {
  const rowContainer = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (rowContainer.current) {
      rowContainer.current.scrollLeft += scrollValue;
    }
  }, [scrollValue]);

  // Check scroll position to enable/disable arrows
  const checkScrollPosition = () => {
    if (rowContainer.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowContainer.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (rowContainer.current) {
      rowContainer.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (rowContainer.current) {
      rowContainer.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Check scroll position on mount and when data changes
  useEffect(() => {
    checkScrollPosition();
    const container = rowContainer.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [data]);
  return (
    <div className="relative w-full my-12">

      {flag && canScrollLeft && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:shadow-xl transition-all duration-200"
        >
          <MdChevronLeft className="text-2xl text-gray-600" />
        </motion.button>
      )}

  
      {flag && canScrollRight && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:shadow-xl transition-all duration-200"
        >
          <MdChevronRight className="text-2xl text-gray-600" />
        </motion.button>
      )}

      <div
        ref={rowContainer}
        className={`w-full scroll-smooth ${
          flag
            ? "flex items-center gap-3 overflow-x-scroll scrollbar-none"
            : viewMode === "grid"
            ? "flex items-center gap-6 overflow-x-hidden flex-wrap justify-center"
            : "flex flex-col gap-4"
        }`}
      >
      {data && data.length > 0 ? (
        data.map((item: any) => (
          <motion.div
            key={item?.ID}
            whileHover={{ scale: 1.02 }}
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              viewMode === "grid"
                ? "w-275 h-[280px] min-w-[275px] md:w-300 md:min-w-[300px] flex flex-col items-center justify-between p-4 relative"
                : "w-full flex flex-row items-center p-4 h-32"
            }`}
          >
         
            <div className={`${viewMode === "grid" ? "w-full flex justify-center" : "w-24 h-24 flex-shrink-0"}`}>
              <motion.div
                className={`${viewMode === "grid" ? "w-32 h-32" : "w-24 h-24"} rounded-lg overflow-hidden`}
                whileHover={{ scale: 1.05 }}
              >
                {item.imgUrl ? 
                  <Image
                    className={`${viewMode === "grid" ? "w-32 h-32" : "w-24 h-24"} object-cover`}
                    alt="Dish image"
                    cloudName="dgkyhspuf"
                    publicId={item.imgUrl}
                  /> :
                  <img 
                    className={`${viewMode === "grid" ? "w-32 h-32" : "w-24 h-24"} object-cover`} 
                    src={'/images/default-food-not-found.jpg'} 
                    alt="Dish not found" 
                  />
                }
              </motion.div>
            </div>

          
            <div className={`${viewMode === "grid" ? "w-full text-center" : "flex-1 ml-4"} flex flex-col justify-between`}>
              <div>
                <h3 className={`${viewMode === "grid" ? "text-lg" : "text-xl"} font-bold text-gray-800 mb-1`}>
                  {item?.title}
                </h3>
                {item?.Desc && (
                  <p className={`${viewMode === "grid" ? "text-sm" : "text-base"} text-gray-600 mb-2 line-clamp-2`}>
                    {item.desc}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {item?.calories || 0} Calories
                  </span>
                  {item?.category && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

      
            <motion.div
              whileTap={{ scale: 0.95 }}
              className={`${viewMode === "grid" ? "absolute top-4 right-4" : "ml-4"} w-10 h-10 rounded-full bg-green-500 flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors shadow-lg`}
            >
              <Link to={'/post/' + item?.ID}>
                <MdAdsClick className="text-white text-lg" />
              </Link>
            </motion.div>
          </motion.div>
        ))
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <img src={`/images/NotFound.svg`} className="h-340" alt="product" />
          <p className="text-xl text-headingColor font-semibold my-2">
            Items Not Available
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default RowContainer;
