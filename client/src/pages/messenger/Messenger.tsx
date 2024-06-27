
import "./messenger.scss";
import EmptyState from "../../components/empty_state/EmptyState";
import Sidebar from "../../components/sidebar/Sidebar";


const Messenger = () => {
  return (
  
    <Sidebar>
      <div className="messenger">
        <EmptyState />
      </div>
    </Sidebar>
    
  )
}

export default Messenger
