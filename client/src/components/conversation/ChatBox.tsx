
import ConservationId from "./ConvervationId";
import useConversation from "../../hooks/useConversation";

const ChatBox = () => {
  const { conversationId } = useConversation()
  
  return (
    <div className="flex-[9] relative h-full">
          {conversationId ? (
            <ConservationId conversationId = {conversationId} />
          ) : (
            <span className="absolute top-1/4 left-1/4 text-2xl text-gray-200 cursor-default">
            Open a conversation to start a chat.
          </span>
          )}
     
    </div>
  )
}

export default ChatBox
