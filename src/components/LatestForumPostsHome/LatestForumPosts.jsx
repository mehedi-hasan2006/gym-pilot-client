"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  MessageSquare,
  ThumbsUp,
  Clock,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Loader2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { getRecentForumPosts } from "@/lib/forum/forum";

const LatestForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch latest forum posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getRecentForumPosts();

        if (response?.success && response?.data) {
          setPosts(response.data);
        } else if (Array.isArray(response)) {
          setPosts(response);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching latest posts:", error);
        setError(error.message || "Failed to load posts");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Format date
  const formatDate = (date) => {
    if (!date) return "Unknown";
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Truncate text
  const truncateText = (text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 12 },
    },
  };

  // Loading State
  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header Skeleton */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 animate-pulse">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
            <div className="w-64 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="w-96 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto animate-pulse" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                    <div className="w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                  </div>
                </div>
                <div className="w-full h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3" />
                <div className="w-full h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4" />
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
                    <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
                  </div>
                  <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Posts
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <Sparkles className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // Empty State
  if (!posts || posts.length === 0) {
    return (
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Posts Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Be the first to start a discussion in our community!
          </p>
          <Link
            href="/forum/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <MessageSquare className="w-4 h-4" />
            Create Post
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-800 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800 mb-4"
          >
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Community Discussions
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Forum Posts
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join the conversation! Read and share fitness tips, experiences, and
            motivation with our community.
          </p>
        </motion.div>

        {/* Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {posts.slice(0, 4).map((post, index) => (
            <motion.div
              key={post._id}
              variants={itemVariants}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative shrink-0">
                  {post.userImage ? (
                    <Image
                      src={post.userImage}
                      alt={post.userName || "User"}
                      width={44}
                      height={44}
                      className="rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                    />
                  ) : (
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg ring-2 ring-white dark:ring-gray-800">
                      {post.userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  {/* Online Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-700 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {post.userName || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Post Title */}
              <Link href={`/forum/${post._id}`}>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </Link>

              {/* Post Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                {truncateText(post.description, 150)}
              </p>

              {/* Post Stats & Action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-4">
                  {/* Likes */}
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {post.likes?.length || 0}
                    </span>
                  </div>

                  {/* Comments */}
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {post.comments?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Read More Link */}
                <Link
                  href={`/forum/${post._id}`}
                  className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/community-forum"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
          >
            <MessageSquare className="w-5 h-5" />
            View All Posts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestForumPosts;
