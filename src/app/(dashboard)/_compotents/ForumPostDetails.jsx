"use client";
import { forumApi } from "@/lib/services/forumApi";
import React, { useState, useEffect } from "react";
import { Heart, ThumbsDown, MessageCircle, Reply, Edit3, Trash2, ChevronLeft, Send, Clock, Shield } from "lucide-react";

const ForumPostDetails = ({ user, postId, res }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [userVote, setUserVote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      const response = res;
      setPost(response);
      setComments(response.comments || []);

      if (user) {
        const hasLiked = response.likes.includes(user.id);
        setUserVote(hasLiked ? "like" : null);
      }
    } catch (error) {
      console.error("Error fetching post details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const data = await forumApi.likePost(postId, user.id);
      setPost(data);
      setUserVote("like");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDislike = async () => {
    if (!user || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const data = await forumApi.dislikePost(postId, user.id);
      setPost(data);
      setUserVote("dislike");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const comments = await forumApi.addComment(postId, {
        userId: user.id,
        userName: user.name,
        text: newComment,
        parentCommentId: null,
      });
      setComments(comments);
      setNewComment("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const comments = await forumApi.addComment(postId, {
        userId: user.id,
        userName: user.name,
        text: replyText,
        parentCommentId: commentId,
      });
      setComments(comments);
      setReplyText("");
      setReplyTo(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const comments = await forumApi.updateComment(postId, commentId, {
        text: editText,
        userId: user.id,
      });
      setComments(comments);
      setEditingComment(null);
      setEditText("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const comments = await forumApi.deleteComment(postId, commentId, user.id);
      setComments(comments);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error(error);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return commentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderComments = (parentComment = null) => {
    const filteredComments = comments.filter(
      (comment) => comment.parentCommentId === parentComment
    );

    return filteredComments.map((comment, index) => (
      <div 
        key={comment._id} 
        className={`${parentComment ? "ml-6 pl-4 border-l-2 border-blue-200 dark:border-blue-900" : ""} mb-4 animate-fadeIn`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-800 shadow-md">
                  <span className="text-sm font-bold text-white">
                    {comment.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                {(comment.userRole === 'admin' || comment.userRole === 'trainer') && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                    <Shield className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {comment.userName}
                  </p>
                  {comment.userRole === 'admin' && (
                    <span className="px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full font-medium">
                      Admin
                    </span>
                  )}
                  {comment.userRole === 'trainer' && (
                    <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium">
                      Trainer
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-0.5">
                  <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getTimeAgo(comment.createdAt)}
                  </p>
                  {comment.editedAt && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">(edited)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Comment Actions */}
            {user && comment.userId === user.id && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    setEditingComment(comment._id);
                    setEditText(comment.text);
                  }}
                  className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                  title="Edit comment"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(comment._id)}
                  className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                  title="Delete comment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Comment Content */}
          {editingComment === comment._id ? (
            <div className="space-y-3">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                rows="3"
                autoFocus
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditComment(comment._id)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditingComment(null)}
                  className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {comment.text}
            </p>
          )}

          {/* Reply Button */}
          {user && !editingComment && (
            <button
              onClick={() => {
                setReplyTo(replyTo === comment._id ? null : comment._id);
                setReplyText("");
              }}
              className="mt-3 flex items-center space-x-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Reply className="w-4 h-4" />
              <span className="text-xs font-medium">Reply</span>
            </button>
          )}

          {/* Reply Form */}
          {replyTo === comment._id && (
            <div className="mt-4 space-y-3 animate-fadeIn">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Replying to ${comment.userName}...`}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                rows="2"
                autoFocus
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleReply(comment._id)}
                  disabled={isSubmitting || !replyText.trim()}
                  className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Replying...' : 'Reply'}
                </button>
                <button
                  onClick={() => {
                    setReplyTo(null);
                    setReplyText("");
                  }}
                  className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm === comment._id && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm mx-4 shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Delete Comment</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Are you sure you want to delete this comment? This action cannot be undone.
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recursively render nested replies */}
        {renderComments(comment._id)}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4 bg-gray-50 dark:bg-gray-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 dark:border-blue-400"></div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm max-w-md border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Post Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="group mb-8 flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 flex items-center justify-center mr-2 transition-all duration-200 border border-gray-200 dark:border-gray-700">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <span className="font-medium text-sm">Back to Forum</span>
        </button>

        {/* Post Content */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Hero Image */}
          <div className="relative">
            {!imageError ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-72 md:h-96 object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-72 md:h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <MessageCircle className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-3 py-1 bg-blue-500/90 dark:bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full capitalize">
                  {post.authorRole}
                </span>
                <span className="px-3 py-1 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 mb-8 border border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-white">
                      {post.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {(post.authorRole === 'admin' || post.authorRole === 'trainer') && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                      <Shield className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{post.authorName}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{post.authorRole}</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.authorEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Description */}
            <div className="prose dark:prose-invert max-w-none mb-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                {post.description}
              </p>
            </div>

            {/* Like/Dislike Section */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLike}
                disabled={!user || isSubmitting}
                className={`group flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  userVote === "like"
                    ? "bg-blue-500 dark:bg-blue-600 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/25"
                    : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700"
                } ${!user ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}`}
              >
                <Heart 
                  className={`w-5 h-5 mr-2 transition-transform duration-300 ${
                    userVote === "like" ? "fill-current scale-110" : "group-hover:scale-110"
                  }`} 
                />
                <span className="text-sm">Like</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  userVote === "like" 
                    ? "bg-white/20" 
                    : "bg-gray-200 dark:bg-gray-600 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50"
                }`}>
                  {post.likes.length}
                </span>
              </button>

              <button
                onClick={handleDislike}
                disabled={!user || isSubmitting}
                className={`group flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  userVote === "dislike"
                    ? "bg-red-500 dark:bg-red-600 text-white shadow-lg shadow-red-500/25 dark:shadow-red-600/25"
                    : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 border-2 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700"
                } ${!user ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}`}
              >
                <ThumbsDown 
                  className={`w-5 h-5 mr-2 transition-transform duration-300 ${
                    userVote === "dislike" ? "fill-current scale-110" : "group-hover:scale-110"
                  }`} 
                />
                <span className="text-sm">Dislike</span>
              </button>
            </div>

            {/* Comments Section */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                  Comments
                  <span className="ml-3 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full">
                    {comments.length}
                  </span>
                </h2>
              </div>

              {/* Add Comment Form */}
              {user ? (
                <form onSubmit={handleAddComment} className="mb-8">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-xl p-5 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 space-y-3">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                          rows="3"
                          required
                        />
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {newComment.length}/1000 characters
                          </p>
                          <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="w-4 h-4" />
                            <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-600 text-center">
                  <MessageCircle className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Want to join the discussion?</p>
                  <a
                    href="/login"
                    className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline"
                  >
                    Login to post a comment
                  </a>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-2">
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No comments yet</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  renderComments(null)
                )}
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ForumPostDetails;