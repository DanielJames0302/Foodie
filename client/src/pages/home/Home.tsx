import Posts from "../../components/posts/Posts";
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
          <div className="flex justify-center">
            <Link to={"/share"}>
              <button className="btn bg-green-500 hover:bg-green-400 flex flex-row gap-3 mb-2 p-2">
                <div className="p-2">
                  <img
                    src={
                      currentUser.profilePic
                        ? "/uploads/" + currentUser.profilePic
                        : `/images/default-user.jpg`
                    }
                    alt=""
                    className="h-8 w-8 object-cover"
                  />
                </div>

                <div className="text-white font-light flex items-center justify-center p-2 text-lg">
                  Do you have a new recipe in your mind{" "}
                  <strong>{currentUser.name}</strong>?
                </div>
                <div className="p-2">
                  <IoNavigateCircleOutline className="text-white h-8 w-8" />
                </div>
              </button>
            </Link>
          </div>

          <Posts userId={null} />
        </div>
        <RightBar />
      </div>
    </div>
  );
};

export default Home;
