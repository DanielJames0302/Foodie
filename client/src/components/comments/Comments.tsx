import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }: any) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + postId).then((res) => {
        return res.data;
      }),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment: any) => {
      return makeRequest.post("/comments", newComment);
    },

    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleClick = async (e: any) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-[20px] my-[20px]">
        <img src={currentUser.profilePic ? "/uploads/" + currentUser.profilePic : `/images/default-user.jpg`} alt="" />
        <input
        className="flex-[5] p-[10px] border-black bg-transparent text-white"
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button className="border-none bg-blue-400 text-white p-[10px] cursor-pointer rounded-sm" onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((comment: any, index: number) => (
            <div key={index} className="my-[30px] flex justify-between gap-[20px]">
              <img src={"/upload/" + comment.profilePic} alt="" />
              <div className="info flex-[5] flex flex-col gap-[3px] items-center">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="flex-1 align-middle text-gray-200 text-md">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
