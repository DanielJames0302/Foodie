import { User } from "../../interfaces/user"
import UserBox from "./UserBox";

interface UserListProps {
  items: User[] | undefined;
}
const UserList:React.FC<UserListProps> = ({items}) => {
  return (
    <div className="p-[10px]">
      {items?.map((item:User, id: number) => (
        <UserBox key={id} data={item} />
      ))}
    </div>
  )
}

export default UserList
