import axios from "axios";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles for React Quill
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import Loader from "../../components/loader/Loader";

const StoryUpdateForm = () => {
  const [article, setArticle] = useState("");
  const { id } = useParams();
  const { data: story, isLoading } = useGetData(`/story/${id}`);
  const navigate = useNavigate();

  const handleArticleChange = (content) => {
    setArticle(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    try {
      const response = await axios.put(
        `https://test-originale.onrender.com/update/story/${id}`,
        {
          title,
          content: article,
        }
      );

      // Display a success toast message
      toast.success("Story updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000, // Close the toast after 2 seconds
      });
      navigate("/admin");

      // You can redirect or perform any other actions after the toast
    } catch (error) {
      console.error("Error updating story data:", error);

      // Display an error toast message
      toast.error("Failed to update story", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setArticle(story[0]?.content);
    }
  }, [story]);

  if (isLoading) {
    return <Loader />;
  }

  console.log(story);
  return (
    <div className="bg-gray-100 w-full md:w-1/2 mx-auto p-6 rounded-lg shadow-md">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">Update Story</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Story Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={story[0]?.title}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="article"
            className="block text-gray-700 font-bold mb-2"
          >
            Story Article:
          </label>
          <div className="quill-wrapper">
            <ReactQuill
              className="bg-white"
              value={article}
              onChange={handleArticleChange}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"],
                  [{ align: [] }],
                ],
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        >
          Update Story
        </button>
      </form>
    </div>
  );
};

export default StoryUpdateForm;
