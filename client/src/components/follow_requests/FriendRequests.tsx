import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "../../interfaces/user";
import {
  handldeFollowRequests,
} from "../../api/followAction";
import CircularProgress from "@mui/material/CircularProgress";
import { useCallback } from "react";
import { makeRequest } from "../../axios";
import Avatar from "../avatar/Avatar";

const FriendRequests = () => {
  const { data, isLoading} = useQuery<any, Error, User[]>({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      return await makeRequest.get("/friend_requests").then((res) => {
        return res.data || [];
      });
    },
  });
  const queryClient = useQueryClient();
  const acceptMutation = useMutation<any, Error, any>({
    mutationFn: ({ sender_profile_id, option }) =>
      handldeFollowRequests({ sender_profile_id, option }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const handleFollowRequests = useCallback(
    (sender_profile_id: number, option: string) => {
      acceptMutation.mutate({ sender_profile_id, option });
    },
    []
  );

  return (
    <div className="item">
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div>
          <span>Friend Requests</span>
          {data?.map((user: User, id: number) => (
            <div className="user" key={id}>
              <div className="userInfo">
                <Avatar user={user}/>
                <span>{user.username}</span>
              </div>
              <div className="flex flex-row gap-1">
                <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-2 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={() => handleFollowRequests(user.ID, "accept")}>
                  Accept
                </button>
                <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-2 border-b-4 border-red-700 hover:border-red-500 rounded"
                  onClick={() => handleFollowRequests(user.ID, "decline")}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
