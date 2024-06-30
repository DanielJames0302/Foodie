import { FullMessageType } from "../../interfaces/chat";
import "./MessageBox.scss";
import Avatar from "../avatar/Avatar";
import { format } from "date-fns";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const { currentUser } = useContext(AuthContext);
  const isOwn = currentUser.username === data.Sender.username;
  const seenList = (data.SeenIds || [])
    .filter((user) => user.username !== data.Sender.username)
    .map((user) => user.name)
    .join(", ");

    console.log(isOwn)

  return (
    <div className={isOwn ? "message-box isOwn" : "message-box"}>
      <div className="message-box-avatar">
        <Avatar user={data.Sender} />
      </div>
      <div className="message-body">
          <div className={isOwn ?"message-body-time isOwn" : "message-body-wrapper-time" }>
            {format(new Date(data.CreatedAt), "p")}
          </div>
          <div className={isOwn ? "message-body-content isOwnMessage": "message-body-content"}>{data.Body}</div>

        {isLast && isOwn && seenList.length > 0 && (
        <div
          className="
          message-body-seen-list
          "
        >
          {`Seen by ${seenList}`}
        </div>
      )}
      </div>
     
    </div>
  );
};

export default MessageBox;
