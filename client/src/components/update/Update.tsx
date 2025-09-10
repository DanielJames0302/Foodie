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
    password: "",
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
    const payload: any = { ...texts, coverPic: coverUrl, profilePic: profileUrl };
    if (!payload.password) {
      delete payload.password;
    }
    mutation.mutate(payload);
    setOpenUpdate(false);
    setCover(undefined);
    setProfile(undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
        <h1 className="mb-4 text-lg font-semibold text-slate-800">Update your profile</h1>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 text-sm" htmlFor="cover">
              <span className="text-slate-600">Cover picture</span>
              <div className="relative overflow-hidden rounded-md border">
                <img
                  className="h-24 w-full object-cover"
                  src={cover ? URL.createObjectURL(cover) : (user?.coverPic ? "/uploads/" + user?.coverPic : "/images/default-cover.png")}
                  alt="cover"
                />
                <CloudUploadIcon className="absolute right-2 top-2 cursor-pointer text-slate-600" />
              </div>
            </label>
            <input className="hidden" type="file" id="cover" onChange={selectCoverFile} />

            <label className="flex flex-col gap-2 text-sm" htmlFor="profile">
              <span className="text-slate-600">Profile picture</span>
              <div className="relative flex items-center gap-3 rounded-md border p-2">
                <img
                  className="h-16 w-16 rounded-md object-cover"
                  src={profile ? URL.createObjectURL(profile) : (user?.profilePic ? "/uploads/" + user?.profilePic : "/images/default-user.jpg")}
                  alt="profile"
                />
                <CloudUploadIcon className="cursor-pointer text-slate-600" />
              </div>
            </label>
            <input className="hidden" type="file" id="profile" onChange={selectProfileFile} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
            <input
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              type="email"
              value={texts.email}
              name="email"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Password</label>
            <input
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              type="password"
              placeholder="Leave blank to keep current password"
              value={texts.password}
              name="password"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Name</label>
            <input
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              type="text"
              value={texts.name}
              name="name"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Country / City</label>
            <input
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              type="text"
              name="city"
              value={texts.city}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="rounded-md border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={() => setOpenUpdate(false)}>
              Cancel
            </button>
            <button className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600" onClick={handleClick}>Update</button>
          </div>
        </form>
        <button className="absolute right-3 top-3 rounded-md p-1 text-slate-500 hover:bg-slate-100" onClick={() => setOpenUpdate(false)}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Update;
