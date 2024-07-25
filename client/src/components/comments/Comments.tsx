import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import Avatar from "../avatar/Avatar";
import { triggerErrorMessage } from "../../utils/locals";

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
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },

    onError: () => {
      triggerErrorMessage()
    }
  });

  const handleClick = async (e: any) => {
    e.preventDefault();
    if (desc == "") return
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-[20px] my-[20px]">
        <Avatar user={currentUser} />
        <input
        className="flex-[5] p-[10px] text-black outline-none bg-slate-50"
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
              <Avatar user={comment.Users} />
              <div className="info flex-[3] flex gap-[3px] items-center justify-start">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="flex-1 flex items-center justify-center text-black text-md">
                {moment(comment.CreatedAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
