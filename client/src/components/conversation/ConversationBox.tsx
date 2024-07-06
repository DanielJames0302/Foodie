import { useCallback, useContext, useMemo } from "react";
import { format } from "date-fns";
import "./ConversationBox.scss";
import { FullConversationType } from "../../interfaces/chat";
import useOtherUser from "../../hooks/useOtherUser";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Avatar from "../avatar/Avatar";
import { ConversationContext } from "../../context/conversationContext";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const { setCurrentChat } = useContext(ConversationContext);
  const { currentUser } = useContext(AuthContext);
  const otherUser = useOtherUser(data);
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    setCurrentChat(data);
    navigate("/conversations/" + data.ID);
  }, [data.ID]);

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
      className={selected ? `conversation-box selected` : `conversation-box`}
      onClick={handleClick}
    >
      <Avatar user={otherUser} />
      <div className="conversation-box-info">
        <div className="conversation-box-info-top">
          <strong>{data.Name || otherUser.name}</strong>
          {lastMessage?.CreatedAt && (
            <div>{format(new Date(lastMessage.CreatedAt), "p")}</div>
          )}
        </div>

        <div
          className={
            hasSeen ? "conversation-box-info-bottom hasSeen" : "conversation-box-info-bottom"
          }
        >
          {lastMessageText}
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
