import { ReactNode } from 'react';
import './sidebar.scss'
import DesktopSidebar from './DesktopSidebar';

type SidebarProps = {
  children: ReactNode;
};

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
      <div className="sidebar">
        <DesktopSidebar />
        <main>
          {children}
        </main>
        
      </div>
  );
};


export default Sidebar