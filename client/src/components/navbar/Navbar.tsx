import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import SearchProfile from "../search_profile/SearchProfile";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="app-name">Foodie</span>
        </Link>
        <HomeOutlinedIcon />

        <GridViewOutlinedIcon />

        <SearchProfile />
      </div>
      <div className="right">
        <PersonOutlinedIcon />
        <Link
          to={`/conversations`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <EmailOutlinedIcon />
        </Link>

        <NotificationsOutlinedIcon />
        <div className="user">
          <Link
            to={`/profile/${currentUser.ID}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              src={
                currentUser.profilePic
                  ? "/uploads/" + currentUser.profilePic
                  : `/images/default-user.jpg`
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
