import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
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
  const { currentUser, setCurrentUser } = useContext(AuthContext);

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

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (following: boolean) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { followed_user_id: userId });
    },

    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["relationship", userId] });
    },
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
                      : "Follow"}
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
