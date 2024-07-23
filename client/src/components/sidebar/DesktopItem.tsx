import { Link } from "react-router-dom";
import clsx from "clsx";

interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}
const DesktopItem:React.FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  }
  return (
    <div onClick={handleClick}>
        <Link className={clsx(`
            group 
            flex 
            gap-x-3 
            rounded-md 
            p-3 
            text-sm 
            leading-6 
            font-semibold 
            text-gray-500 
            hover:text-black 
            hover:bg-gray-100
          `,
            active && 'bg-gray-100 text-black'
          )} to={href}>
          <Icon className="h-[15px] w-[15px]"/>
        </Link>
    </div>
  )
}

export default DesktopItem
