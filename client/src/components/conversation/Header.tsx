import { Link } from "react-router-dom";
import useOtherUser from "../../hooks/useOtherUser";
import { FullConversationType } from "../../interfaces/chat";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Avatar from "../avatar/Avatar";
import { useMemo, useState } from "react";
import ProfileDrawer from "./ProfileDrawer";
import useActiveList from "../../hooks/useActiveList";

interface HeaderProps {
  conversation: FullConversationType;
}
const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const { members } = useActiveList();
  console.log(members);
  const isActive = members.indexOf(otherUser.username) !== -1;
  const statusText = useMemo(() => {
    return isActive ? "Active" : "Offline";
  }, [isActive]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
      />
      <div
        className=" bg-white 
        w-full 
        flex 
        border-b-[1px] 
        sm:px-4 
        py-3 
        px-4 
        lg:px-6 
        justify-between 
        items-center 
        shadow-sm"
      >
        <div className="flex gap-3 items-center">
          <Link
            className="
            lg:hidden 
            block 
            text-sky-500 
            hover:text-sky-600 
            transition 
            cursor-pointer
          "
            to={"/conversations"}
          >
            <HiChevronLeft size={32} />
          </Link>
          <Avatar user={otherUser} />
          <div className="flex flex-co">
            <div className="header-info-name">
              {conversation.Name ? conversation.Name : otherUser.name}
            </div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          className="   
          text-sky-500
          cursor-pointer
          hover:text-sky-600
          transition
        "
          onClick={() => setIsOpenDrawer(true)}
        />
      </div>
    </>
  );
};

export default Header;
