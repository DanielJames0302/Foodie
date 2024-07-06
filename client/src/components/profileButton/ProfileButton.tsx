import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Update from "../update/Update";
import { User } from "../../interfaces/user";

interface ProfileButtonProps {
  relationshipData: any;
  sentRequestData: any;
  requestData: any;
}
const ProfileButton: React.FC<ProfileButtonProps> = ({
  relationshipData,
  sentRequestData,
  requestData,
}) => {
  const { currentUser } = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false);
  const isFriend = useMemo(() => {
    return relationshipData?.some((item: User) => item.ID === userId);
  }, [relationshipData]);
  const isRequestSended = useMemo(() => {
    return sentRequestData?.some(
      (item: any) => item.receiver_profile_id === userId
    );
  }, [sentRequestData]);
  const hasRequestFromThisProfile = useMemo(() => {
    return requestData?.some(
      (item: any) => item.receiver_profile_id === currentUser.ID
    );
  }, [requestData]);

  
  const queryClient = useQueryClient();

  const friendMutation = useMutation({
    mutationFn: (isFriend: boolean) => {
      if (isFriend) return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/send_friend_request/" + userId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship", userId] });
    },

  });

  const requestMutation = useMutation({
    mutationFn: (isRequestSended: boolean) => {
      if (isRequestSended) {
        return makeRequest.delete("/cancel_friend_request/"+ userId);
      }
      return makeRequest.post("/send_friend_request/"+ userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendSentRequests", userId] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests", userId] });
    },
  })
  

  const handleClickProfileButton = () => {
    if (userId === currentUser.ID) {
      setIsOpenUpdate(prev => !prev);
      return;
    } 

    if (!isFriend && !hasRequestFromThisProfile) {
      requestMutation.mutate(isRequestSended);
      return;
    }
 
    friendMutation.mutate(isFriend)
  }
  return (
    <>
       <button
      className={
        userId === currentUser.ID
          ? "btn bg-blue-500 hover:bg-blue-400 text-white "
          : isFriend || isRequestSended
          ? "btn bg-red-500 hover:bg-red-400 text-white"
          : hasRequestFromThisProfile
          ? "btn btn-green hover:bg-green-400 text-white"
          : "btn bg-blue-500 hover:bg-blue-400 text-white"
      }
      onClick={handleClickProfileButton}
    >
      {userId === currentUser.ID
        ? "Update"
        : isFriend
        ? "Remove Friend"
        : hasRequestFromThisProfile
        ? "Accept Friend Request"
        : isRequestSended
        ? "Cancel Friend Request"
        : "Send Friend Request"}
      </button>
      {isOpenUpdate && (
        <Update
          setOpenUpdate={setIsOpenUpdate}
          openUpdate={isOpenUpdate}
          user={currentUser}
        />
      )}
    </>
   
  );
};
export default ProfileButton;
