import { format } from "date-fns";
import useOtherUser from "../../hooks/useOtherUser";
import { FullConversationType } from "../../interfaces/chat";
import { Fragment, useMemo } from "react";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: FullConversationType
}

const ProfileDrawer:React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const otherUser = useOtherUser(data);

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.CreatedAt),'PP');
  }, [otherUser.CreatedAt]);

  const title = useMemo(() => {
    return data.Name || otherUser.name
  }, [data.Name, otherUser.name]);

  const statusText = useMemo(() => {
    return 'Active';
  },[data])
  return (
    <Transition show={isOpen} as = {Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild 
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div>

          </div>

        </TransitionChild>
        <div>
          
        </div>

      </Dialog>
    </Transition>
  )
}

export default ProfileDrawer
