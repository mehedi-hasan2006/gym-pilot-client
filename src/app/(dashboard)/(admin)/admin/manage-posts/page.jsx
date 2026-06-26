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
  User,
  Calendar,
  AlertTriangle,
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

  // Search
  const [searchTerm, setSearchTerm] = useState("");

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
        setPosts(data);
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

  // Filter posts by search
  const filteredPosts = posts.filter((post) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      post.title?.toLowerCase().includes(searchLower) ||
      post.content?.toLowerCase().includes(searchLower) ||
      post.author?.name?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage,
  );

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle delete
  const handleDelete = async () => {
    if (!selectedPost) return;

    setDeletingId(selectedPost.id);

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

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Forum Post Management
            </h1>
            <p className="text-gray-600">
              Moderate community posts ({filteredPosts.length} posts)
            </p>
          </div>
          <button
            onClick={fetchPosts}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-700">{successMessage}</p>
            <button onClick={() => setSuccessMessage("")} className="ml-auto">
              <X className="w-4 h-4 text-green-500" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts by title, content, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Reports
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedPosts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium">No posts found</p>
                      <p className="text-sm">
                        {searchTerm
                          ? "Try adjusting your search"
                          : "No posts have been created yet"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900 truncate">
                              {post.title}
                            </p>
                            {post.reports > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium shrink-0">
                                <Flag className="w-3 h-3" />
                                {post.reports}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {truncateText(post.content, 120)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {post?.authorName.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {post?.authorName || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {post?.authorRole || "Member"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {post.reports > 0 ? (
                          <span className="inline-flex items-center gap-1 text-sm text-red-600 font-medium">
                            <Flag className="w-4 h-4" />
                            {post.reports}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Button */}
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              setShowDeleteModal(true);
                            }}
                            disabled={deletingId === post.id}
                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            title="Delete Post"
                          >
                            {deletingId === post.id ? (
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
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + postsPerPage, filteredPosts.length)} of{" "}
                {filteredPosts.length} posts
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 rounded"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={`page-${page}`}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded text-sm font-medium ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 rounded"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Post Details
              </h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedPost.title}
              </h2>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  <Avatar>
                    <Avatar.Image alt={selectedPost?.name} src={selectedPost?.image} />
                    <Avatar.Fallback>
                      {selectedPost?.name?.charAt(0) || "U"}
                    </Avatar.Fallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedPost?.authorName || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedPost?.authorRole || "Member"} •{" "}
                    {new Date(selectedPost.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedPost.description}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setShowDeleteModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete Post
              </button>
              <button
                onClick={closeModals}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Post
              </h3>
              <p className="text-gray-600 text-center mb-2">
                Are you sure you want to delete this post?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-gray-900">
                  {selectedPost.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  By {selectedPost.author?.name}
                </p>
              </div>
              <p className="text-sm text-red-600 text-center mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deletingId === selectedPost.id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingId === selectedPost.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
                <button
                  onClick={closeModals}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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
