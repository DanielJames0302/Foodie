import { useContext, useMemo } from "react";
import { FullConversationType } from "../interfaces/chat";
import { AuthContext } from "../context/authContext";
import { User } from "../interfaces/user";

const useOtherUser = (conversation: FullConversationType) => {
  const { currentUser } = useContext(AuthContext);
  const  otherUser = useMemo(() => {
    const currentUserEmail = currentUser.email;
    const otherUser = conversation!.Users!.filter((user) => user.email !== currentUserEmail)
    return otherUser[0]
  }, [currentUser, conversation])

  return otherUser;
}

export default useOtherUser;