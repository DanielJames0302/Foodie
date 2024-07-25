import { useEffect, useRef } from "react";
import { MdAdsClick } from "react-icons/md";
import { motion } from "framer-motion";
import { Image } from "cloudinary-react";
import { Link } from "react-router-dom";


interface RowContainerProps {
  flag: boolean;
  data: any;
  scrollValue: any;
}

const RowContainer: React.FC<RowContainerProps> = ({
  flag,
  data,
  scrollValue,
}) => {
  const rowContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rowContainer.current.scrollLeft += scrollValue;
  }, [scrollValue]);
  return (
    <div
      ref={rowContainer}
      className={`w-full flex items-center gap-3  my-12 scroll-smooth  ${
        flag
          ? "overflow-x-scroll scrollbar-none"
          : "overflow-x-hidden flex-wrap justify-center"
      }`}
    >
      {data && data.length > 0 ? (
        data.map((item: any) => (
          <div
            key={item?.ID}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-cardOverlay rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                {item.imgUrl ? 
                  <Image
                    className="h-[120px] w-[120px]"
                    alt="No image shown"
                    cloudName="dgkyhspuf"
                    publicId={`https://res.cloudinary.com/dgkyhspuf/image/upload/${item.imgUrl}.png`}
                  /> :
                  <img className= "h-[120px] w-[120px]" src={'/images/default-food-not-found.jpg'} alt="not found" />
                }
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
              >
                <Link to={'/post/' + item?.ID}>
                <MdAdsClick className="text-white" />
                </Link>
             
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-6">
              <p className="text-black font-semibold text-base md:text-lg">
                {item?.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {item?.calories} Calories
              </p>
            </div>
          </div>
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
  );
};

export default RowContainer;
