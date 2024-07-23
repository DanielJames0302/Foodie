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
  User[]
  >({
  queryKey: ["relationships", currentUser.ID],
  queryFn: () =>
    makeRequest.get("/relationships").then((res) => {
      return res.data as User[];
    }),
});
  return (
    <Sidebar>
      <div className="h-full ml-[10px] flex relative">

          <div className="flex-[3] p-[10px]">
            <h3 className="text-2xl font-bold text-neutral-800">People</h3>
            {rIsLoading ? (
              <CircularProgress />
            ) : (
              <UserList items={relationshipData} />
            )}
          </div>
          <div className="flex-[9] flex items-center justify-center h-full text-3xl text-gray-50 cursor-default">
            Select a person to start conversation
          </div>
      </div>
    </Sidebar>
  );
};

export default Messenger;
