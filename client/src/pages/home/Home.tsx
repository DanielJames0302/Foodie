import Posts from "../../components/posts/Posts";
import LeftBar from "../../components/leftbar/LeftBar";
import RightBar from "../../components/rightbar/RightBar";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { IoNavigateCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-100">
      <div className="flex h-full gap-2">
        <div className="flex-[2] sticky h-full">
          <LeftBar />
        </div>

        <div className="flex-[6] overflow-y-auto h-full">
          <div className="flex justify-center">
            <Link to={"/share"}>
              <div className="mb-3 w-full max-w-2xl cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      currentUser.profilePic
                        ? "/uploads/" + currentUser.profilePic
                        : `/images/default-user.jpg`
                    }
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-slate-500">
                      Do you have a new recipe in your mind{" "}
                      <span className="font-semibold text-slate-700">
                        {currentUser.name}
                      </span>
                      ?
                    </div>
                  </div>
                  <div className="flex items-center justify-center rounded-full bg-green-500 p-2 text-white">
                    <IoNavigateCircleOutline className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <Posts userId={null} />
        </div>

        {/* Right Sidebar (sticky) */}
        <div className="flex-[2] sticky h-full">
          <RightBar />
        </div>
      </div>
    </div>
  );
};

export default Home;
