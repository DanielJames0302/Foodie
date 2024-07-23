import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import SearchProfile from "../search_profile/SearchProfile";
import Notification from "./Notification";
import CreateIcon from "@mui/icons-material/Create";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="flex items-center justify-between px-[10px] py-[20px] h-[70px] border-b-black sticky top-0 bg-green-500 text-white z-50">
      <div className="flex items-center gap-[30px]">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="font-bold text-lg text-white">Foodie</span>
        </Link>
        <SearchProfile />
      </div>
      <div className="flex items-center gap-[20px] mobile:hidden">
        <Link to={`/share`} style={{ textDecoration: "none", color: "inherit" }}>
          <CreateIcon />
        </Link>
        <Link to={`/menu`} style={{ textDecoration: "none", color: "inherit" }}>
          <RestaurantMenuIcon />
        </Link>
        <Link
          to={`/conversations`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <EmailOutlinedIcon />
        </Link>

        <Notification />
        <div className="flex items-center gap-[10px] font-bold tablet:hidden">
          <Link
            to={`/profile/${currentUser.ID}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
             className="w-[30px] h-[30px] rounded-full object-cover"
              src={
                currentUser.profilePic
                  ? "/uploads/" + currentUser.profilePic
                  : '/images/default-user.jpg'
              }
              alt=""
            />
            <span>{currentUser.name}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
