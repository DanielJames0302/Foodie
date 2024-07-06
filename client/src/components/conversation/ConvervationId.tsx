import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { FullConversationType } from "../../interfaces/chat";
import EmptyState from "../empty_state/EmptyState";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import CircularProgress from "@mui/material/CircularProgress";
import Body from "./Body";
import Form from "./Form";
import './ConversationId.scss'
import { useEffect } from "react";
import { pusherClient } from "../../libs/pusher";

interface ConservationIdProps {
  conversationId: string;
}

const ConvervationId:React.FC<ConservationIdProps> = ({ conversationId }) => {
  const navigate = useNavigate();


  const { data: conversationData, isLoading: conversationIsLoading} = useQuery<FullConversationType, Error, FullConversationType>({
    queryKey: ["conversation", conversationId],
    queryFn:  () => makeRequest.get("/conversations/" + conversationId).then((res) => {
        return res.data as FullConversationType;
      }),
  })

  const { data: messageData, isLoading: messageIsLoading} = useQuery<any, Error, any>({
    queryKey: ["mesasge", conversationId],
    queryFn: () => makeRequest.get("/messages/" + conversationId).then((res) => {
      return res.data as FullConversationType;
    }),
  })
  useEffect(() => {
    if (conversationData === undefined) {
      navigate('/conversations'); 
    }
  }, [conversationData]);

  if (conversationData === undefined) {
    return null; 
  }

 
  return (
    <div className="conversationId">
      {!conversationIsLoading && conversationData !== undefined ? <Header conversation={conversationData}/> : <CircularProgress/>}
      {!messageIsLoading ? <Body initialMessages={messageData}/> : <CircularProgress />}
      <Form />
    </div>
  )
}

export default ConvervationId
