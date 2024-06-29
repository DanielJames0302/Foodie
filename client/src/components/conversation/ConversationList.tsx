import React, { useEffect, useState } from "react";
import { FullConversationType } from "../../interfaces/chat"
import useConversation from "../../hooks/useConversation";
import ConversationBox from "./ConversationBox";
import "./ConversationList.scss"

interface ConversationListProps {
  initialItems: FullConversationType[];
}

const ConversationList: React.FC<ConversationListProps> = ({initialItems}) => {
  const [items, setItems] = useState<FullConversationType[]>(initialItems);
  const { conversationId, isOpen} = useConversation();
  
  return (
    <div className="conversation-list">
      <h3>Messages</h3>
      {items?.map((item: FullConversationType, id: number) => (
        <ConversationBox
          key={id}
          data={item}
          selected={conversationId === item.ID.toString()}
        />
      ))}
    </div>
  )
}

export default ConversationList
