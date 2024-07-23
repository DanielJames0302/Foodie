import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchSearchingResults } from "../../api/searchAction";
import { User } from "../../interfaces/user";
import SearchIcon from "@mui/icons-material/Search";
import { Dropdown } from "react-bootstrap";


const SearchProfile = () => {
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [isShowResult, setIsShowResult] = useState<boolean>(false);
  const [searchedProfileName, setSearchedProfileName] =
    useState<string>("");

  const { data } = useQuery<any, Error, User[]>({
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
    <div ref={searchRef}>
      <div className="flex items-center gap-[10px] rounded-xl p-[5px] bg-white text-black">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search..."
          className="border-none w-[500px] bg-white text-black outline-none mobile:hidden tablet:w-[200px]"
          onChange={(e) => setSearchedProfileName(e.target.value)}
        />
      </div>
      <div>
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
                  <div className="flex items-center gap-[10px] font-bold text-black">
                      <img
                        src={
                          user.profilePic
                            ? "/uploads/" + user.profilePic
                            : `/images/default-user.jpg`
                        }
                        className="searched-user-image w-[30px] h-[30px] rounded-full object-cover"
                        alt=""
                      />
                      <span className="text-black ml-[10px]">
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
