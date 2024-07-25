import { useContext, useState } from "react";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { AuthContext } from "../../context/authContext";
import { triggerErrorMessage } from "../../utils/locals";

interface Props {
  user: any;
  setOpenUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  openUpdate: boolean;
}

const Update = ({ openUpdate, setOpenUpdate, user }: Props) => {
  const { currentUser } = useContext(AuthContext);
  const [cover, setCover] = useState<File>();
  const [profile, setProfile] = useState<File>();
  const [texts, setTexts] = useState({
    email: user?.email,
    password: user?.password,
    name: user?.name,
    city: user?.city,
    website: user?.website,
  });


  const selectCoverFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    setCover(selectedFiles?.[0]);
  };

  const selectProfileFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    setProfile(selectedFiles?.[0]);
  };
  const upload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      triggerErrorMessage()
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user: any) => {
      return makeRequest.put("/users", user);
    },

    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["user", currentUser.ID] });
    },
  });

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;
    coverUrl = cover ? await upload(cover) : user?.coverPic;
    profileUrl = profile ? await upload(profile) : user?.profilePic;
    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
    setCover(undefined);
    setProfile(undefined);
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen  flex items-center justify-center z-50">
      <div className="m-auto w-2/4 h-3/4 bg-white p-[50px] z-40 flex flex-col gap-[20px] shadow-xl relative mobile:w-full mobile:h-full ">
        <h1 className="font-light mobile:text-sm">Update Your Profile</h1>
        <form className="flex flex-col gap-[5px] h-1/4">
          <div className="flex flex-wrap gap-[50px]">
            <label className="flex flex-col gap-[10px] text-black text-lg"  htmlFor="cover">
              <span>Cover Picture</span>
              <div className="relative ">
                <img
                  className="w-[100px] h-[100px] object-cover"
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : "/uploads/" + user?.coverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="absolute top-0 bottom-0 left-0 right-0 m-auto text-2xl font-light cursor-pointer" />
              </div>
            </label>
            <input
              className="p-[5px] border-none border-b-black font-light bg-transparent"
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={selectCoverFile}
            />
            <label className="flex flex-col gap-[10px] text-black text-lg"  htmlFor="profile">
              <span>Profile Picture</span>
              <div className="relative">
                <img
                 className="w-[100px] h-[100px] object-cover"
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : "/uploads/" + user?.profilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="absolute top-0 bottom-0 left-0 right-0 m-auto text-2xl font-light cursor-pointer" />
              </div>
            </label>
            <input
              className="p-[5px] border-none border-b-black text-black bg-transparent"
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={selectProfileFile}
            />
          </div>
          <label className="flex flex-col gap-[10px] text-black text-lg"  >Email</label>
          <input
            className="p-[5px] border-none border-b-black text-black bg-transparent"
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label className="flex flex-col gap-[10px] text-black text-lg"  >Password</label>
          <input
            className="p-[5px] border-none border-b-black text-black bg-transparent"
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label className="flex flex-col gap-[10px] text-black text-lg"  >Name</label>
          <input
            className="p-[5px] border-none border-b-black text-black bg-transparent"
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label className="flex flex-col gap-[10px] text-black text-lg"  >Country / City</label>
          <input
            className="p-[5px] border-none border-b-black text-black bg-transparent"
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />

          <button className="border-none p-[10px] cursor-pointer text-white bg-blue-400" onClick={handleClick}>Update</button>
        </form>
        <button className="absolute top-[10px] right-[20px] border-none bg-red-500 p-[5px] cursor-pointer text-white" onClick={() => setOpenUpdate(false)}>
          X
        </button>
      </div>
    </div>
  );
};

export default Update;
