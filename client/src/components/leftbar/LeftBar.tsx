import "./leftBar.scss";
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
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src={currentUser.profilePic ? "/uploads/" + currentUser.profilePic : `/images/default-user.jpg`} alt="" />
            <Link
              to={`/profile/${currentUser.ID}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
                <span>{currentUser.name}</span>
            </Link>
          
          </div>
          
        </div>
        <hr />
    
       
        <div className="menu">
  
          <Button variant="danger" onClick={handleLogout}>Logout</Button>{' '}
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
