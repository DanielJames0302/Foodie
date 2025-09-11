import { useState, useMemo, useEffect } from "react";
import { categories } from "../../utils/data";
import { motion } from "framer-motion";
import { IoFastFood, IoSearch, IoFilter, IoGrid, IoList, IoArrowUp, IoArrowDown } from "react-icons/io5";
import { MdSort } from "react-icons/md";
import RowContainer from "../../components/row_container/RowContainer";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import CircularProgress from "@mui/material/CircularProgress";
import { triggerErrorMessage } from "../../utils/locals";

const Menu = () => {
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);


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
          if (response.status !== 200) {
            triggerErrorMessage()
            return
          }
          return response.data;
        })
        .catch((error) => {
          console.error("Food API error:", error);
          return [];
        });
    },
  });

  // Filter and sort the data based on search query and sort option
  const filteredAndSortedData = useMemo(() => {
    if (!foodData) return [];
    
    console.log("Raw foodData for sorting:", foodData);
    console.log("Current sortBy:", sortBy);
    
    let filtered = foodData;
    
    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      filtered = filtered.filter((item: any) =>
        item.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.desc?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    const sortedFiltered = [...filtered].sort((a: any, b: any) => {
      let result = 0;
      switch (sortBy) {
        case "name":
          result = (a.title || "").localeCompare(b.title || "");
          break;
        case "calories-high":
          result = (b.calories || 0) - (a.calories || 0);
          break;
        case "calories-low":
          result = (a.calories || 0) - (b.calories || 0);
          break;
        case "date":
          result = new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          break;
        default:
          result = 0;
      }
      return result;
    });
    
    return sortedFiltered;
  }, [foodData, debouncedSearchQuery, sortBy]);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 6);

  return (
    <div className="h-full overflow-y-auto bg-gray-100">
      <section className="w-full my-6 px-4" id="menu">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Menu</h1>
        <p className="text-gray-600">Discover delicious dishes from around the world</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search for dishes, ingredients, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
          />
          {searchQuery !== debouncedSearchQuery && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
            </div>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <MdSort className="text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              <option value="name">📝 Sort by Name</option>
              <option value="calories-high">🔥 Calories (High to Low)</option>
              <option value="calories-low">❄️ Calories (Low to High)</option>
              <option value="date">📅 Sort by Date</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              <IoGrid className="text-xl" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              <IoList className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
          >
            <IoFilter className="text-lg" />
            {showAllCategories ? "Show Less" : "Show All"}
          </button>
        </div>
        
        <div className="flex items-center justify-start lg:justify-center gap-4 py-4 overflow-x-auto scrollbar-none">
          {/* All Categories Button */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className={`group ${
              filter === "" ? "bg-green-500 text-white" : "bg-white text-gray-700"
            } px-6 py-3 cursor-pointer rounded-full border-2 border-green-500 flex items-center gap-2 hover:bg-green-500 hover:text-white transition-all duration-200 shadow-md`}
            onClick={() => setFilter("")}
          >
            <span className="text-xl">🍽️</span>
            <span className="font-medium">All</span>
          </motion.div>

          {visibleCategories.map((category) => (
            <motion.div
              whileTap={{ scale: 0.95 }}
              key={category.id}
              className={`group ${
                filter === category.name ? "bg-green-500 text-white" : "bg-white text-gray-700"
              } px-6 py-3 cursor-pointer rounded-full border-2 border-green-500 flex items-center gap-2 hover:bg-green-500 hover:text-white transition-all duration-200 shadow-md`}
              onClick={() => setFilter(category.name)}
            >
              <span className="text-xl">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <CircularProgress size={60} />
            <span className="ml-4 text-gray-600">Loading delicious dishes...</span>
          </div>
        ) : (
          <div className="w-full">
            {filteredAndSortedData.length === 0 ? (
              <div className="text-center py-16">
                <img src="/images/NotFound.svg" className="h-64 mx-auto mb-4" alt="No results" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                  No Dishes Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or browse different categories
                </p>
              </div>
            ) : (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                  Showing {filteredAndSortedData.length} dish{filteredAndSortedData.length !== 1 ? 'es' : ''}
                  {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
                  {filter && ` in ${filter}`}
                </p>
              </div>
            )}
            
            {filteredAndSortedData.length > 0 && (
              <RowContainer 
                scrollValue={12} 
                flag={viewMode === "grid"} 
                data={filteredAndSortedData}
                viewMode={viewMode}
              />
            )}
          </div>
        )}
      </div>
    </section>
    </div>
  );
};

export default Menu;
