import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./followRequests.scss";
import { User } from "../../interfaces/user";
import { makeRequest } from "../../axios";
import { fetchFollowRequests, handldeFollowRequests } from "../../api/followAction";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useCallback } from "react";
import { toast } from "react-toastify";

const FollowRequests = () => {
  const { data, isLoading, isError } = useQuery<any, Error, any>({
    queryKey: ["followRequests"],
    queryFn: () => fetchFollowRequests(),
  });
  console.log(data)
  const queryClient = useQueryClient()
  const acceptMutation = useMutation<any, Error, any>({
    mutationFn: ({sender_profile_id , option }) => handldeFollowRequests({sender_profile_id, option}),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["followRequests"] });
    },
  })


  const handleFollowRequests = useCallback((sender_profile_id: number, option: string) => {
    acceptMutation.mutate({sender_profile_id, option})
  }, [])

  return (
    <div className="item">
      {isError ? (
        "Something went wrong"
      ) : isLoading ? (
        <CircularProgress />
      ) : (
        <div>
          <span>Follow Requests</span>
          {data?.map((user: User, id: number) => (
             <div className="user" key ={id}>
             <div className="userInfo">
               <img
                 src={`/uploads/` + user.profilePic}
                 alt=""
               />
               <span>{user.username}</span>
             </div>
             <div className="buttons">
               <button onClick={() => handleFollowRequests(user.ID, "accept")}>follow</button>
               <button onClick={() => handleFollowRequests(user.ID, 'decline')}>dismiss</button>
             </div>
           </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowRequests;
