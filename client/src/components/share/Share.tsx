import Image from "../../assets/img.png";
import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import axios from "axios";
import { categories } from "../../utils/data";
import { triggerErrorMessage } from "../../utils/locals";


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
      triggerErrorMessage()
    }
  };


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

  const selectFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
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
    if (error) setError("");
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
    mutation.mutate({ ...postData, imgUrl: imgUrl });
    setFile(undefined)
    window.location.reload()
  }, [file, mutation, postData])

  return (
    <div className="h-full p-4 flex justify-center">
      <div className="w-full max-w-2xl rounded-lg border bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Share your thoughts</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">Post type</label>
              <select
                className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                name="type"
                value={postData.type}
                onChange={handleInputChange}
              >
                <option value="">Select type</option>
                <option value="Review">Review</option>
                <option value="Recipe">Recipe</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600">Title</label>
              <input
                className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                type="text"
                placeholder="Give your post a title"
                value={postData.title}
                name="title"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
            <textarea
              className="h-28 w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              name="desc"
              placeholder="Share details..."
              value={postData.desc}
              onChange={handleInputChange}
            />
          </div>

          {postData.type === "Recipe" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Category</label>
                <select
                  value={postData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  name="category"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option value={`${category.name}`}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Calories</label>
                <input
                  className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  type="number"
                  placeholder="e.g. 250"
                  value={postData.calories}
                  name="calories"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-600">Image</label>
            <div className="rounded-md border-2 border-dashed border-slate-300 p-4 text-center hover:border-slate-400">
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <img className="h-32 w-32 rounded-md object-cover" src={URL.createObjectURL(file)} alt="preview" />
                  <span className="text-xs text-slate-500">{file.name}</span>
                </div>
              ) : (
                <label htmlFor="file" className="mx-auto flex cursor-pointer flex-col items-center gap-1 text-slate-500">
                  <img src={Image} alt="" />
                  <strong className="text-sm">Add Image</strong>
                  <span className="text-xs">PNG, JPG, GIF up to 5MB</span>
                </label>
              )}
              <input type="file" id="file" accept="image/*" style={{ display: "none" }} onChange={selectFile} />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleSubmit}
            >
              {mutation.isPending ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
