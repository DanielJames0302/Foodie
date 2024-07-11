import { useState } from "react";
import { categories } from "../../utils/data";
import { motion } from "framer-motion";
import { IoFastFood } from "react-icons/io5";
import RowContainer from "../../components/row_container/RowContainer";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import CircularProgress from "@mui/material/CircularProgress";

const Menu = () => {
  const [filter, setFilter] = useState("");
  const {
    data: foodData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["food", filter],
    queryFn: async () => {
      return makeRequest
        .get("/posts/food?filter=" + filter)
        .then((response) => {
          return response.data;
        });
    },
    
  });
  return (
    <section className="w-full my-6" id="menu">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-start lg:justify-center gap-8 py-6 overflow-x-scroll scrollbar-none">
          {categories &&
            categories.map((category) => (
              <motion.div
                whileTap={{ scale: 0.75 }}
                key={category.id}
                className={`group ${
                  filter === category.name ? "bg-green-500" : "bg-card"
                } w-24 min-w-[94px] h-28 cursor-pointer rounded-lg drop-shadow-xl flex flex-col gap-3 items-center justify-center hover:bg-green-500 `}
                onClick={() => setFilter(category.name)}
              >
                <div
                  className={`w-10 h-10 rounded-full shadow-lg ${
                    filter === category.name
                      ? "bg-white"
                      : "bg-green-500"
                  } group-hover:bg-white flex items-center justify-center`}
                >
                  <IoFastFood
                    className={`${
                      filter === category.name
                        ? "text-textColor"
                        : "text-white"
                    } group-hover:text-textColor text-lg`}
                  />
                </div>
                <p
                  className={`text-sm ${
                    filter === category.name
                      ? "text-white"
                      : "text-textColor"
                  } group-hover:text-white`}
                >
                  {category.name}
                </p>
              </motion.div>
            ))}
        </div>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div className="w-full">
            {filter === "" ? (
              <div className="w-full flex items-center justify-center">
                <p className="text-slate-400 text-[50px]">
                  Find out your favourite recipes
                </p>
              </div>
            ) : (
              <RowContainer scrollValue={12} flag={false} data={foodData} />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
