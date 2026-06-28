"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  BookOpen,
  Calendar,
  User,
  Mail,
  Shield,
  CheckCircle,
  RefreshCw,
  Loader2,
  Edit,
  ArrowRight,
  TrendingUp,
  Activity,
  Dumbbell,
  CreditCard,
  MessageSquare,
  Flag,
  Settings,
  Plus,
  Eye,
  BarChart3,
  Star,
  Clock,
} from "lucide-react";
import { getAdminDashboardStats } from "@/lib/admin/admin";

const AdminDashboard = ({ user }) => {
  // Stats State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClasses: 0,
    totalBookedClasses: 0,
    totalTransactions: 0,
    totalPosts: 0,
    pendingApplications: 0,
  });

  // Loading State
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    if (user?.id) {
      fetchDashboardStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    setLoading(true);

    try {
      const response = await getAdminDashboardStats();
      console.log("Admin Dashboard Stats Response:", response);

      // Handle response: { success: true, data: { totalUsers: 150, totalClasses: 45, ... } }
      if (response?.success && response?.data) {
        setStats({
          totalUsers: response.data.totalUsers || 0,
          totalClasses: response.data.totalClasses || 0,
          totalBookedClasses: response.data.totalBookedClasses || 0,
          totalTransactions: response.data.transactions || 0,
          totalPosts: response.data.forumPosts || 0,
          pendingApplications: response.data.pendingApplications || 0,
        });
      } else if (response?.data) {
        setStats({
          totalUsers: response.data.totalUsers || 0,
          totalClasses: response.data.totalClasses || 0,
          totalBookedClasses: response.data.totalBookedClasses || 0,
          totalTransactions: response.data.transactions || 0,
          totalPosts: response.data.forumPosts || 0,
          pendingApplications: response.data.pendingApplications || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading admin dashboard...
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
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name || "Admin"}! Monitor and manage the
                entire platform.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="#">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-lg shadow-gray-500/20 font-medium">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </Link>
              <button
                onClick={fetchDashboardStats}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Main Statistics Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Total Users Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-bl-full" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/5 rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                      Platform
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Total Users
                </p>

                <p className="text-5xl font-black text-gray-900 dark:text-white mb-3">
                  {stats.totalUsers.toLocaleString()}
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((stats.totalUsers / 200) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Total Classes Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-bl-full" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-green-500/5 rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                    <Dumbbell className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                      Classes
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Total Classes
                </p>

                <p className="text-5xl font-black text-gray-900 dark:text-white mb-3">
                  {stats.totalClasses.toLocaleString()}
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((stats.totalClasses / 50) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <BookOpen className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>

            {/* Total Booked Classes Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-bl-full" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500/5 rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                    <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-400">
                      Booked
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Total Booked Classes
                </p>

                <p className="text-5xl font-black text-gray-900 dark:text-white mb-3">
                  {stats.totalBookedClasses.toLocaleString()}
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((stats.totalBookedClasses / 100) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <Calendar className="w-4 h-4 text-purple-500" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {/* Total Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Transactions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalTransactions?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Forum Posts
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalPosts?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Applications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                  <Flag className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Pending Applications
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.pendingApplications?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Details & Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Profile Details Card */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Admin Profile
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
                <div className="relative shrink-0">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Admin"}
                      width={100}
                      height={100}
                      className="rounded-2xl object-cover ring-4 ring-gray-100 dark:ring-gray-700 shadow-lg"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold ring-4 ring-gray-100 dark:ring-gray-700 shadow-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                  )}
                  {/* Online Status */}
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user?.name || "Admin Name"}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {/* Admin Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-purple-500/20">
                        <Shield className="w-4 h-4" />
                        Admin
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Full Name
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {user?.name || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
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

            {/* Quick Management Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-purple-500" />
                Quick Management
              </h3>

              <div className="space-y-2">
                {[
                  {
                    icon: Users,
                    label: "Manage Users",
                    href: "/admin/users",
                    color: "bg-gradient-to-r from-blue-500 to-blue-600",
                    badge: stats.totalUsers,
                  },
                  {
                    icon: BookOpen,
                    label: "Manage Classes",
                    href: "/admin/classes",
                    color: "bg-gradient-to-r from-green-500 to-green-600",
                    badge: stats.totalClasses,
                  },
                  {
                    icon: Flag,
                    label: "Applications",
                    href: "/admin/applications",
                    color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
                    badge: stats.pendingApplications,
                    alert: stats.pendingApplications > 0,
                  },
                  {
                    icon: MessageSquare,
                    label: "Forum Posts",
                    href: "/community-post",
                    color: "bg-gradient-to-r from-pink-500 to-pink-600",
                    badge: stats.totalPosts,
                  },
                  {
                    icon: CreditCard,
                    label: "Transactions",
                    href: "/admin/transactions",
                    color: "bg-gradient-to-r from-orange-500 to-orange-600",
                    badge: stats.totalTransactions,
                  },
                  {
                    icon: Settings,
                    label: "Settings",
                    href: "#",
                    color: "bg-gradient-to-r from-gray-500 to-gray-600",
                  },
                ].map((action, index) => (
                  <Link key={index} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer group relative"
                    >
                      <div
                        className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center shadow-lg`}
                      >
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                        {action.label}
                      </span>
                      {action.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            action.alert
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse"
                              : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {action.badge}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
