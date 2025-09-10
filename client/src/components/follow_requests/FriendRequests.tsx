import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "../../interfaces/user";
import {
  handldeFollowRequests,
} from "../../api/followAction";
import CircularProgress from "@mui/material/CircularProgress";
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

  const handleFollowRequests = (sender_profile_id: number, option: string) => {
      acceptMutation.mutate({ sender_profile_id, option });
    };

  const count = data?.length ?? 0;

  const renderLoading = () => (
    <div className="space-y-3">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="flex items-center justify-between rounded-md border p-3">
          <div className="flex items-center gap-3 w-full">
            <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 rounded bg-slate-200 animate-pulse"></div>
              <div className="h-3 w-1/4 rounded bg-slate-200 animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-16 rounded bg-slate-200 animate-pulse" />
            <div className="h-8 w-16 rounded bg-slate-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmpty = () => (
    <div className="rounded-md border border-dashed p-6 text-center text-slate-500">
      No pending requests
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-semibold text-slate-700">Friend Requests</div>
        <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {count}
        </span>
      </div>
      {isLoading ? (
        renderLoading()
      ) : count === 0 ? (
        renderEmpty()
      ) : (
        <div className="space-y-2">
          {data?.map((user: User, id: number) => (
            <div className="flex items-center justify-between rounded-md border p-3 hover:bg-slate-50" key={id}>
              <div className="flex items-center gap-[12px] relative">
                <Avatar user={user}/>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800">{user.name || user.username}</span>
                  <span className="text-xs text-slate-500">@{user.username}</span>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <button className="inline-flex items-center gap-1 rounded-md bg-green-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-600" onClick={() => handleFollowRequests(user.ID, "accept")}>
                  ✓ Accept
                </button>
                <button className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
                  onClick={() => handleFollowRequests(user.ID, "decline")}
                >
                  ✕ Dismiss
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
