import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CreateBlog = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const response = await fetch("http://localhost:3000/api/blog/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(formData),
          });
          
          if (!response.ok) {
            const text = await response.text(); 
            throw new Error(text || `HTTP error! Status: ${response.status}`);
          }
          
          const text = await response.text();
          const data = text ? JSON.parse(text) : {}; 
          
          navigate("/blogs");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container mx-auto px-4 py-8 max-w-2xl ${darkMode ? "dark" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-lg p-6 ${
          darkMode 
            ? "bg-gray-800 border border-gray-700" 
            : "bg-white shadow-md"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Blog</h1>
          <button 
            onClick={() => navigate("/blog")}
            className={`${
              darkMode 
                ? "text-gray-300 hover:text-white" 
                : "text-gray-600 hover:text-black"
            } transition-colors duration-200`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className={`mb-4 p-3 rounded ${darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-700"}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode 
                  ? "bg-gray-700 border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500" 
                  : "border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } transition-colors duration-200`}
              placeholder="Enter blog title"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block mb-2 font-medium">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={12}
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode 
                  ? "bg-gray-700 border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500" 
                  : "border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } transition-colors duration-200`}
              placeholder="Write your blog content here..."
            />
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg ${
                darkMode 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } transition-colors duration-200 flex items-center`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Publish Blog
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateBlog;