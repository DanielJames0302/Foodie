import { useCallback, useContext, useMemo } from "react";
import { format } from "date-fns";
import { FullConversationType } from "../../interfaces/chat";
import useOtherUser from "../../hooks/useOtherUser";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Avatar from "../avatar/Avatar";
import clsx from "clsx";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const { currentUser } = useContext(AuthContext);
  const otherUser = useOtherUser(data);
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate("/conversations/" + data.ID);
  }, [data.ID, navigate]);

  const lastMessage = useMemo(() => {
    const messages = data.Messages || [];
    return messages[messages.length - 1];
  }, [data.Messages]);

  const userName = useMemo(() => {
    return currentUser.username;
  }, [currentUser.username]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.SeenIds || [];

    if (!userName) {
      return false;
    }

    return seenArray.filter((user) => user.username === userName).length !== 0;
  }, [userName, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return `Sent an image`;
    }

    if (lastMessage?.Body) {
      return lastMessage.Body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      className={clsx(
        `
        w-full 
        relative 
        flex 
        items-center 
        space-x-3 
        p-3 
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        `,
        selected ? "bg-neutral-100" : "bg-white"
      )}
      onClick={handleClick}
    >
      <Avatar user={otherUser} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-md font-medium text-gray-900">{data.Name || otherUser.name}</p>
          {lastMessage?.CreatedAt && (
            <div
              className=" text-xs 
                  text-gray-400 
                  font-light
                  ml-5px"
            >
              {format(new Date(lastMessage.CreatedAt), "p")}
            </div>
          )}
        </div>

        <div
          className={clsx(
            `
              truncate 
              text-sm
              `,
            hasSeen ? "text-gray-500" : "text-black font-medium"
          )}
        >
          {lastMessageText}
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
