import { User } from "../../interfaces/user"
import UserBox from "./UserBox";

interface UserListProps {
  items: User[] | undefined;
}
const UserList:React.FC<UserListProps> = ({items}) => {
  const count = items?.length ?? 0;
  return (
    <div className="p-[10px]">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-700">Friends</div>
        <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {count}
        </span>
      </div>
      {count === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-center text-slate-500">No friends yet</div>
      ) : (
        <div className="space-y-1">
          {items?.map((item:User, id: number) => (
            <UserBox key={id} data={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default UserList
