import { Link } from "react-router-dom";
import useOtherUser from "../../hooks/useOtherUser"
import { FullConversationType } from "../../interfaces/chat";
import "./Header.scss"
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Avatar from "../avatar/Avatar";


interface HeaderProps {
  conversation: FullConversationType
}
const Header: React.FC<HeaderProps> = ({conversation}) => {
 const otherUser = useOtherUser(conversation);
  const statusText = 'Active';

  if (otherUser === undefined) {
    return <div></div>
  }


  return (
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
        onClick={() => {}}
      />
    </div>
  )
}

export default Header
