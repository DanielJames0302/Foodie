import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchSearchingResults } from "../../api/searchAction";
import { User } from "../../interfaces/user";
import SearchIcon from "@mui/icons-material/Search";
import "./searchProfile.scss";
import { Dropdown, DropdownItem } from "react-bootstrap";
import { Link } from "react-router-dom";

const SearchProfile = () => {
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [isShowResult, setIsShowResult] = useState<boolean>(false);
  const [searchedProfileName, setSearchedProfileName] =
    useState<string>("");

  const { data, isLoading, isError } = useQuery<any, Error, User[]>({
    queryKey: ["searchProfile", searchedProfileName],
    queryFn: () => fetchSearchingResults(searchedProfileName),
  });
  const hasResults = data && data.length > 0;
  const handleClick = (event: MouseEvent) => {
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
    document.body.addEventListener("click", handleClick);
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, []);
 

  return (
    <div ref={searchRef} className="search">
      <div className="search-bar">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setSearchedProfileName(e.target.value)}
        />
      </div>
      <div className="search-results-list">
        {isShowResult && !hasResults && searchedProfileName !== "" ? (
          <Dropdown className="w-100" show autoClose={false}>
            <Dropdown.Menu className=" w-100 my-1">
              <Dropdown.Item className="">
                <div className="p-2">Unable to find profile</div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Dropdown className="w-100" show={hasResults && isShowResult} autoClose={false}>
            <Dropdown.Menu className=" w-100 my-1">
              {data?.map((user: User, id: number) => (
                <Dropdown.Item href= {`/profile/${user.ID}`} eventKey={id} key={id}>
                  <div className="searched-user">
                      <img
                        src={
                          user.profilePic
                            ? "/uploads/" + user.profilePic
                            : `/images/default-user.jpg`
                        }
                        className="searched-user-image"
                        alt=""
                      />
                      <span className="searched-user-name">
                        {user.name}
                      </span>
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default SearchProfile;
