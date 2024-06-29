
import { User } from "../../interfaces/user"
import "./Avatar.scss"

interface AvatarProps {
  user: User
}

const Avatar:React.FC<AvatarProps> = ({ user }) => {
  return (
    <div className="avatar">
      <div className="avatar-image">
        <img src={user?.profilePic ? "/uploads/" + user?.profilePic : `/images/default-user.jpg`} alt="" />
      </div>
        
    </div>
  )
}

export default Avatar
