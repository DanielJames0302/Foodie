import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import LeftBar from "../../components/leftbar/LeftBar";
import RightBar from "../../components/rightbar/RightBar";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { IoNavigateCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="home">
      <div className="flex flex-row gap-2">
        <LeftBar />
        <div style={{ flex: 6 }}>
          <Link to={"/share"}>
            <button className="btn bg-green-500 hover:bg-green-400 flex flex-row gap-3 mb-2 p-2">
              <img
                src={
                  currentUser.profilePic
                    ? "/uploads/" + currentUser.profilePic
                    : `/images/default-user.jpg`
                }
                alt=""
                className="h-6 w-6"
              />
              <span className="text-white font-bold">
                Do you have new recipe in your mind {currentUser.name} ?
              </span>
              <IoNavigateCircleOutline className="text-white h-6 w-6" />
            </button>
          </Link>

     
          <Posts userId={null} />
        </div>
        <RightBar />
      </div>
    </div>
  );
};

export default Home;
