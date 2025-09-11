import FollowRequests from "../follow_requests/FriendRequests";
import { User } from "../../interfaces/user";
import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "../avatar/Avatar";
import { Link } from "react-router-dom";

const RightBar = () => {
  const { isLoading: rIsLoading, data: relationshipData } = useQuery<
    any,
    Error,
    User[]
  >({
    queryKey: ["relationships"],
    queryFn: () =>
      makeRequest.get("/relationships").then((res) => {
        return res.data as User[];
      }),
  });

  return (
    <div className="h-full overflow-y-auto bg-gray-100">
      <div className="flex flex-col p-4 space-y-4">
        <FollowRequests />

        <div className="p-4 bg-white rounded-lg">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Friends</span>
            <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
              {(relationshipData?.length ?? 0)}
            </span>
          </div>
          {rIsLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-md border p-2">
                  <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-1/3 rounded bg-slate-200 animate-pulse" />
                    <div className="h-3 w-1/4 rounded bg-slate-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (relationshipData?.length ?? 0) === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-center text-slate-500">No friends yet</div>
          ) : (
            <div className="space-y-1">
              {relationshipData?.map((friend, id: number) => (
                <Link key={id} to={'/profile/' + friend.ID}>
                  <div className="flex items-center gap-3 rounded-md p-2 hover:bg-slate-50">
                    <Avatar user={friend} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800">{friend.name || friend.username}</span>
                      <span className="text-xs text-slate-500">@{friend.username}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
