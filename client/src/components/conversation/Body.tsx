import { useEffect, useRef, useState } from 'react'
import { FullMessageType } from '../../interfaces/chat'
import useConversation from '../../hooks/useConversation'
import MessageBox from './MessageBox'
import { makeRequest } from '../../axios'
import { pusherClient } from '../../libs/pusher'
import {find} from 'lodash'

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({initialMessages}) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();
  useEffect(() => {
    makeRequest.post(`/conversations/${conversationId}/seen`);
  }, [conversationId]);


 

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      makeRequest.post(`/conversations/${conversationId}/seen`);
      setMessages((current:any) => {
        if (find(current, { id: message.ID})) {
          return current;
        }

        return [...current, message];
      })
      bottomRef.current?.scrollIntoView();
    }

    const updateMessageHandler = (newMessaage: FullMessageType) => {
      setMessages((current: any) => current.map((currentMessage: any)=> {
        if (currentMessage.ID === newMessaage.ID) {
          return newMessaage;
        }

        return currentMessage;
      }))
    };
    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    }
  }, [conversationId]);

  return (
    <div className="h-full">
      {messages.map((message,id) => (
        <MessageBox
          isLast = {id === messages.length - 1}
          key={id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className='pt-24'></div>
    </div>
  )
}

export default Body
