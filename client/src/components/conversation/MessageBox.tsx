import { FullMessageType } from "../../interfaces/chat";
import Avatar from "../avatar/Avatar";
import { format } from "date-fns";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import clsx from "clsx";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const { currentUser } = useContext(AuthContext);
  const isOwn = currentUser.ID === data.SenderId;
  const seenList = (data.SeenIds || [])
    .filter((user) => user.username !== data.Sender.username)
    .map((user) => user.name)
    .join(", ");
  
  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const message = clsx(
    'text-sm w-fit overflow-hidden', 
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100', 
    data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
  );

  


  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.Sender} />
      </div>
      <div className={body}>
          <div className="text-xs text-gray-40">
            {format(new Date(data.CreatedAt), "p")}
          </div>
          <div className={message}>
            <div>{data.Body}</div></div>

        {isLast && isOwn && seenList.length > 0 && (
        <div className="text-xs text-gray-400">
          {`Seen by ${seenList}`}
        </div>
      )}
      </div>
     
    </div>
  );
};

export default MessageBox;
