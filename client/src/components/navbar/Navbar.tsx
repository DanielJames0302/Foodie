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
    <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between gap-3 px-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className="inline-flex items-center gap-2">
              <span className="rounded bg-green-500 px-2 py-1 text-sm font-bold text-white">Foodie</span>
            </div>
          </Link>
          <div className="min-w-0 flex-1">
            <SearchProfile />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/share`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="rounded-md p-2 hover:bg-slate-100" title="Create">
              <CreateIcon fontSize="small" />
            </div>
          </Link>
          <Link to={`/menu`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="rounded-md p-2 hover:bg-slate-100" title="Menu">
              <RestaurantMenuIcon fontSize="small" />
            </div>
          </Link>
          <Link to={`/conversations`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="rounded-md p-2 hover:bg-slate-100" title="Messages">
              <EmailOutlinedIcon fontSize="small" />
            </div>
          </Link>
          <Notification />
          <Link to={`/profile/${currentUser.ID}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="flex items-center gap-2 rounded-md p-1 hover:bg-slate-100">
              <img
                className="h-[28px] w-[28px] rounded-full object-cover"
                src={currentUser.profilePic ? "/uploads/" + currentUser.profilePic : '/images/default-user.jpg'}
                alt=""
              />
              <span className="hidden text-sm font-medium text-slate-700 tablet:inline">{currentUser.name}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
