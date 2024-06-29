import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { FullConversationType } from "../../interfaces/chat";
import EmptyState from "../empty_state/EmptyState";
import { useParams } from "react-router-dom";
import Header from "./Header";
import CircularProgress from "@mui/material/CircularProgress";
import Body from "./Body";

interface ConservationIdProps {
  conservationId: string;
}

const ConvervationId:React.FC<ConservationIdProps> = ({ conservationId }) => {

  const { data: conversationData, isLoading: conversationIsLoading} = useQuery<any, Error, any>({
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
      {!conversationIsLoading ? <Header conversation={conversationData}/> : <CircularProgress/>}
      <Body />
    </div>
  )
}

export default ConvervationId
