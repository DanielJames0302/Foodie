import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchSearchingResults } from "../../api/searchAction";
import { User } from "../../interfaces/user";
import SearchIcon from "@mui/icons-material/Search";
import { Dropdown } from "react-bootstrap";
import { useDebounce } from "../../hooks/useDebounce";


const SearchProfile = () => {
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [isShowResult, setIsShowResult] = useState<boolean>(false);
  const [searchedProfileName, setSearchedProfileName] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  
  // Debounce the search input with 500ms delay
  const debouncedSearchTerm = useDebounce(searchedProfileName, 500);

  const { data, isLoading, error } = useQuery<any, Error, User[]>({
    queryKey: ["searchProfile", debouncedSearchTerm],
    queryFn: () => fetchSearchingResults(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 0, // Only search if there's a term
  });
  
  const hasResults = data && data.length > 0;
  const showNoResults = debouncedSearchTerm.length > 0 && !isLoading && !hasResults;
  
  const handleClick = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !event.composedPath().includes(searchRef.current)
    ) {
      setIsShowResult(false);
      setIsFocused(false);
      return;
    }
    setIsShowResult(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedProfileName(e.target.value);
    setIsShowResult(true);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setIsShowResult(true);
  };

  const handleInputBlur = () => {
    // Delay to allow clicking on dropdown items
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };

  useEffect(() => {
    document.body.addEventListener("click", handleClick);
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, []);
 

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className={`flex items-center gap-3 rounded-xl px-4 py-2 bg-white text-black border-2 transition-all duration-200 ${
        isFocused 
          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
          : 'border-gray-200 hover:border-gray-300'
      }`}>
        <SearchIcon className={`transition-colors duration-200 ${
          isFocused ? 'text-blue-500' : 'text-gray-400'
        }`} />
        <input
          type="text"
          placeholder="Search users..."
          className="flex-1 border-none bg-transparent text-black outline-none placeholder-gray-400 text-sm"
          value={searchedProfileName}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>
      
      {isShowResult && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-gray-600">Searching...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                <div>Error searching users</div>
              </div>
            ) : showNoResults ? (
              <div className="p-4 text-center text-gray-500">
                <div>No users found</div>
              </div>
            ) : hasResults ? (
              <div className="py-2">
                {data?.map((user: User, id: number) => (
                  <a
                    href={`/profile/${user.ID}`}
                    key={id}
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.profilePic
                            ? "/uploads/" + user.profilePic
                            : `/images/default-user.jpg`
                        }
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        alt={`${user.name} profile`}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </span>
                        <span className="text-sm text-gray-500 truncate">
                          @{user.username}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchProfile;
