import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchSearchingResults } from "../../api/searchAction";
import { User } from "../../interfaces/user";
import SearchIcon from "@mui/icons-material/Search";
import "./searchProfile.scss";
import { Dropdown, DropdownItem } from "react-bootstrap";

const SearchProfile = () => {
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [isShowResult, setIsShowResult] = useState<boolean>(false);
  const [searchedProfileUsername, setSearchedProfileUsername] =
    useState<string>("");

  const { data, isLoading, isError } = useQuery<any, Error, User[]>({
    queryKey: ["searchProfile", searchedProfileUsername],
    queryFn: () => fetchSearchingResults(searchedProfileUsername),
  });

  const handleClick = (event: MouseEvent) => {
    console.log(event.composedPath());
    console.log(searchRef.current);
    if (
      searchRef.current &&
      !event.composedPath().includes(searchRef.current)
    ) {
      setIsShowResult(false);
      return;
    }
    setIsShowResult(true);
  };
  useEffect(() => {
    if (data?.length === 0) return;
    document.body.addEventListener("click", handleClick);
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, []);

  console.log(isShowResult);

  return (
    <div ref={searchRef} className="search">
      <div className="search-bar">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setSearchedProfileUsername(e.target.value)}
        />
      </div>
      <div className="search-results-list">
        <Dropdown className="w-100" autoClose={"outside"}>
          <Dropdown.Menu className="w-100 my-1" show={isShowResult}>
            {searchedProfileUsername === "" ? (
              <div className="p-2">
                Type in profile's username
              </div>
            ) : data?.length == 0 ? (
              <div className="p-2">Unable to find profile</div>
            ) : (
              data?.map((user: User, id: number) => (
                <Dropdown.Item eventKey={id} key={id}>
                  {user.username}
                </Dropdown.Item>
              ))
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default SearchProfile;
