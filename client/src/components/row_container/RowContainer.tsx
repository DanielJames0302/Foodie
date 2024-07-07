import { useEffect, useRef, useState } from "react";
import { MdAdsClick } from "react-icons/md";
import { motion } from "framer-motion";
interface RowContainerProps {
  flag: boolean,
  data: any,
  scrollValue: any
}

const RowContainer:React.FC<RowContainerProps> = ({flag, data, scrollValue}) => {
  const rowContainer = useRef<HTMLDivElement>(null);
  console.log(data)

  useEffect(() => {
    rowContainer.current.scrollLeft += scrollValue
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
          key={item?.id}
          className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-cardOverlay rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
        >
          <div className="w-full flex items-center justify-between">
            <motion.div
              className="w-40 h-40 -mt-8 drop-shadow-2xl"
              whileHover={{ scale: 1.2 }}
            >
              <img
                src={'/images/c1.png'}
                alt=""
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.75 }}
              className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
            >
              <MdAdsClick className="text-white" />
            </motion.div>
          </div>

          <div className="w-full flex flex-col items-end justify-end -mt-8">
            <p className="text-textColor font-semibold text-base md:text-lg">
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
        <img src={`/images/NotFound.svg`} className="h-340" />
        <p className="text-xl text-headingColor font-semibold my-2">
          Items Not Available
        </p>
      </div>
    )}
  </div>
  )
}

export default RowContainer
