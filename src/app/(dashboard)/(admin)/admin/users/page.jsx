"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Shield,
  ShieldOff,
  UserCheck,
  UserX,
  Users,
  UserPlus,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  AlertCircle,
  Loader2,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  X,
  Ban,
  Trash2,
  UserCog,
  ShieldAlert,
  ShieldCheck,
  Activity,
  UserCircle,
  Settings,
  SlidersHorizontal,
  CheckCheck,
  BarChart3,
} from "lucide-react";
import {
  getUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getUserStats,
} from "@/lib/user/user";

const ManageUsers = () => {
  const router = useRouter();

  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    admins: 0,
    trainers: 0,
    members: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [showMakeAdminModal, setShowMakeAdminModal] = useState(false);
  const [showRemoveAdminModal, setShowRemoveAdminModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Block reason
  const [blockReason, setBlockReason] = useState("");
  const [blockErrors, setBlockErrors] = useState({});

  // Processing states
  const [processingId, setProcessingId] = useState(null);
  const [actionType, setActionType] = useState(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersData, statsData] = await Promise.all([
        getUsers(),
        getUserStats(),
      ]);

      if (usersData) {
        setUsers(usersData);
        setFilteredUsers(usersData);
      }

      if (statsData) {
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Apply filters and search
  useEffect(() => {
    let result = [...users];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.role?.toLowerCase().includes(searchLower)
      );
    }

    // Role filter
    if (roleFilter !== "All") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter((user) => user.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "name-asc":
        result.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name?.localeCompare(a.name));
        break;
      case "email-asc":
        result.sort((a, b) => a.email?.localeCompare(b.email));
        break;
      case "email-desc":
        result.sort((a, b) => b.email?.localeCompare(a.email));
        break;
      default:
        break;
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, searchTerm, roleFilter, statusFilter, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Get unique roles for filter
  const roles = [...new Set(users.map((user) => user.role))].sort();

  // Handle block user
  const handleBlockUser = async () => {
    if (!blockReason || blockReason.trim().length < 10) {
      setBlockErrors({
        reason: "Please provide a reason for blocking (minimum 10 characters)",
      });
      return;
    }

    setProcessingId(selectedUser?._id);
    setActionType("block");

    try {
      const response = await updateUserStatus(selectedUser._id, {
        status: "Blocked",
        blockReason: blockReason.trim(),
        blockedAt: new Date().toISOString(),
      });

      if (response.success) {
        setSuccessMessage(
          `${selectedUser.name} has been blocked successfully!`
        );
        fetchUsers();
        closeAllModals();
      }
    } catch (error) {
      setError(error.message || "Failed to block user");
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  // Handle unblock user
  const handleUnblockUser = async () => {
    setProcessingId(selectedUser?._id);
    setActionType("unblock");

    try {
      const response = await updateUserStatus(selectedUser._id, {
        status: "Active",
        blockReason: null,
        unblockedAt: new Date().toISOString(),
      });

      if (response.success) {
        setSuccessMessage(
          `${selectedUser.name} has been unblocked successfully!`
        );
        fetchUsers();
        closeAllModals();
      }
    } catch (error) {
      setError(error.message || "Failed to unblock user");
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  // Handle make admin
  const handleMakeAdmin = async () => {
    setProcessingId(selectedUser?._id);
    setActionType("makeAdmin");

    try {
      const response = await updateUserRole(selectedUser._id, {
        role: "admin",
      });

      if (response.success) {
        setSuccessMessage(
          `${selectedUser.name} has been promoted to Admin!`
        );
        fetchUsers();
        closeAllModals();
      }
    } catch (error) {
      setError(error.message || "Failed to update user role");
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  // Handle remove admin
  const handleRemoveAdmin = async () => {
    setProcessingId(selectedUser?._id);
    setActionType("removeAdmin");

    try {
      const response = await updateUserRole(selectedUser._id, {
        role: "member",
      });

      if (response.success) {
        setSuccessMessage(
          `${selectedUser.name} has been demoted to Member!`
        );
        fetchUsers();
        closeAllModals();
      }
    } catch (error) {
      setError(error.message || "Failed to update user role");
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    setProcessingId(selectedUser?._id);
    setActionType("delete");

    try {
      const response = await deleteUser(selectedUser._id);

      if (response.success) {
        setSuccessMessage(
          `${selectedUser.name} has been deleted successfully!`
        );
        fetchUsers();
        closeAllModals();
      }
    } catch (error) {
      setError(error.message || "Failed to delete user");
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDetailModal(false);
    setShowBlockModal(false);
    setShowUnblockModal(false);
    setShowMakeAdminModal(false);
    setShowRemoveAdminModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
    setBlockReason("");
    setBlockErrors({});
  };

  // Export users
  const handleExport = () => {
    const data = filteredUsers.map((user) => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Status: user.status,
      "Joined Date": new Date(user.createdAt).toLocaleDateString(),
      "Last Active": user.lastActive
        ? new Date(user.lastActive).toLocaleDateString()
        : "N/A",
      "Block Reason": user.blockReason || "N/A",
    }));

    const csv =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(data[0]).join(","),
        ...data.map((row) => Object.values(row).join(",")),
      ].join("\n");

    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `users_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const configs = {
      admin: {
        icon: ShieldAlert,
        className:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        label: "Admin",
      },
      trainer: {
        icon: UserCog,
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        label: "Trainer",
      },
      member: {
        icon: UserCircle,
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        label: "Member",
      },
    };

    const config = configs[role] || configs.member;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const configs = {
      Active: {
        icon: CheckCircle,
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        label: "Active",
      },
      Blocked: {
        icon: Ban,
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        label: "Blocked",
      },
      Suspended: {
        icon: Clock,
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        label: "Suspended",
      },
    };

    const config = configs[status] || configs.Active;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage all registered users, roles, and permissions
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={fetchUsers}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3 animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800 dark:text-green-200 font-medium">
                {successMessage}
              </p>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 dark:text-red-200 font-medium">
                Error
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Active
                </p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {stats.active}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Blocked
                </p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {stats.blocked}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Admins
                </p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                  {stats.admins}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Trainers
                </p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {stats.trainers}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <UserCog className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Members
                </p>
                <p className="text-xl font-bold text-gray-600 dark:text-gray-400 mt-1">
                  {stats.members}
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
            >
              <option value="All">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
              <option value="Suspended">Suspended</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="email-asc">Email A-Z</option>
              <option value="email-desc">Email Z-A</option>
            </select>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Items Per Page
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setRoleFilter("All");
                      setStatusFilter("All");
                      setSortBy("newest");
                    }}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">
                        {searchTerm || roleFilter !== "All" || statusFilter !== "All"
                          ? "Try adjusting your filters"
                          : "No users registered yet"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </p>
                            {user.blockReason && user.status === "Blocked" && (
                              <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                                Blocked: {user.blockReason.substring(0, 30)}
                                {user.blockReason.length > 30 ? "..." : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Details */}
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Block/Unblock Button */}
                          {user.status === "Active" || user.status === "Suspended" ? (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowBlockModal(true);
                              }}
                              className="p-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                              title="Block User"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUnblockModal(true);
                              }}
                              className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Unblock User"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}

                          {/* Make Admin / Remove Admin Button */}
                          {user.role !== "admin" ? (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowMakeAdminModal(true);
                              }}
                              className="p-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                              title="Make Admin"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowRemoveAdminModal(true);
                              }}
                              className="p-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Remove Admin"
                            >
                              <ShieldOff className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete User */}
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
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
          {filteredUsers.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                User Details
              </h3>
              <button
                onClick={closeAllModals}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {selectedUser.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedUser.name}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {selectedUser.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    User ID
                  </p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                    {selectedUser._id}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Joined Date
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedUser.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Last Active
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedUser.lastActive
                      ? new Date(selectedUser.lastActive).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Never"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Account Status
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedUser.status}
                  </p>
                </div>
              </div>

              {selectedUser.blockReason && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">
                    Block Reason
                  </p>
                  <p className="text-red-700 dark:text-red-300">
                    {selectedUser.blockReason}
                  </p>
                  {selectedUser.blockedAt && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                      Blocked on:{" "}
                      {new Date(selectedUser.blockedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  )}
                </div>
              )}

              {selectedUser.notes && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-1">
                    Admin Notes
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    {selectedUser.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
              {selectedUser.status !== "Blocked" ? (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowBlockModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Ban className="w-4 h-4" />
                  Block User
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowUnblockModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  Unblock User
                </button>
              )}

              {selectedUser.role !== "admin" ? (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowMakeAdminModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Make Admin
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowRemoveAdminModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ShieldOff className="w-4 h-4" />
                  Remove Admin
                </button>
              )}

              <button
                onClick={closeAllModals}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block User Modal */}
      {showBlockModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Ban className="w-5 h-5 text-orange-500" />
                Block User
              </h3>
              <button
                onClick={closeAllModals}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  You are about to block{" "}
                  <strong>{selectedUser.name}</strong> ({selectedUser.email}).
                  They will no longer be able to access the platform.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Blocking *
                </label>
                <textarea
                  value={blockReason}
                  onChange={(e) => {
                    setBlockReason(e.target.value);
                    if (blockErrors.reason) {
                      setBlockErrors({});
                    }
                  }}
                  rows="4"
                  maxLength="500"
                  placeholder="Provide a reason for blocking this user (minimum 10 characters)..."
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 text-gray-900 dark:text-gray-100 resize-none ${
                    blockErrors.reason
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {blockReason.length}/500 characters
                  </p>
                  {blockErrors.reason && (
                    <p className="text-xs text-red-500">{blockErrors.reason}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={handleBlockUser}
                disabled={processingId === selectedUser._id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {processingId === selectedUser._id &&
                actionType === "block" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Ban className="w-4 h-4" />
                )}
                Confirm Block
              </button>
              <button
                onClick={closeAllModals}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unblock User Modal */}
      {showUnblockModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                Unblock User
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
                Are you sure you want to unblock{" "}
                <strong>{selectedUser.name}</strong>?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                They will regain full access to the platform.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleUnblockUser}
                  disabled={processingId === selectedUser._id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {processingId === selectedUser._id &&
                  actionType === "unblock" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                  Unblock
                </button>
                <button
                  onClick={closeAllModals}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Make Admin Modal */}
      {showMakeAdminModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                Make Admin
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
                Are you sure you want to promote{" "}
                <strong>{selectedUser.name}</strong> to Admin?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                They will have full administrative access to the platform.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleMakeAdmin}
                  disabled={processingId === selectedUser._id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {processingId === selectedUser._id &&
                  actionType === "makeAdmin" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  Promote to Admin
                </button>
                <button
                  onClick={closeAllModals}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Admin Modal */}
      {showRemoveAdminModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldOff className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                Remove Admin
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
                Are you sure you want to remove admin privileges from{" "}
                <strong>{selectedUser.name}</strong>?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                They will be demoted to a standard member role.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleRemoveAdmin}
                  disabled={processingId === selectedUser._id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {processingId === selectedUser._id &&
                  actionType === "removeAdmin" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldOff className="w-4 h-4" />
                  )}
                  Remove Admin
                </button>
                <button
                  onClick={closeAllModals}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                Delete User
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
                Are you sure you want to permanently delete{" "}
                <strong>{selectedUser.name}</strong>?
              </p>
              <p className="text-sm text-red-500 dark:text-red-400 text-center mb-6">
                This action cannot be undone. All associated data will be
                permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteUser}
                  disabled={processingId === selectedUser._id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {processingId === selectedUser._id &&
                  actionType === "delete" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete Permanently
                </button>
                <button
                  onClick={closeAllModals}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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

export default ManageUsers;