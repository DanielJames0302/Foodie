import "./share.scss";
import Image from "../../assets/img.png";
import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import axios from "axios";
import { categories } from "../../utils/data";


const Share = () => {
  const [postData, setPostData] = useState({
    title: "",
    desc: "",
    vidUrl: "",
    imgUrl: "",
    calories: 0,
    category: "",
    type: "",
  });
  const [file, setFile] = useState<File>();
  const [error, setError] = useState<string>("");

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "postfood");
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dgkyhspuf/upload",
        formData
      );
      return response.data.public_id;
    } catch (err) {
      console.log(err);
    }
  };


  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost: any) => {
      console.log(newPost)
      return makeRequest.post("/posts", newPost);
    },

    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const selectFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    console.log(selectedFiles)
    setFile(selectedFiles?.[0]);
  },[]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setPostData((prev) => {
      return {
        ...prev,
        [name]: name === 'calories'? Number(value) : value,
      };
    });
  }, [])

  const handleSubmit = useCallback( async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (postData.type === "") {
      setError("Please choose a post type");
      return;
    }
    if (postData.type === "Recipe" && postData.category === "") {
      setError("Pleaase choose food category");
      return;
    }
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await uploadImage(file);
    console.log(imgUrl)
    mutation.mutate({ ...postData, imgUrl: imgUrl });
    console.log(imgUrl);
    setFile(undefined)
    window.location.reload()
  }, [file, mutation, postData])

  return (
    <div className="h-full p-2 flex justify-center">
      <div className="flex flex-col items-center justify-center p-2 w-2/4 bg-green-100 rounded-md gap-3 h-auto">
        <div className="flex-2 w-3/4">
          <h3 className="text-black text-xl mb-2">Share your thoughts</h3>
          <div className="flex flex-col gap-2">
            <p>Post type</p>
            <select
              className="bg-gray-50 border border-gray-300 focus:outline-blue-500 rounded-md p-2.5"
              name="type"
              onChange={handleInputChange}
            >
              <option value="">Post type</option>
              <option value="Review">Review</option>
              <option value="Recipe">Recipe</option>
            </select>

            <div className="flex flex-col">
              <p>Title</p>
              <input
                className="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring focus:border focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                value={postData.title}
                name="title"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col h-36">
              <p>Decription</p>
              <textarea className="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring focus:border focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="desc" value={postData.desc} onChange={handleInputChange}></textarea>
            </div>
            {postData.type === "Recipe" && (
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <p>Category</p>
                  <select
                    value={postData.category}
                    onChange={handleInputChange}
                    className="h-10 mt-2 rounded-md focus:outline-green-300"
                    name="category"
                  >
                    <option value="">Category</option>
                    {categories.map((category) => (
                      <option value={`${category.name}`}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <p>Calories</p>
                  <input
                    className="h-10 mt-2 rounded-md focus:ring focus:ring-green-300 focus:outline-none ps-2 "
                    type="number"
                    value={postData.calories}
                    name="calories"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <hr />
        <div className="flex flex-col justify-between">
          <div className="flex flex-col items-center justify-between gap-3">
            {file && (
              <img
                className="h-20 w-20"
                src={URL.createObjectURL(file)}
                alt=""
              />
            )}
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={selectFile}
            />
            <label htmlFor="file">
              <div className="flex flex-col items-center">
                <img src={Image} alt="" />
                <strong>Add Image</strong>
              </div>
            </label>

            <p className="text-red-400">{error}</p>
          </div>
          <button
            type="submit"
            className="btn font-bold bg-blue-100 hover:bg-blue-50 text-blue-400 p-2 round-md"
            onClick={handleSubmit}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default Share;
