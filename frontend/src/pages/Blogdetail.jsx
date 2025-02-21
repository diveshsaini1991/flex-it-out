import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BlogDetail = ({ darkMode }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/blog/${id}`, {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }
        
        const data = await response.json();
        setBlog(data.blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? "border-purple-500" : "border-indigo-500"}`}></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={`container mx-auto px-4 py-16 text-center ${darkMode ? "dark" : ""}`}>
        <h1 className="text-2xl mb-4">Blog not found</h1>
        <button 
          onClick={() => navigate("/blogs")}
          className={`px-4 py-2 rounded-lg ${
            darkMode 
              ? "bg-purple-600 hover:bg-purple-700 text-white" 
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          } transition-colors duration-200`}
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`container mx-auto px-4 py-8 max-w-3xl ${darkMode ? "dark" : ""}`}
    >
      <button 
        onClick={() => navigate("/blogs")}
        className={`mb-6 flex items-center ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors duration-200`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blogs
      </button>
      
      <article>
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className={`flex items-center mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          <div className={`mr-2 h-10 w-10 rounded-full flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
            {blog.author?.username?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <p>By {blog.author?.username || "Anonymous"}</p>
            <p className="text-sm">{new Date(blog.createdAt).toLocaleDateString()} • {new Date(blog.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>
        
        <div className={`prose max-w-none ${darkMode ? "prose-invert" : ""}`}>
          {blog.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </article>
    </motion.div>
  );
};

export default BlogDetail;