import { ReactNode } from "react";
import DesktopSidebar from "./DesktopSidebar";
interface SidebarProps {
  children: ReactNode;
}


const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
  <div className="sidebar flex p-[5px] h-[calc(100vh - 70px)]">
    <DesktopSidebar/>
    <div className="flex-[8] mobile:p-[10px] tablet:p-[20px]">
      {children}
    </div>

  </div>
)};

export default Sidebar;
