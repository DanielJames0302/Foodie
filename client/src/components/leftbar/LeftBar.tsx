import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
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
    <div className="flex-[2] sticky top-[70px] h-[calc(100vh-70px)] bg-white text-gray-200 mobile:hidden">
      <div className="p-[20px] ">
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-center gap-[10px]">
            <img className="w-[50px] h-[50px] rounded-full object-cover" src={currentUser.profilePic ? "/uploads/" + currentUser.profilePic : `/images/default-user.jpg`} alt="" />
            <Link
              to={`/profile/${currentUser.ID}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
                <span className="text-lg font-bold text-black">{currentUser.name}</span>
            </Link>
          
          </div>
          
        </div>
        <hr className="mx-[20px] my-[0px] border-none h-[0.5px] bg-slate-100"/>
    
       
        <div className="menu flex flex-col gap-[20px] ">
  
          <Button variant="danger" onClick={handleLogout}>Logout</Button>{' '}
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
