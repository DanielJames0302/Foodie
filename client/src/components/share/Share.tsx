import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Share = () => {
  const [file, setFile] = useState<File>();
  const [desc, setDesc] = useState("");

  const upload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log(formData.get("file"));
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost: any) => {
      return makeRequest.post("/posts", newPost);
    },

    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    setFile(selectedFiles?.[0]);
  };

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload(file);
    mutation.mutate({ desc, img: imgUrl });
    console.log(imgUrl);
    setDesc("");
    setFile(undefined);
  };

  return (

        <div className="share">
          <div className="container">
            <div className="top">
              <div className="left">
                <img
                  src={
                    currentUser.profilePic
                      ? "/uploads/" + currentUser.profilePic
                      : `/images/default-user.jpg`
                  }
                  alt=""
                />
                <input
                  type="text"
                  placeholder={`What's on your mind ${currentUser.name}?`}
                  onChange={(e) => setDesc(e.target.value)}
                  value={desc}
                />
              </div>
              <div className="right">
                {file && (
                  <img
                    className="file"
                    alt=""
                    src={URL.createObjectURL(file)}
                  />
                )}
              </div>
            </div>
            <hr />
            <div className="bottom">
              <div className="left">
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={selectFile}
                />
                <label htmlFor="file">
                  <div className="item">
                    <img src={Image} alt="" />
                    <span>Add Image</span>
                  </div>
                </label>
                <div className="item">
                  <img src={Map} alt="" />
                  <span>Add Place</span>
                </div>
                <div className="item">
                  <img src={Friend} alt="" />
                  <span>Tag Friends</span>
                </div>
              </div>
              <div className="right">
                <button onClick={handleClick}>Share</button>
              </div>
            </div>
          </div>
        </div>
 
  );
};

export default Share;
