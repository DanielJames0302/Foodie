import PlaceIcon from "@mui/icons-material/Place";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import ProfileButton from "../../components/profileButton/ProfileButton";
import { triggerErrorMessage } from "../../utils/locals";


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
  const { currentUser } = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const navigate = useNavigate();

  const { isLoading , data } = useQuery<any, Error, User>({
    queryKey: ["user", currentUser.ID],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => {
        return res.data as User;
      }),
  });

  const { isLoading: rIsLoading, data: relationshipData } = useQuery<
    any,
    Error,
    User[]
  >({
    queryKey: ["relationships", userId],
    queryFn: () =>
      makeRequest.get("/relationships?myProfileId=" + userId).then((res) => {
        return res.data as User[];
      }),
  });

  const { isLoading: sentRequestIsLoading, data: sentRequestData } = useQuery<
    any,
    Error,
    any
  >({
    queryKey: ["friendSentRequests", userId],
    queryFn: () =>
      makeRequest.get("/sended_friend_requests").then((res) => {
        return res.data;
      }),
  });
  const { isLoading: requestIsLoading, data: requestData } = useQuery<
    any,
    Error,
    any
  >({
    queryKey: ["friendRequests", userId],
    queryFn: () =>
      makeRequest.get("/friend_requests").then((res) => {
        return res.data;
      }),
  });
  const userBoxMutation = useMutation({
    mutationFn: (data: User) => {
      return makeRequest.post('/conversations', { userId: data.ID });
    },
    onSuccess(data) {
      navigate('/conversations/' + data.data.ID)
    },
    onError: () => {
      triggerErrorMessage();
    }
  }) 
  const hanldeClick = () => {
    userBoxMutation.mutate(data);
  };


  return (
    <div className="bg-black-200">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="w-full h-[300px] relative mb-2">
            <img
              src={
                data?.coverPic
                  ? "/uploads/" + data?.coverPic
                  : "/images/default-cover.png"
              }
              alt=""
              className="cover w-full h-full object-contain"
            />
            <img
              src={
                data?.profilePic
                  ? "/uploads/" + data?.profilePic
                  : "/images/default-user.jpg"
              }
              alt=""
              className="profilePic w-[200px] h-[200px] rounded-xl object-cover absolute left-0 right-0 m-auto top-[200px]"
            />
          </div>
          <div className="px-5 py-5 mobile:p-5 tablet:p-8">
            <div className="h-[180px] shadow-xl p-[50px] flex flex-row items-center justify-between mb-[20px] mobile:flex mobile:flex-col mobile:h-[30vh] mobile:p-5 mobile:mt-24">
              <div className="flex-1 flex flex-row gap-2 tablet:flex-wrap">
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data?.city}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xl font-bold">{data?.name}</span>

                {rIsLoading || requestIsLoading || sentRequestIsLoading ? (
                  "loading"
                ) : <ProfileButton relationshipData={relationshipData} requestData={requestData} sentRequestData={sentRequestData} /> 
                }
              </div>
              {userId !== currentUser.ID ? <div className="flex-1 flex items-center justify-end gap-2" onClick={hanldeClick}>
                <EmailOutlinedIcon />
              </div>: <div className="flex-1 flex items-center justify-end gap-2"><MoreVertIcon/> </div>}
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2/4">
              <Posts userId={userId} />  
              </div>
              
            </div>
            
          </div>
        </>
      )}
     
    </div>
  );
};

export default Profile;
