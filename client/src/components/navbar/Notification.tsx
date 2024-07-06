import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";

const Notification = () => {
  const { currentUser } = useContext(AuthContext);
  const { data: notifications, isLoading } = useQuery<any, Error, any>({
    queryKey: ["notifications", currentUser.ID],
    queryFn: async () => {
      return await makeRequest.get("/notifications").then((res) => {
        return res.data;
      });
    },
  });

  const { data: seenNotifications, isLoading: sIsLoading } = useQuery<
    any,
    Error,
    any
  >({
    queryKey: ["seenNotifications", currentUser.ID],
    queryFn: async () => {
      return await makeRequest.get("/notifications/seen").then((res) => {
        return res.data;
      });
    },
  });

  const queryClient = useQueryClient();
  const notificationMutation = useMutation({
    mutationFn: async () => {
      return await makeRequest.post("/notifications/seen");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seenNotifications", currentUser.ID],
      });
    },
  });
 
  const popover = (

    <Popover id="popover-basic">
      <Popover.Header as="h3">You notifications</Popover.Header>
      <Popover.Body>
        <div className="flex flex-col gap-2">
        {notifications?.map((item: any) => (
          <div className="hover:bg-slate-300 p-2 rounded-lg">
            {item.Notification}
          </div>
        ))}
        </div>
       
      </Popover.Body>
    </Popover>
  );
  const handleClickNotification = () => {
    notificationMutation.mutate();
  }
  console.log(notifications)
  return (
    <div className="relative" onClick={handleClickNotification}>
      <OverlayTrigger placement={"bottom-start"} overlay={popover} trigger="click">
          <NotificationsOutlinedIcon className="cursor-pointer" />
      </OverlayTrigger>
      {!sIsLoading && seenNotifications.length >0 &&  <div className="bg-red-500 rounded-full h-5 w-5 text-sm flex items-center justify-center absolute top-0 -right-2">
          {seenNotifications.length}
      </div>}
    </div>
  );
};

export default Notification;
