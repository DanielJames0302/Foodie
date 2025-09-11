
import ConservationId from "./ConvervationId";
import useConversation from "../../hooks/useConversation";

const ChatBox = () => {
  const { conversationId } = useConversation()
  
  return (
    <div className="flex-[9] h-full flex flex-col overflow-hidden">
          {conversationId ? (
            <ConservationId conversationId = {conversationId} />
          ) : (
            <div className="flex-1 flex items-center justify-center w-full">
              <span className="text-2xl text-gray-200 cursor-default">
                Open a conversation to start a chat.
              </span>
            </div>
          )}
     
    </div>
  )
}

export default ChatBox
