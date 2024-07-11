import "./navbar.scss";

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
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="app-name">Foodie</span>
        </Link>
        <SearchProfile />
      </div>
      <div className="right">
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
        <div className="user">
          <Link
            to={`/profile/${currentUser.ID}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
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
