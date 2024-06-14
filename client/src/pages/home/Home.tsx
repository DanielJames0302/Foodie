import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import "./home.scss"

const Home = () => {
  return (
    <div className="home">
      <Share/>
      <Posts userId={null}/>
    </div>
  )
}

export default Home