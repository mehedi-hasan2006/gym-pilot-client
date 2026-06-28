"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Heart,
  User,
  Mail,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  Dumbbell,
  RefreshCw,
  Loader2,
  Eye,
  Info,
  Activity,
} from "lucide-react";
import { getUserBookings } from "@/lib/booking/booking";
import { getFavoriteClasses } from "@/lib/user/user";
import { getApplicationByUser } from "@/lib/application/application";

const MemberDashboard = ({ user }) => {
  // Stats State
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalFavorites: 0,
  });

  // Application State
  const [application, setApplication] = useState(null);
  const [hasNoApplication, setHasNoApplication] = useState(false);

  // Loading States
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingApplication, setLoadingApplication] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    if (user?.id) {
      fetchStats();
      fetchApplication();
    } else {
      setLoadingStats(false);
      setLoadingApplication(false);
    }
  }, [user]);

  const fetchStats = async () => {
    setLoadingStats(true);

    try {
      // Fetch bookings
      const bookingsRes = await getUserBookings(user.id);
      console.log("Bookings Response:", bookingsRes);

      // Fetch favorites
      const favoritesRes = await getFavoriteClasses(user.id);
      console.log("Favorites Response:", favoritesRes);

      let bookingCount = 0;
      let favoriteCount = 0;

      // Handle bookings count
      if (bookingsRes) {
        if (bookingsRes.success && Array.isArray(bookingsRes.data)) {
          bookingCount = bookingsRes.data.length;
        } else if (bookingsRes.success && bookingsRes.total !== undefined) {
          bookingCount = bookingsRes.total;
        } else if (Array.isArray(bookingsRes)) {
          bookingCount = bookingsRes.length;
        } else if (bookingsRes.total !== undefined) {
          bookingCount = bookingsRes.total;
        } else if (bookingsRes.data && Array.isArray(bookingsRes.data)) {
          bookingCount = bookingsRes.data.length;
        }
      }

      // Handle favorites count
      if (favoritesRes) {
        if (favoritesRes.success && Array.isArray(favoritesRes.data)) {
          favoriteCount = favoritesRes.data.length;
        } else if (favoritesRes.success && favoritesRes.total !== undefined) {
          favoriteCount = favoritesRes.total;
        } else if (Array.isArray(favoritesRes)) {
          favoriteCount = favoritesRes.length;
        } else if (favoritesRes.total !== undefined) {
          favoriteCount = favoritesRes.total;
        } else if (favoritesRes.data && Array.isArray(favoritesRes.data)) {
          favoriteCount = favoritesRes.data.length;
        }
      }

      console.log("Setting stats:", { bookingCount, favoriteCount });

      setStats({
        totalBookings: bookingCount,
        totalFavorites: favoriteCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchApplication = async () => {
    setLoadingApplication(true);

    try {
      const appRes = await getApplicationByUser(user.id);
      console.log("Application Response:", appRes);

      if (appRes) {
        // Check different possible response formats
        if (appRes.success && appRes.data) {
          setApplication(appRes.data);
          setHasNoApplication(false);
        } else if (appRes._id || appRes.status) {
          // Direct application object
          setApplication(appRes);
          setHasNoApplication(false);
        } else if (appRes.success === false) {
          // Explicit false success
          setApplication(null);
          setHasNoApplication(true);
        } else {
          setApplication(null);
          setHasNoApplication(true);
        }
      } else {
        setApplication(null);
        setHasNoApplication(true);
      }
    } catch (error) {
      console.log("No application found or error:", error.message);
      setApplication(null);
      setHasNoApplication(true);
    } finally {
      setLoadingApplication(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const configs = {
      Pending: {
        icon: Clock,
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
        label: "Pending Review",
      },
      Approved: {
        icon: CheckCircle,
        className:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
        label: "Approved",
      },
      Rejected: {
        icon: XCircle,
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
        label: "Rejected",
      },
    };

    const config = configs[status] || configs.Pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${config.className}`}
      >
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const configs = {
      admin: {
        icon: Shield,
        className:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        label: "Admin",
      },
      trainer: {
        icon: Award,
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        label: "Trainer",
      },
      member: {
        icon: User,
        className:
          "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        label: "Member",
      },
    };

    const config = configs[role] || configs.member;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.className}`}
      >
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 12 },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name || "Member"}! Here's your fitness
                summary.
              </p>
            </div>
            <button
              onClick={() => {
                fetchStats();
                fetchApplication();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Statistics Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {/* Total Bookings Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Link
                    href="/member/booked-classes"
                    className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Total Booked Classes
                </p>
                {loadingStats ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-400">Loading...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-4xl font-black text-gray-900 dark:text-white">
                      {stats.totalBookings}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Active bookings
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Total Favorites Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                    <Heart className="w-7 h-7 text-red-600 dark:text-red-400" />
                  </div>
                  <Link
                    href="/member/favorite-classes"
                    className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Total Favorites
                </p>
                {loadingStats ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                    <span className="text-sm text-gray-400">Loading...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-4xl font-black text-gray-900 dark:text-white">
                      {stats.totalFavorites}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Saved classes
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Profile Details & Application Status */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Profile Details Card */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Profile Details
                </h3>
                <Link href="#">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={96}
                      height={96}
                      className="rounded-2xl object-cover ring-4 ring-gray-100 dark:ring-gray-700"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold ring-4 ring-gray-100 dark:ring-gray-700">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user?.name || "Member Name"}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {getRoleBadge(user?.role || "member")}
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined{" "}
                        {new Date(
                          user?.createdAt || Date.now(),
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                      <User className="w-5 h-5 text-blue-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Full Name
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {user?.name || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                      <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Email Address
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {user?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trainer Application Status Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-purple-500" />
                Trainer Application
              </h3>

              {loadingApplication ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Loading application...
                  </span>
                </div>
              ) : application && !hasNoApplication ? (
                <div className="space-y-4">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Status
                    </span>
                    {getStatusBadge(application.status)}
                  </div>

                  {/* Application Details */}
                  {application.specialty && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Specialty
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {application.specialty}
                      </p>
                    </div>
                  )}

                  {application.experience !== undefined && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Experience
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {application.experience} years
                      </p>
                    </div>
                  )}

                  {/* Rejection Feedback */}
                  {application.status === "Rejected" &&
                    application.rejectionReason && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                              Admin Feedback
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">
                              {application.rejectionReason}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {application.status === "Rejected" && (
                    <Link href="/apply-trainer">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm">
                        <RefreshCw className="w-4 h-4" />
                        Re-apply as Trainer
                      </button>
                    </Link>
                  )}

                  <Link href="/member/application">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm">
                      <Eye className="w-4 h-4" />
                      View Full Application
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Become a Trainer
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Share your expertise and earn by becoming a trainer on our
                    platform.
                  </p>
                  <Link href="/apply-trainer">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium text-sm shadow-lg shadow-purple-500/20">
                      <Award className="w-4 h-4" />
                      Apply as Trainer
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: BookOpen,
                  label: "My Bookings",
                  href: "/member/booked-classes",
                  color: "bg-blue-500",
                },
                {
                  icon: Heart,
                  label: "Favorites",
                  href: "/member/favorite-classes",
                  color: "bg-red-500",
                },
                {
                  icon: Dumbbell,
                  label: "All Classes",
                  href: "/all-classes",
                  color: "bg-green-500",
                },
                {
                  icon: Activity,
                  label: "Forum",
                  href: "/community-forum",
                  color: "bg-purple-500",
                },
              ].map((action, index) => (
                <Link key={index} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer text-center"
                  >
                    <div
                      className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {action.label}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MemberDashboard;
