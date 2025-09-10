import useRoutes from "../../hooks/useRoutes";
import DesktopItem from "./DesktopItem";

const DesktopSidebar = () => {
  const routes = useRoutes();
  return (
    <div className="w-[100px] pl-[20px] pr-[20px] bg-white border-r-gray-100 pb-[20px] flex flex-col justify-between items-center">
        <nav className="mt-4 flex flex-col justify-between">
          <div>
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
