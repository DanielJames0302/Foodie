import PostItem from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

interface Props {
  userId: number | null;
}
interface Post {
  ID: number
  desc: string
  img: string
  userId: string 
  profilePic: string
}


const Posts: React.FC<Props> = ({ userId }) => {

  const { isLoading, error, data} = useQuery<any,Error,any>({
    queryKey: ["posts"],
    queryFn: async () => {

      if (userId) {
         return await makeRequest.get("posts?userId=" + userId).then((res) => {
          return res.data as Post[];
        });
      } 

      return await makeRequest.get("posts").then((res) => {
        return res.data as Post[];
      });
    },
  });

  return (
  
    <div className="flex flex-col gap-[50px]">
       {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data!.map((post: Post, index: number) => <PostItem post={post} key={index} />)}
    </div>
  );
};

export default Posts;
