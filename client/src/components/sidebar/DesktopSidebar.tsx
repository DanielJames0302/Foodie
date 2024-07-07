import "./desktop-sidebar.scss"
import useRoutes from "../../hooks/useRoutes";
import DesktopItem from "./DesktopItem";



const DesktopSidebar = () => {
  const routes = useRoutes();
  return (
    <div className="desktop-sidebar">
        <nav>
          <div
          
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

          </div>
        </nav>
    </div>
  )
}

export default DesktopSidebar
