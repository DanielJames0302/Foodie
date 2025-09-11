import { ReactNode } from "react";
import DesktopSidebar from "./DesktopSidebar";
interface SidebarProps {
  children: ReactNode;
}


const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
  <div className="flex flex-row h-full w-full overflow-hidden">
    <DesktopSidebar/>
    <div className="flex-[8] h-full w-full mobile:p-[10px] tablet:p-[20px]">
      {children}
    </div>

  </div>
)};

export default Sidebar;
