import "./rightBar.scss";
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
    <div className="rightBar">
      <div className="container">
        <FollowRequests />

        <div className="item">
          <span>Friends</span>
          {rIsLoading ? (
            <CircularProgress />
          ) : (
            relationshipData.map((friend, id: number) => (
              <div className="friend" key={id}>
                <Link to={'/profile/' + friend.ID}>
                <div className="friendInfo flex flex-row gap-4">
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
