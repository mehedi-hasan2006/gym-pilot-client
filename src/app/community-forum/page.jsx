'use client'
import { getPosts } from "@/lib/class/class";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { 
  Search, 
  Grid, 
  List, 
  Calendar, 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Clock,
  Filter,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
  BookOpen
} from "lucide-react";

const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      const activePosts = response.filter(
        (post) => post.status === "active",
      );
      setPosts(activePosts);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const truncateDescription = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return postDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFilteredAndSortedPosts = () => {
    let filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.authorRole === selectedCategory);
    }

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "popular":
        filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        break;
      case "trending":
        filtered.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredPosts = getFilteredAndSortedPosts();
  const categories = [...new Set(posts.map(post => post.authorRole))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header Skeleton */}
          <div className="animate-pulse mb-12">
            <div className="h-12 bg-slate-200 dark:bg-gray-700 rounded-lg w-96 mb-4"></div>
            <div className="h-5 bg-slate-200 dark:bg-gray-700 rounded-lg w-64"></div>
          </div>

          {/* Posts Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-gray-700">
                <div className="h-52 bg-slate-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="flex justify-between pt-4">
                    <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded w-28"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 dark:from-indigo-500/10 dark:to-violet-500/10 rounded-3xl"></div>
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full">
                    {posts.length} Discussions
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  Community{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Forum
                  </span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl">
                  Join the conversation, share your knowledge, and connect with fellow members in our vibrant community.
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs text-slate-500 dark:text-gray-400">Members</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {[...new Set(posts.map(p => p.authorId))].length}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-violet-500" />
                    <span className="text-xs text-slate-500 dark:text-gray-400">Comments</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-8 shadow-sm border border-slate-100 dark:border-gray-700 sticky top-4 z-10 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search posts, authors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-slate-900 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-500 transition-all duration-200"
              />
            </div>

            <div className="flex gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-700 dark:text-gray-300 font-medium cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="capitalize">{cat}</option>
                ))}
              </select>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-700 dark:text-gray-300 font-medium cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Liked</option>
                <option value="trending">Most Discussed</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-50 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
                  }`}
                  aria-label="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
                  }`}
                  aria-label="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {filteredPosts.length > 0 && (
          <div className="flex items-center justify-between mb-6 px-1">
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Showing <span className="font-semibold text-slate-700 dark:text-gray-300">{filteredPosts.length}</span> of{" "}
              <span className="font-semibold text-slate-700 dark:text-gray-300">{posts.length}</span> posts
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Posts Grid/List */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-gray-200 mb-2">
              {searchTerm ? "No posts found" : "No posts yet"}
            </h3>
            <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Be the first to start a discussion! Share your thoughts with the community."}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className={`group bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-gray-600 transition-all duration-300 overflow-hidden ${
                  viewMode === "list" ? "flex flex-col sm:flex-row" : "flex flex-col h-full"
                }`}
              >
                {/* Image Section */}
                <div
                  className={`relative overflow-hidden bg-slate-100 dark:bg-gray-700 ${
                    viewMode === "list" ? "sm:w-72 sm:h-auto h-48 flex-shrink-0" : "h-52"
                  }`}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex items-center gap-3 text-white">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-xs">{post.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs">{post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Author Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
                        <span className="text-xs font-bold text-white">
                          {post.authorName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-gray-200 truncate">
                        {post.authorName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400 capitalize">
                        {post.authorRole}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatDate(post.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed mb-4 flex-1 line-clamp-3">
                    {truncateDescription(post.description)}
                  </p>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-slate-400 dark:text-gray-500">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-xs font-medium">{post.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 dark:text-gray-500">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs font-medium">{post.comments?.length || 0}</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/community-forum/${post._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-gray-700 text-white text-sm font-medium rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-all duration-200 group/link"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {filteredPosts.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-gray-700 rounded-full">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-sm text-slate-600 dark:text-gray-300">
                Showing {filteredPosts.length} of {posts.length} discussions
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityForum;