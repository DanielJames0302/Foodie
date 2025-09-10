import { useMutation } from "@tanstack/react-query";
import { User } from "../../interfaces/user";
import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom";
import Avatar from "../avatar/Avatar";

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const navigate = useNavigate();
  const userBoxMutation = useMutation({
    mutationFn: (data: User) => {
      return makeRequest.post("/conversations", { userId: data.ID });
    },
    onSuccess(data) {
      navigate("/conversations/" + data.data.ID);
    },
  });
  const hanldeClick = () => {
    userBoxMutation.mutate(data);
  };
  return (
    <div
      onClick={hanldeClick}
      className=" 
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          p-2 
          hover:bg-slate-50
          rounded-md
          cursor-pointer"
    >

      <Avatar user={data} />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-800">{data.name || data.username}</span>
        <span className="text-xs text-slate-500">@{data.username}</span>
      </div>
    </div>
  );
};

export default UserBox;
