import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate()
  const logoutMutate = useMutation({
    mutationFn: () => makeRequest.post("/auth/logout"),
    onSuccess: () => {
      localStorage.removeItem("user");
      navigate("/login")
    }
  })

  const handleLogout = () => {
    logoutMutate.mutate()
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="p-4">
        <div className="mb-4 flex items-center gap-3 rounded-lg border bg-white p-4">
          <img className="w-12 h-12 rounded-full object-cover" src={currentUser.profilePic ? "/uploads/" + currentUser.profilePic : `/images/default-user.jpg`} alt="" />
          <Link
            to={`/profile/${currentUser.ID}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">{currentUser.name || currentUser.username}</span>
              <span className="text-xs text-slate-500">@{currentUser.username}</span>
            </div>
          </Link>
        </div>

        <div className="menu flex flex-col gap-3 rounded-lg border bg-white p-4">
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
