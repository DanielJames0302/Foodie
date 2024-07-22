import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Image } from "cloudinary-react";

interface User {
  userID: string;
}

const Post = ({ post }: any) => {
  const [commentOpen, setCommentOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const { currentUser }: any = useContext(AuthContext);

  const { isLoading, data } = useQuery<any, Error, User[]>({
    queryKey: ["likes", post.ID],
    queryFn: () =>
      makeRequest.get("/likes?postId=" + post.ID).then((res) => {
        return res.data as User[];
      }),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (liked: boolean) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.ID);
      return makeRequest.post("/likes?postId=" + post.ID);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete("/posts?postId=" + postId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    mutation.mutate(data!.some((item) => item.userID === currentUser.ID));
  };

  const handleDelete = () => {
    if (!post.ID) return;
    deleteMutation.mutate(post.ID);
  };
  
  return (
    <div className="post shadow-xl rounded-3xl bg-white text-gray-200">
      <div className="container p-[20px]">
        <div className="user flex item-center justify-between relative ">
          <div className="userInfo flex gap-[20px]">
            <img className="w-[40px] h-[40px] rounded-full object-contain" src={"/uploads/" + post.User.profilePic} alt="" />
            <div className="details flex flex-col ">
              <Link
                to={`/profile/${post.user_id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name font-bold">{post.User.username}</span>
              </Link>
              <span className="date text-sm">{moment(post.CreatedAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button className="absolute top-[30px] right-0 cursor-pointer btn bg-red-400 hover:bg-red-300 text-white p-2" onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="flex flex-col mt-2">
          <div className="flex flex-row">
            <span className="bg-red-100 text-red-500 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-500 border border-red-500 w-20 text-center h-8 flex items-center justify-center">
              {post.type}
            </span>
            {post.type === "Recipe" && (
              <span className="bg-blue-100 text-blue-500 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-500 border border-blue-500 w-20 text-center h-8 flex items-center justify-center">
                {post.category}
              </span>
            )}
             {post.type === "Recipe" && (
              <span className="bg-green-100 text-green-500 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-500 border border-green-500 w-22 text-center h-8 flex items-center justify-center">
                Calories: {post.calories} 
              </span>
            )}
          </div>
          <p className="text-2xl font-bold">{post.title}</p>
          <p>{post.desc}</p>
          {post.imgUrl && <Image
            alt="No image shown"
            cloudName="dgkyhspuf"
            publicId={`https://res.cloudinary.com/dgkyhspuf/image/upload/${post.imgUrl}.png`}
          />}
        </div>
        <div className="flex items-center gap-5 mt-2">
          <div className="flex items-center gap-2 text-xs cursor-pointer">
            {isLoading ? (
              "loading"
            ) : data?.some((item) => item.userID === currentUser.ID) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="flex items-center gap-2 text-xs cursor-pointer" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="flex items-center gap-2 text-xs cursor-pointer">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.ID} />}
      </div>
    </div>
  );
};

export default Post;
