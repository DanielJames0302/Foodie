import { useContext } from "react"
import { ConversationContext } from "../../context/conversationContext"
import ConvervationId from "./ConvervationId";
import { useParams } from "react-router-dom";
import ConservationId from "./ConvervationId";
import useConversation from "../../hooks/useConversation";


const ChatBox = () => {
  const { conversationId } = useConversation()
  
  return (
    <div className="chatbox">
      {conversationId ? (
        <ConservationId conservationId = {conversationId} />
      ) : (
        <span className="noConversationText">
        Open a conversation to start a chat.
      </span>
      )}
    </div>
  )
}

export default ChatBox
