import "./messenger.scss";
import UserList from "../../components/userlist/UserList";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { User } from "../../interfaces/user";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import CircularProgress from "@mui/material/CircularProgress";
import Sidebar from "../../components/sidebar/Sidebar";


const Messenger = () => {
  const { currentUser } = useContext(AuthContext);
  const { isLoading: rIsLoading, data: relationshipData } = useQuery<
  any,
  Error,
  any
  >({
  queryKey: ["relationship", currentUser.ID],
  queryFn: () =>
    makeRequest.get("/relationships?followedUserId=" + currentUser.ID).then((res) => {
      return res.data ;
    }),
});
  console.log(relationshipData)
  return (
    <Sidebar>
      <div className="messenger">

          <div className="chatbox-people">
            <h3>People</h3>
            {rIsLoading ? (
              <CircularProgress />
            ) : (
              <UserList items={relationshipData} />
            )}
          </div>
          <div className="chat-conversation">
            Select a person to start conversation
          </div>
      </div>
    </Sidebar>
  );
};

export default Messenger;
