import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { HiChat } from "react-icons/hi"
import {
  HiArrowLeftOnRectangle,
  HiUsers
} from "react-icons/hi2"

import useConversation from "./useConversation";

const useRoutes = () => {
  const pathname = useLocation().pathname;
  const { conversationId } = useConversation()

  const routes = useMemo(() => [
    {
      label: 'Chat',
      href: '/conversations',
      icon: HiChat,
      active: pathname === '/conversations' || !!conversationId
    },
    {
      label: 'UsersMessages',
      href: '/users_messages',
      icon: HiUsers,
      active: pathname === '/users_messages'
    },
    {
      label: 'Logout',
      href: '#',
      onClick:() => {},
      icon: HiArrowLeftOnRectangle
    }
  ], [pathname, conversationId]);

  return routes;
}

export default useRoutes;