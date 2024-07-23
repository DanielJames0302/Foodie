import Sidebar from "../../components/sidebar/Sidebar";
import ConversationList from "../../components/conversation/ConversationList";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { FullConversationType } from "../../interfaces/chat";
import CircularProgress from "@mui/material/CircularProgress";


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
    
        <div className="h-full ml-[10px] flex">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <ConversationList initialItems={data || []} />
          )}
         
          <ChatBox />

        </div>
    
    </Sidebar>
  );
};

export default ConversationLayout;
