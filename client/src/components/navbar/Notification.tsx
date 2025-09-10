import { useState, useRef, useEffect } from "react";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import moment from "moment";

interface Notification {
  ID: number;
  Notification: string;
  CreatedAt: string;
  IsSeen: boolean;
  Type: string;
  User?: {
    ID: number;
    name: string;
    profilePic: string;
  };
}

const Notification = () => {
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notifications, isLoading } = useQuery<Notification[], Error, Notification[]>({
    queryKey: ["notifications", currentUser.ID],
    queryFn: async () => {
      return await makeRequest.get("/notifications").then((res) => {
        return res.data;
      });
    },
  });

  const { data: unseenCount, isLoading: sIsLoading } = useQuery<
    number,
    Error,
    number
  >({
    queryKey: ["seenNotifications", currentUser.ID],
    queryFn: async () => {
      return await makeRequest.get("/notifications/seen").then((res) => {
        return res.data?.length || 0;
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
      queryClient.invalidateQueries({
        queryKey: ["notifications", currentUser.ID],
      });
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickNotification = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unseenCount && unseenCount > 0) {
      notificationMutation.mutate();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👥';
      case 'friend_request':
        return '👋';
      default:
        return '🔔';
    }
  };

  const formatNotificationText = (notification: Notification) => {
    // Simple text formatting - you can enhance this based on your notification structure
    return notification.Notification;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleClickNotification}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {unseenCount && unseenCount > 0 ? (
          <NotificationsIcon className="text-gray-700" />
        ) : (
          <NotificationsOutlinedIcon className="text-gray-700" />
        )}
        
        {/* Notification badge */}
        {!sIsLoading && unseenCount && unseenCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unseenCount > 99 ? '99+' : unseenCount}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              {unseenCount && unseenCount > 0 && (
                <span className="text-sm text-gray-500">
                  {unseenCount} new
                </span>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Loading...</span>
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.slice(0, 10).map((notification, index) => (
                  <div
                    key={notification.ID}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                      !notification.IsSeen ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Notification Icon */}
                      <div className="flex-shrink-0 mt-1">
                        <span className="text-lg">
                          {getNotificationIcon(notification.Type)}
                        </span>
                      </div>
                      
                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 leading-relaxed">
                          {formatNotificationText(notification)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {moment(notification.CreatedAt).fromNow()}
                        </p>
                      </div>
                      
                      {/* Unread indicator */}
                      {!notification.IsSeen && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-gray-500 text-sm">No notifications yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  We'll notify you when something happens
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications && notifications.length > 10 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
