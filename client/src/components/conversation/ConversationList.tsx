import React, { useContext, useEffect, useMemo, useState } from "react";
import { FullConversationType } from "../../interfaces/chat"
import useConversation from "../../hooks/useConversation";
import ConversationBox from "./ConversationBox";
import { AuthContext } from "../../context/authContext";
import { pusherClient } from "../../libs/pusher";
import { find } from "lodash";
import { useNavigate } from "react-router-dom";

interface ConversationListProps {
  initialItems: FullConversationType[];
}

const ConversationList: React.FC<ConversationListProps> = ({initialItems}) => {
  const {currentUser} = useContext(AuthContext);
  const [items, setItems] = useState<FullConversationType[]>(initialItems);
  const { conversationId } = useConversation();
  const navigate = useNavigate();
  const pusherKey = useMemo(() => {
    return currentUser.username;
  }, [currentUser.username]);

  useEffect(() => {
    if (!pusherKey) return;
    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current: any) => {
        if (find(current, {id: conversation.ID})) {
          return current;
        
        }

        return [conversation, ...current];
      })
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current: any) => current.map((currentConversation: FullConversationType) => {
        if (currentConversation.ID === Number(conversation.ID)) {
          return {
            ...currentConversation,
            Messages: [conversation.Messages],
          }
        }
        return currentConversation;
      }))
    }

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) =>convo.ID !== conversation.ID)]
      });

      if (Number(conversationId) === conversation.ID) {
        navigate('/conversations');
      }
    }

    pusherClient.bind('conversation:new', newHandler);
    pusherClient.bind('conversation:update', updateHandler);
    pusherClient.bind('conversation:remove', removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('conversation:new', newHandler);
      pusherClient.unbind('conversation:update', updateHandler);
      pusherClient.unbind('conversation:remove', removeHandler)
    }
  }, [pusherKey, conversationId, navigate]);

  return (
    <div className="flex-[3] p-[10px]">
      <h3 className="text-2xl font-bold text-neutral-800">Messages</h3>
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
