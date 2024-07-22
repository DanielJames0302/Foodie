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
    <div className="flex-[3] sticky top-[70px] h-[calc(100vh - 70px)] overflow-scroll overflow-y-hidden bg-gray-100 mobile:hidden tablet:hidden">
      <div className="flex flex-col">
        <FollowRequests />

        <div className="shadow-lg p-[20px] mb-[20px] bg-white">
          <span className="font-light">Friends</span>
          {rIsLoading ? (
            <CircularProgress />
          ) : (
            relationshipData.map((friend, id: number) => (
              <div key={id}>
                <Link to={'/profile/' + friend.ID}>
                <div className="flex flex-row gap-4">
                  <Avatar user={friend} />
                  <span className="text-black">{friend.name}</span>
                </div>
                </Link>
               
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
