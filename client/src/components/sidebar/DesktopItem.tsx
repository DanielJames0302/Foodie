import { Link } from "react-router-dom";
import './desktop-item.scss'

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
        <Link className={active ? "desktop-item-link active" : "desktop-item-link"} to={href}>
          <Icon className="icon-image"/>
        </Link>
    </div>
  )
}

export default DesktopItem
