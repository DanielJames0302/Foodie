import { useState } from "react"
import "./desktop-sidebar.scss"
import useRoutes from "../../hooks/useRoutes";
import DesktopItem from "./DesktopItem";

const DesktopSidebar = () => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="desktop-sidebar">
        <nav>
          <ul
            role="list"
          >
            {
              routes.map((item) => (
                <DesktopItem 
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={item.active}
                  onClick={item.onClick}
                />
              ))
            }

          </ul>
        </nav>
    </div>
  )
}

export default DesktopSidebar
