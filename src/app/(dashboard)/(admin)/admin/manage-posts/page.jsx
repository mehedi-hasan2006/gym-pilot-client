"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle,
  X,
  Flag,
  MessageSquare,
  Calendar,
  AlertTriangle,
  Clock,
  Hash,
  ThumbsUp,
  MessageCircle,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { getForumPosts, deleteForumPost } from "@/lib/forum/forum";
import { Avatar } from "@heroui/react";

const ForumPostManage = () => {
  const router = useRouter();

  // State
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Modals
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Processing
  const [deletingId, setDeletingId] = useState(null);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getForumPosts();
      if (data) {
        // Sort by newest first
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sorted);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter and sort posts
  const filteredPosts = posts
    .filter((post) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        post.title?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower) ||
        post.authorName?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "most-reported":
          return (b.reports || 0) - (a.reports || 0);
        case "most-liked":
          return (b.likes || 0) - (a.likes || 0);
        case "most-commented":
          return (b.comments || 0) - (a.comments || 0);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Stats
  const totalPosts = posts.length;
  const reportedPosts = posts.filter((p) => p.reports > 0).length;
  const todayPosts = posts.filter(
    (p) => new Date(p.createdAt).toDateString() === new Date().toDateString()
  ).length;

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  // Handle delete
  const handleDelete = async () => {
    if (!selectedPost) return;

    setDeletingId(selectedPost._id);

    try {
      const response = await deleteForumPost(selectedPost._id);
      if (response.success) {
        setSuccessMessage(`Post deleted successfully!`);
        fetchPosts();
        closeModals();
      }
    } catch (error) {
      setError(error.message || "Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  // Close modals
  const closeModals = () => {
    setShowDetailModal(false);
    setShowDeleteModal(false);
    setSelectedPost(null);
  };

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Format date
  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading posts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Forum Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Moderate and manage community posts
              </p>
            </div>
            <button
              onClick={fetchPosts}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {totalPosts}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Reported</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {reportedPosts}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <Flag className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {todayPosts}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            <p className="text-green-700 dark:text-green-200">{successMessage}</p>
            <button onClick={() => setSuccessMessage("")} className="ml-auto">
              <X className="w-4 h-4 text-green-500" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 dark:text-red-200">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts by title, content, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-reported">Most Reported</option>
              <option value="most-liked">Most Liked</option>
              <option value="most-commented">Most Commented</option>
            </select>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reports
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="max-w-sm mx-auto">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          No posts found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {searchTerm
                            ? "Try adjusting your search or filters"
                            : "No posts have been created yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-lg">
                          <div className="flex items-start gap-2 mb-1.5">
                            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {post.title}
                            </p>
                            {post.reports > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium shrink-0 mt-0.5">
                                <Flag className="w-3 h-3" />
                                {post.reports}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {truncateText(post.description || post.content, 150)}
                          </p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {post.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs"
                                >
                                  <Hash className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="text-xs text-gray-400">
                                  +{post.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            size="sm"
                            src={post?.authorImage}
                            alt={post?.authorName}
                            className="ring-2 ring-white dark:ring-gray-800"
                            fallback={
                              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {post?.authorName?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                            }
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {post?.authorName || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {post?.authorRole || "Member"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(post.createdAt)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {post.reports > 0 ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm font-semibold">
                              <Flag className="w-3.5 h-3.5" />
                              {post.reports}
                            </span>
                            {post.reports >= 5 && (
                              <span className="inline-flex items-center gap-1 text-xs text-red-500 dark:text-red-400 font-medium">
                                <AlertCircle className="w-3 h-3" />
                                High priority
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 rounded-lg text-sm">
                            None
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              setShowDetailModal(true);
                            }}
                            className="p-2.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              setShowDeleteModal(true);
                            }}
                            disabled={deletingId === post._id}
                            className="p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 disabled:opacity-50"
                            title="Delete Post"
                          >
                            {deletingId === post._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + postsPerPage, filteredPosts.length)} of{" "}
                {filteredPosts.length} posts
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 7) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={`page-${page}`}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-1 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Post Details
              </h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {selectedPost.reports > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                      <Flag className="w-4 h-4" />
                      {selectedPost.reports} Reports
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedPost.title}
                </h2>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <Avatar
                  src={selectedPost?.authorImage}
                  alt={selectedPost?.authorName}
                  size="md"
                  className="ring-2 ring-white dark:ring-gray-800"
                  fallback={
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedPost?.authorName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  }
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedPost?.authorName || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedPost?.authorRole || "Member"} •{" "}
                    {new Date(selectedPost.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedPost.description || selectedPost.content}
                </p>
              </div>

              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                  <ThumbsUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedPost.likes.length || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Likes</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                  <MessageCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedPost.comments.length || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Comments</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                  <Eye className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedPost.views || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Views</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setShowDeleteModal(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-lg shadow-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
                Delete Post
              </button>
              <button
                onClick={closeModals}
                className="flex-1 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Delete Post
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to permanently delete this post?
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedPost.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  By {selectedPost.authorName || "Unknown"}
                </p>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deletingId === selectedPost._id}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 shadow-lg shadow-red-500/20"
                >
                  {deletingId === selectedPost._id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                  Delete
                </button>
                <button
                  onClick={closeModals}
                  className="flex-1 px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumPostManage;