import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import { AxiosError } from "axios";

interface Relationship {
  userID: number;
}

interface User {
  ID: number;
  profilePic: string;
  coverPic: string;
  userName: string;
  name: string;
  city: string;
  website: string;
}

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const { currentUser } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery<any, Error, User>({
    queryKey: ["user", currentUser.ID],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        return res.data as User;
      }),
  });

  const { isLoading: rIsLoading, data: relationshipData } = useQuery<
    any,
    Error,
    Relationship[]
  >({
    queryKey: ["relationship", userId],
    queryFn: () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data as Relationship[];
      }),
  });

  const { isLoading: requestIsLoading, data: requestData } = useQuery<any, Error, any>({
    queryKey: ["followRequests", userId],
    queryFn: () => makeRequest.get("/sended_follow_requests").then((res) => {
      return res.data
    })
  })
  console.log(requestData)
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (following: boolean) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/send_follow_request/" + userId);
    },

    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["relationship", userId] });
    },
    onError: (err: AxiosError) => {
      console.log(err)
    }
  });

  const handleFollow = () => {
    console.log(
      relationshipData!.some(
        (item: Relationship) => item.userID === currentUser.ID
      )
    );
    mutation.mutate(
      relationshipData!.some(
        (item: Relationship) => item.userID === currentUser.ID
      )
    );
  };

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={data?.coverPic ? "/uploads/" + data?.coverPic : "/images/default-cover.png" } alt="" className="cover" />
            <img
              src={data?.profilePic ? "/uploads/" + data?.profilePic : "/images/default-user.jpg"}
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data?.city}</span>
                  </div>
                </div>
              </div>
              <div className="center">
                <span>{data?.name}</span>

                {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.ID ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData?.some(
                      (item) => item.userID === currentUser.ID
                    )
                      ? "Following"
                      :requestData?.some((item: any) => item.receiver_profile_id === userId) ? "Follow request sent" : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && (
        <Update
          setOpenUpdate={setOpenUpdate}
          openUpdate={openUpdate}
          user={data}
        />
      )}
    </div>
  );
};

export default Profile;
