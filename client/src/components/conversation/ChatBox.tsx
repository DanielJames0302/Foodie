
import ConservationId from "./ConvervationId";
import useConversation from "../../hooks/useConversation";
import './ChatBox.scss';

const ChatBox = () => {
  const { conversationId } = useConversation()
  
  return (
    <div className="chatbox">
          {conversationId ? (
            <ConservationId conversationId = {conversationId} />
          ) : (
            <span className="chatbox-prompt-text">
            Open a conversation to start a chat.
          </span>
          )}
     
    </div>
  )
}

export default ChatBox
