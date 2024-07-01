import { useMutation } from "@tanstack/react-query";
import { User } from "../../interfaces/user";
import "./userBox.scss";
import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom";

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const navigate = useNavigate();
  const userBoxMutation = useMutation({
    mutationFn: (data: User) => {
      return makeRequest.post('/conversations', { userId: data.ID });
    },
    onSuccess(data) {
      navigate('/conversations/' + data.data.ID)
    },
  }) 
  const hanldeClick = () => {
    userBoxMutation.mutate(data);
  };
  return (

      <div onClick={hanldeClick} className="userbox">
        <img
          src={
            data.profilePic
              ? "/uploads/" + data.profilePic
              : `/images/default-user.jpg`
          }
          alt=""
        />
        <span>{data.name}</span>
      </div>
    
  );
};

export default UserBox;
