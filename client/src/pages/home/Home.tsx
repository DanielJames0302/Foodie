import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import "./home.scss"
import { useEffect } from "react"
import { makeRequest } from "../../axios"
import { useQuery } from "@tanstack/react-query"

const Home = () => {

  

  
  return (
    <div className="home">
      
      <Share/>
      <Posts userId={null}/>
    </div>
  )
}

export default Home