import { ReactNode } from "react";
import "./Sidebar.scss";
import DesktopSidebar from "./DesktopSidebar";
interface SidebarProps {
  children: ReactNode;
}


const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
  <div className="sidebar">
    <DesktopSidebar/>
    <div className="message">
      {children}
    </div>

  </div>
)};

export default Sidebar;
