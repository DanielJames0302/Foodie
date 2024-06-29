import { User } from "../../interfaces/user";
import "./userBox.scss";

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const hanldeClick = () => {};
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
