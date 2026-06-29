"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Users,
  User,
  Mail,
  Award,
  CheckCircle,
  Calendar,
  Dumbbell,
  RefreshCw,
  Loader2,
  Edit,
  ArrowRight,
  TrendingUp,
  Star,
  Clock,
  Plus,
  Eye,
  Activity,
  BarChart3,
} from "lucide-react";
import { getTrainerDashboardStats } from "@/lib/trainner/trainner";

const TrainerDashboard = ({ user }) => {
  // Stats State
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
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
      const response = await getTrainerDashboardStats(user.id);

      // Handle response: { success: true, data: { totalClasses: 8, totalStudents: 57 } }
      if (response?.success && response?.data) {
        setStats({
          totalClasses: response.data.totalClasses || 0,
          totalStudents: response.data.totalStudents || 0,
        });
      } else if (response?.data) {
        setStats({
          totalClasses: response.data.totalClasses || 0,
          totalStudents: response.data.totalStudents || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
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
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Trainer Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name || "Trainer"}! Manage your classes and
                students.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/create-class">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20 font-medium">
                  <Plus className="w-4 h-4" />
                  Create New Class
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
          {/* Statistics Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {/* Total Classes Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-bl-full" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/5 rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                      Active
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Total Classes Created
                </p>

                <p className="text-5xl font-black text-gray-900 dark:text-white mb-3">
                  {stats.totalClasses}
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((stats.totalClasses / 10) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {stats.totalClasses > 0
                      ? `${Math.round((stats.totalClasses / 10) * 100)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Students Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-bl-full" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-green-500/5 rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                    <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                      Enrolled
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Total Students Enrolled
                </p>

                <p className="text-5xl font-black text-gray-900 dark:text-white mb-3">
                  {stats.totalStudents}
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((stats.totalStudents / 100) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {stats.totalStudents > 0
                      ? `${Math.round((stats.totalStudents / 100) * 100)}%`
                      : "0%"}
                  </span>
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
                <div className="relative shrink-0">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Trainer"}
                      width={100}
                      height={100}
                      className="rounded-2xl object-cover ring-4 ring-gray-100 dark:ring-gray-700 shadow-lg"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold ring-4 ring-gray-100 dark:ring-gray-700 shadow-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || "T"}
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
                      {user?.name || "Trainer Name"}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {/* Trainer Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-blue-500/20">
                        <Award className="w-4 h-4" />
                        Trainer
                      </span>
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
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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

                  {/* Mini Stats Summary */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                      <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        {stats.totalClasses}
                      </p>
                      <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                        Total Classes
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                      <Users className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                        {stats.totalStudents}
                      </p>
                      <p className="text-xs text-green-600/70 dark:text-green-400/70">
                        Total Students
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-purple-500" />
                Quick Actions
              </h3>

              <div className="space-y-2">
                {[
                  {
                    icon: Plus,
                    label: "Create New Class",
                    href: "/trainner/add-class",
                    color: "bg-gradient-to-r from-green-500 to-emerald-500",
                  },
                  {
                    icon: BookOpen,
                    label: "My Classes",
                    href: "/trainner/my-classes",
                    color: "bg-gradient-to-r from-blue-500 to-blue-600",
                  },
                ].map((action, index) => (
                  <Link key={index} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer group"
                    >
                      <div
                        className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center shadow-lg`}
                      >
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                        {action.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Empty State - No Classes */}
          {stats.totalClasses === 0 && (
            <motion.div variants={itemVariants}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Dumbbell className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Start Your Teaching Journey
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  You haven't created any classes yet. Create your first class
                  and start teaching students!
                </p>
                <Link href="/trainner/add-class">
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-xl shadow-green-500/20">
                    <Plus className="w-5 h-5" />
                    Create Your First Class
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
