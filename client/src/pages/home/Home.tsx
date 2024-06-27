import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import LeftBar from "../../components/leftbar/LeftBar";
import RightBar from "../../components/rightbar/RightBar";

const Home = () => {
  return (
    <div className="home">
      <div style={{ display: "flex" }}>
       <LeftBar />
        <div style={{ flex: 6 }}>
          <Share />
          <Posts userId={null} />
        </div>
        <RightBar/>
      </div>
    </div>
  );
};

export default Home;
