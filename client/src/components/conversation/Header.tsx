import { Link } from "react-router-dom";
import useOtherUser from "../../hooks/useOtherUser"
import { FullConversationType } from "../../interfaces/chat";
import "./Header.scss"
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Avatar from "../avatar/Avatar";
import { useState } from "react";
import ProfileDrawer from "./ProfileDrawer";


interface HeaderProps {
  conversation: FullConversationType
}
const Header: React.FC<HeaderProps> = ({conversation}) => {
 const otherUser = useOtherUser(conversation);
  const statusText = 'Active';
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  if (otherUser === undefined) {
    return <div></div>
  }


  return (
    <>
    <ProfileDrawer
      data={conversation}
      isOpen={isOpenDrawer}
      onClose={() => setIsOpenDrawer(false)}
    />
    <div className="header">
      <div className="back-button">
        <Link to={'/conversations'}>
                <HiChevronLeft size={32}/>

        </Link>
        <Avatar user={otherUser} />
        <div className="header-info">
            <div className="header-info-name">
              {conversation.Name ? conversation.Name : otherUser.name}
            </div>
            <div className="header-info-status">
              {statusText}
            </div>
        </div>
      </div>
      <HiEllipsisHorizontal
        size={32}
        className="options-icon"
        onClick={() => setIsOpenDrawer(true)}
      />
    </div>
    </>
  )
}

export default Header
