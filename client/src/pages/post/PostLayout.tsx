import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../axios";
import CircularProgress from "@mui/material/CircularProgress";
import Post from "../../components/post/Post";
const PostLayout = () => {
  const { postId } = useParams();

  const { data, isLoading } = useQuery<any, Error, any>({
    queryKey: ["post", postId],
    queryFn: async () => {
      return await makeRequest.get("/post/" + postId).then((response) => {
        return response.data;
      });
    },
  });

  return (
    <div className="flex items-center justify-center">
      <div className="w-2/4 mt-2">{isLoading ? <CircularProgress /> : <Post post={data} />}</div>
    </div>
  );
};

export default PostLayout;
