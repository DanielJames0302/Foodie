import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { FullConversationType } from "../../interfaces/chat";
import EmptyState from "../empty_state/EmptyState";
import { useParams } from "react-router-dom";
import Header from "./Header";
import CircularProgress from "@mui/material/CircularProgress";
import Body from "./Body";
import Form from "./Form";
import './ConversationId.scss'

interface ConservationIdProps {
  conservationId: string;
}

const ConvervationId:React.FC<ConservationIdProps> = ({ conservationId }) => {

  const { data: conversationData, isLoading: conversationIsLoading} = useQuery<FullConversationType, Error, FullConversationType>({
    queryKey: ["conversation", conservationId],
    queryFn:  () => makeRequest.get("/conversations/" + conservationId).then((res) => {
        return res.data as FullConversationType;
      }),
  })

  const { data: messageData, isLoading: messageIsLoading} = useQuery<any, Error, any>({
    queryKey: ["mesasge", conservationId],
    queryFn: () => makeRequest.get("/messages/" + conservationId).then((res) => {
      return res.data as FullConversationType;
    }),
  })

  return (
    <div className="conversationId">
      {!conversationIsLoading && conversationData !== undefined ? <Header conversation={conversationData}/> : <CircularProgress/>}
      {!messageIsLoading ? <Body initialMessages={messageData}/> : <CircularProgress />}
      <Form />
    </div>
  )
}

export default ConvervationId
