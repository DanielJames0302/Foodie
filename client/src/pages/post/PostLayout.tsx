import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../axios";
import CircularProgress from "@mui/material/CircularProgress";
import Post from "../../components/post/Post";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery as useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import moment from "moment";
import { Image } from "cloudinary-react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Comments from "../../components/comments/Comments";

const CompactPost = ({ post }: any) => {
  const [commentOpen, setCommentOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { currentUser }: any = useContext(AuthContext);

  const { isLoading, data } = useQuery<any, Error, any>({
    queryKey: ["likes", post.ID],
    queryFn: () =>
      makeRequest.get("/likes?postId=" + post.ID).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (liked: boolean) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.ID);
      return makeRequest.post("/likes?postId=" + post.ID);
    },
    onSuccess: () => {

    },
  });

  const handleLike = () => {
    mutation.mutate(data?.some((item: any) => item.userID === currentUser.ID));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-xl mx-auto h-fit flex flex-col">
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <img 
              className="w-6 h-6 rounded-full object-cover" 
              src={
                post.User?.profilePic || post.profile_pic
                  ? "/uploads/" + (post.User?.profilePic || post.profile_pic)
                  : "/images/default-user.jpg"
              } 
              alt="User avatar" 
            />
            <div>
              <Link
                to={`/profile/${post.user_id}`}
                className="font-medium text-gray-900 hover:text-blue-600 text-sm"
              >
                {post.User?.username || post.User?.name || post.username || post.name || 'Unknown User'}
              </Link>
              <p className="text-xs text-gray-500">{moment(post.CreatedAt).fromNow()}</p>
            </div>
          </div>
          <MoreHorizIcon className="text-gray-400 cursor-pointer text-sm" />
        </div>


        <div className="flex flex-wrap gap-1 mb-2">
          <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
            {post.type}
          </span>
          {post.type === "Recipe" && (
            <>
              <span className="bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                {post.category}
              </span>
              <span className="bg-green-100 text-green-600 text-xs px-1.5 py-0.5 rounded-full">
                {post.calories} cal
              </span>
            </>
          )}
        </div>

        <div className="mb-3">
          <h2 className="text-base font-semibold text-gray-900 mb-1">{post.title}</h2>
          <p className="text-gray-700 text-xs leading-relaxed line-clamp-3">{post.desc}</p>
        </div>


        {post.imgUrl && (
          <div className="mb-3">
            <Image
              alt="Post image"
              cloudName="dgkyhspuf"
              publicId={post.imgUrl}
              className="w-full rounded-md max-h-48 object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100 mb-2">
          <button 
            className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
            onClick={handleLike}
          >
            {isLoading ? (
              <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : data?.some((item: any) => item.userID === currentUser.ID) ? (
              <FavoriteOutlinedIcon className="text-red-500 text-sm" />
            ) : (
              <FavoriteBorderOutlinedIcon className="text-sm" />
            )}
            <span className="text-xs">{data?.length || 0}</span>
          </button>
          
          <button 
            className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors"
            onClick={() => setCommentOpen(!commentOpen)}
          >
            <TextsmsOutlinedIcon className="text-sm" />
            <span className="text-xs">Comments</span>
          </button>
          
          <button className="flex items-center gap-1 text-gray-600 hover:text-green-500 transition-colors">
            <ShareOutlinedIcon className="text-sm" />
            <span className="text-xs">Share</span>
          </button>
        </div>

        {/* Comments Section - Scrollable */}
        {commentOpen && (
          <div className="max-h-40 overflow-y-auto border-t border-gray-100 pt-2">
            <Comments postId={post.ID} />
          </div>
        )}
      </div>
    </div>
  );
};

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
    <div className="h-full overflow-y-auto bg-gray-100">
      <div className="flex items-center justify-center h-full py-4">
        <div className="w-full h-full max-w-lg px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <CircularProgress size={60} />
              <span className="ml-4 text-gray-600">Loading post...</span>
            </div>
          ) : data ? (
            <CompactPost post={data} />
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Post Not Found</h3>
              <p className="text-gray-500">The post you're looking for doesn't exist or has been removed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostLayout;
