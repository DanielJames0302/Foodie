import Sidebar from "../../components/sidebar/Sidebar";
import "./ConversationLayout.scss";
import ConversationList from "../../components/conversation/ConversationList";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { FullConversationType } from "../../interfaces/chat";
import CircularProgress from "@mui/material/CircularProgress";
import { ConversationContext, ConversationContextProvider } from "../../context/conversationContext";
import { useContext } from "react";
import ChatBox from "../../components/conversation/ChatBox";


const ConversationLayout = () => {

  const { data, isLoading } = useQuery<any, Error, FullConversationType[]>({
    queryKey: ["conversation"],
    queryFn: () =>
      makeRequest.get("/conversations").then((res) => {
        return res.data as FullConversationType[];
      }),
  });

  return (
    <Sidebar>
      <ConversationContextProvider>
        <div className="conversation-layout">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <ConversationList initialItems={data || []} />
          )}
         
          <ChatBox />

        </div>
      </ConversationContextProvider>
    </Sidebar>
  );
};

export default ConversationLayout;
