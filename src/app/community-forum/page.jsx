'use client'
import { getPosts } from "@/lib/class/class";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      // Filter only active posts
      const activePosts = response.filter(
        (post) => post.status === "active",
      );
      setPosts(activePosts);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching forum posts:", error);
    } finally {
      loading(false);
    }
  };

  const truncateDescription = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50/50">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-b-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl min-h-screen text-slate-800">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-r lg:bg-clip-text lg:text-transparent lg:from-indigo-600 lg:to-violet-600">
            Community Forum
          </h1>
          <p className="text-slate-500 text-sm mt-1">Discover, share, and connect with other members.</p>
        </div>
        
        {/* Toggle Layout Buttons */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl self-end sm:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all duration-200 shadow-sm ${
              viewMode === "grid" 
                ? "bg-white text-indigo-600 font-medium" 
                : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
            }`}
            aria-label="Grid View"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all duration-200 shadow-sm ${
              viewMode === "list" 
                ? "bg-white text-indigo-600 font-medium" 
                : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
            }`}
            aria-label="List View"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl max-w-md mx-auto">
          <svg className="w-12 h-12 mx-auto text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-3.586-3.586a1 1 0 00-1.414 0l-2.414 2.414a1 1 0 01-1.414 0L6.414 9m13.586 4H3" />
          </svg>
          <p className="text-slate-600 font-medium text-lg">No forum posts available yet.</p>
          <p className="text-slate-400 text-sm mt-1">Check back later or start a discussion!</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-6 max-w-4xl mx-auto"
          }
        >
          {posts.map((post) => (
            <div
              key={post._id}
              className={`group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 overflow-hidden flex flex-col ${
                viewMode === "list" ? "sm:flex-row" : "h-full"
              }`}
            >
              {/* Image Container */}
              <div
                className={`relative overflow-hidden bg-slate-100 ${
                  viewMode === "list" ? "w-full sm:w-56 sm:h-auto h-48 flex-shrink-0" : "w-full h-52"
                }`}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>

              {/* Text & Meta Content Container */}
              <div className="p-6 flex flex-col grow">
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-200 mb-3 tracking-tight line-clamp-2">
                  {post.title}
                </h2>
                
                {/* Author Info block */}
                <div className="flex items-center mb-4">
                  <div className="bg-linear-to-br from-indigo-500 to-violet-600 rounded-full w-9 h-9 flex items-center justify-center mr-3 shadow-sm ring-2 ring-white">
                    <span className="text-xs font-semibold text-white">
                      {post.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 leading-tight">
                      {post.authorName}
                    </p>
                    <p className="text-xs text-indigo-600 font-medium tracking-wide uppercase mt-0.5">
                      {post.authorRole}
                    </p>
                  </div>
                </div>

                {/* Description snippet */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6 grow">
                  {truncateDescription(post.description)}
                </p>

                {/* Footer interactive tier */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <span className="text-xs font-medium text-slate-400 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  
                  <Link
                    href={`/community-forum/${post._id}`}
                    className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-indigo-600 transition-colors duration-200 shadow-sm"
                  >
                    Read More
                    <svg
                      className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityForum;