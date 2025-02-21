import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Blogs = ({ darkMode }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/blog/all", {
          credentials: "include",
        });
          const data = await response.json();
          setBlogs(data.blogs);
        
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleCreateBlog = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/create-blog");
    }
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${darkMode ? "dark" : ""}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Latest Blogs</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateBlog}
          className={`px-4 py-2 rounded-lg ${
            darkMode 
              ? "bg-purple-600 hover:bg-purple-700 text-white" 
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          } transition-colors duration-200 flex items-center`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Blog
        </motion.button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? "border-purple-500" : "border-indigo-500"}`}></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl mb-4">No blogs yet!</h2>
          <p className="mb-6">Be the first to share your thoughts.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateBlog}
            className={`px-4 py-2 rounded-lg ${
              darkMode 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            } transition-colors duration-200`}
          >
            Create Blog
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(`/blogs/${blog._id}`)}
              className={`cursor-pointer rounded-lg overflow-hidden ${
                darkMode 
                  ? "bg-gray-800 hover:bg-gray-750 border border-gray-700" 
                  : "bg-white hover:bg-gray-50 shadow-md"
              }`}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h2>
                <p className={`mb-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                  By {blog.author?.username || "Anonymous"} · {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <p className={`line-clamp-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {blog.content}
                </p>
                <div className="mt-4 flex justify-end">
                  <span className={`text-sm ${darkMode ? "text-purple-400" : "text-indigo-500"}`}>
                    Read more →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;