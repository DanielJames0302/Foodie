import { User } from "../../interfaces/user"
import "./UserList.scss"
import UserBox from "./UserBox";

interface UserListProps {
  items: User[] | undefined;
}
const UserList:React.FC<UserListProps> = ({items}) => {
  return (
    <div className="user-list">
      {items?.map((item:User, id: number) => (
        <UserBox key={id} data={item} />
      ))}
    </div>
  )
}

export default UserList
