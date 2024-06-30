import { useRef, useState } from 'react'
import { FullMessageType } from '../../interfaces/chat'
import './Body.scss'
import useConversation from '../../hooks/useConversation'
import MessageBox from './MessageBox'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../axios'

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({initialMessages}) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();
  const { data, isLoading} = useQuery<any, Error, any>({
    queryKey: ["conversation_seen", conversationId],
    queryFn: () => {
      return makeRequest.post(`/conversations/${conversationId}/seen`)
    }
  })

  return (
    <div className="body">
      {messages.map((message,id) => (
        <MessageBox
          isLast = {id === messages.length - 1}
          key={id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className=''></div>
    </div>
  )
}

export default Body
