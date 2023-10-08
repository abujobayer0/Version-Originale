// src/components/StoryAddPage.js
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import Loader from "../loader/Loader";
import { toast, ToastContainer } from "react-toastify";

import { Link } from "react-router-dom";

const StoryAddPage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const { data: storiesData, isLoading, refetch } = useGetData("/admin/story");
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleImageUpload = (e) => {
    const uploadedImage = e.target.files[0];
    setImage(uploadedImage);
  };
  if (isLoading) {
    return <Loader />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      if (image) {
        formData.append("file", image);
      }

      await axios.post(
        "https://test-originale.onrender.com/add/story",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Error posting story:", error);
    }
    toast.success("Story Added");
    setCategory("");
    setContent("");
    setTitle("");
    setImage("");
    refetch();
  };
  const stories = (!isLoading && storiesData) || [];
  const handleDeleteStory = (e) => {
    fetch(`https://test-originale.onrender.com/delete/story/${e}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => refetch());
  };

  return (
    <div className="p-4 w-full  bg-gray-50 text-black">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="text-black">
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            placeholder="story title?"
            className="w-full p-2 bg-gray-100 rounded-md"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="text-black">
            Category
          </label>
          <input
            type="text"
            id="category"
            required
            placeholder="story category?"
            className="w-full p-2 bg-gray-100 rounded-md"
            value={category}
            onChange={handleCategoryChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="text-black">
            Content
          </label>
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            className="bg-gray-100 p-4 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="text-black">
            Image
          </label>
          <input
            type="file"
            id="image"
            required
            accept="image/*"
            className="text-black"
            onChange={handleImageUpload}
          />
        </div>
        <button
          type="submit"
          className="bg-[#839f9099] text-white hover:bg-opacity-90 px-4 py-2 rounded-md"
        >
          Add Story
        </button>
      </form>

      <div className="bg-gray-100 px-10 mt-10">
        <table className="table-auto w-full justify-center items-center">
          <thead>
            <tr>
              <th className="px-2">Title</th>
              <th className="px-2">Image</th>
              <th className="px-2">Month</th>
              <th className="px-2">Year</th>
              <th className="px-2">Delete</th>
              <th className="px-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {stories?.map((story) => (
              <tr key={story._id}>
                <td className="pl-16">{story.title}</td>
                <td className="pl-16">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-10 h-10 object-cover"
                  />
                </td>
                <td className="pl-16">{story.month}</td>
                <td className="pl-16">{story.year}</td>
                <td className="pl-16">
                  <button
                    onClick={() => handleDeleteStory(story._id)}
                    className="bg-red-600 text-white p-2"
                  >
                    Delete
                  </button>
                </td>
                <td className="pl-16">
                  <Link
                    to={`/admin/story/update/${story._id}`}
                    className="bg-blue-600 text-white p-2"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoryAddPage;
