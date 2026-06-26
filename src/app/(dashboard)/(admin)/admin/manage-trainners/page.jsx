"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  UserCog,
  UserX,
  UserCheck,
  Users,
  Eye,
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
  Star,
  Award,
  X,
  Ban,
  UserMinus,
  Shield,
  ShieldAlert,
  Activity,
  UserCircle,
  BarChart3,
  TrendingUp,
  Clock3,
  Briefcase,
  Target,
  SlidersHorizontal,
  MessageSquare,
  Phone,
  MapPin,
} from "lucide-react";
import {
  getTrainers,
  demoteTrainerToUser,
  getTrainerStats,
  updateTrainerStatus,
} from "@/lib/trainner/trainner";
import { Avatar } from "@heroui/react";

const ManageTrainers = () => {
  const router = useRouter();

  // State management
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    topRated: 0,
    newThisMonth: 0,
    averageExperience: 0,
    totalClients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  console.log(selectedTrainer);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDemoteModal, setShowDemoteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  // Demote reason
  const [demoteReason, setDemoteReason] = useState("");
  const [demoteErrors, setDemoteErrors] = useState({});

  // Processing states
  const [processingId, setProcessingId] = useState(null);
  const [actionType, setActionType] = useState(null);

  // Fetch trainers
  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [trainersData, statsData] = await Promise.all([
        getTrainers(),
        getTrainerStats(),
      ]);

      if (trainersData) {
        setTrainers(trainersData.data);
        setFilteredTrainers(trainersData.data);
      }

      if (statsData) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error("Error fetching trainers:", error);
      setError(error.message || "Failed to load trainers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  // Apply filters and search
  useEffect(() => {
    let result = [...trainers];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (trainer) =>
          trainer.name?.toLowerCase().includes(searchLower) ||
          trainer.email?.toLowerCase().includes(searchLower) ||
          trainer.specialty?.toLowerCase().includes(searchLower) ||
          trainer.bio?.toLowerCase().includes(searchLower),
      );
    }

    // Specialty filter
    if (specialtyFilter !== "All") {
      result = result.filter(
        (trainer) => trainer.specialty === specialtyFilter,
      );
    }

    // Experience filter
    if (experienceFilter !== "All") {
      switch (experienceFilter) {
        case "Beginner (0-2 years)":
          result = result.filter((trainer) => trainer.experience <= 2);
          break;
        case "Intermediate (3-5 years)":
          result = result.filter(
            (trainer) => trainer.experience >= 3 && trainer.experience <= 5,
          );
          break;
        case "Advanced (6-10 years)":
          result = result.filter(
            (trainer) => trainer.experience >= 6 && trainer.experience <= 10,
          );
          break;
        case "Expert (10+ years)":
          result = result.filter((trainer) => trainer.experience > 10);
          break;
        default:
          break;
      }
    }

    // Availability filter
    if (availabilityFilter !== "All") {
      result = result.filter(
        (trainer) => trainer.availability === availabilityFilter,
      );
    }

    // Rating filter
    if (ratingFilter !== "All") {
      const minRating = parseFloat(ratingFilter);
      result = result.filter((trainer) => trainer.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "experience-high":
        result.sort((a, b) => b.experience - a.experience);
        break;
      case "experience-low":
        result.sort((a, b) => a.experience - b.experience);
        break;
      case "rating-high":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "name-asc":
        result.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name?.localeCompare(a.name));
        break;
      case "clients-high":
        result.sort((a, b) => (b.clients || 0) - (a.clients || 0));
        break;
      case "clients-low":
        result.sort((a, b) => (a.clients || 0) - (b.clients || 0));
        break;
      default:
        break;
    }

    setFilteredTrainers(result);
    setCurrentPage(1);
  }, [
    trainers,
    searchTerm,
    specialtyFilter,
    experienceFilter,
    availabilityFilter,
    ratingFilter,
    sortBy,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTrainers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTrainers = filteredTrainers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Get unique specialties for filter
  const specialties = [
    ...new Set(trainers.map((trainer) => trainer.specialty)),
  ].sort();

  // Get unique availabilities for filter
  const availabilities = [
    ...new Set(trainers.map((trainer) => trainer.availability)),
  ].sort();

  // Handle demote trainer
  const handleDemoteTrainer = async () => {
    if (!demoteReason || demoteReason.trim().length < 10) {
      setDemoteErrors({
        reason:
          "Please provide a detailed reason for demotion (minimum 10 characters)",
      });
      return;
    }

    setProcessingId(selectedTrainer?._id);
    setActionType("demote");

    try {
      const response = await demoteTrainerToUser(selectedTrainer._id, {
        reason: demoteReason.trim(),
        demotedAt: new Date().toISOString(),
      });

      if (response.success) {
        setSuccessMessage(
          `${selectedTrainer.name} has been demoted to standard user successfully!`,
        );
        fetchTrainers();
        closeAllModals();
      }
    } catch (error) {
      setError(error.message || "Failed to demote trainer");
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  // Handle suspend trainer
  const handleSuspendTrainer = async () => {
    setProcessingId(selectedTrainer?._id);
    setActionType("suspend");

    try {
      const response = await updateTrainerStatus(selectedTrainer._id, {
        status: "Suspended",
        suspendedAt: new Date().toISOString(),
      });

      if (response.success) {
        setSuccessMessage(
          `${selectedTrainer.name} has been suspended successfully!`,
        );
        fetchTrainers();
        closeAllModals();
      }
    } catch (error) {
      setError(error.message || "Failed to suspend trainer");
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDetailModal(false);
    setShowDemoteModal(false);
    setShowSuspendModal(false);
    setSelectedTrainer(null);
    setDemoteReason("");
    setDemoteErrors({});
  };

  // Export trainers
  const handleExport = () => {
    const data = filteredTrainers.map((trainer) => ({
      Name: trainer.name,
      Email: trainer.email,
      Specialty: trainer.specialty,
      Experience: `${trainer.experience} years`,
      Rating: trainer.rating || "N/A",
      Clients: trainer.clients || 0,
      Availability: trainer.availability,
      Status: trainer.status,
      "Joined Date": new Date(trainer.createdAt).toLocaleDateString(),
      Certification: trainer.certification || "N/A",
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
      `trainers_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get rating stars
  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400/50 text-yellow-400"
          />,
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300 dark:text-gray-600" />,
        );
      }
    }
    return stars;
  };

  // Get experience level badge
  const getExperienceLevel = (years) => {
    if (years >= 10)
      return {
        label: "Expert",
        className:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      };
    if (years >= 6)
      return {
        label: "Advanced",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      };
    if (years >= 3)
      return {
        label: "Intermediate",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      };
    return {
      label: "Beginner",
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
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
      Suspended: {
        icon: Clock,
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        label: "Suspended",
      },
      Inactive: {
        icon: XCircle,
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        label: "Inactive",
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
  if (loading && trainers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading trainers...
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
                Trainer Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage all active trainers on the platform
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
                onClick={fetchTrainers}
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
                  Total Trainers
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
                <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Top Rated
                </p>
                <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                  {stats.topRated}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  New This Month
                </p>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  {stats.newThisMonth}
                </p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Avg. Experience
                </p>
                <p className="text-xl font-bold text-teal-600 dark:text-teal-400 mt-1">
                  {stats.averageExperience}y
                </p>
              </div>
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Clients
                </p>
                <p className="text-xl font-bold text-pink-600 dark:text-pink-400 mt-1">
                  {stats.totalClients}
                </p>
              </div>
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-pink-600 dark:text-pink-400" />
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
                placeholder="Search by name, email, specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="experience-high">Highest Experience</option>
              <option value="experience-low">Lowest Experience</option>
              <option value="rating-high">Highest Rated</option>
              <option value="rating-low">Lowest Rated</option>
              <option value="clients-high">Most Clients</option>
              <option value="clients-low">Least Clients</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specialty
                  </label>
                  <select
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                  >
                    <option value="All">All Specialties</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                  >
                    <option value="All">All Levels</option>
                    <option value="Beginner (0-2 years)">
                      Beginner (0-2 years)
                    </option>
                    <option value="Intermediate (3-5 years)">
                      Intermediate (3-5 years)
                    </option>
                    <option value="Advanced (6-10 years)">
                      Advanced (6-10 years)
                    </option>
                    <option value="Expert (10+ years)">
                      Expert (10+ years)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Availability
                  </label>
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                  >
                    <option value="All">All Availability</option>
                    {availabilities.map((availability) => (
                      <option key={availability} value={availability}>
                        {availability}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                  >
                    <option value="All">All Ratings</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4.0+ Stars</option>
                    <option value="3">3.0+ Stars</option>
                    <option value="2">2.0+ Stars</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSpecialtyFilter("All");
                      setExperienceFilter("All");
                      setAvailabilityFilter("All");
                      setRatingFilter("All");
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

        {/* Trainers Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trainer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Specialty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Clients
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedTrainers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      <UserCog className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium">No trainers found</p>
                      <p className="text-sm">
                        {searchTerm ||
                        specialtyFilter !== "All" ||
                        experienceFilter !== "All"
                          ? "Try adjusting your filters"
                          : "No trainers registered yet"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedTrainers.map((trainer) => {
                    const expLevel = getExperienceLevel(trainer.experience);
                    return (
                      <tr
                        key={trainer._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                <Avatar>
                                  <Avatar.Image
                                    alt={trainer?.name}
                                    src={trainer?.image}
                                  />
                                  <Avatar.Fallback>
                                    {trainer?.name?.charAt(0) || "U"}
                                  </Avatar.Fallback>
                                </Avatar>
                              </div>
                              {trainer.rating >= 4.5 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                  <Star className="w-3 h-3 text-white fill-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {trainer.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {trainer.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                            <Award className="w-3.5 h-3.5" />
                            {trainer.specialty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {trainer.experience} years
                            </p>
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${expLevel.className}`}
                            >
                              {expLevel.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {getRatingStars(trainer.rating)}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                              {trainer.rating?.toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-white font-medium">
                              {trainer.clients || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(trainer.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View Details */}
                            <button
                              onClick={() => {
                                setSelectedTrainer(trainer);
                                setShowDetailModal(true);
                              }}
                              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Suspend/Activate Button */}
                            {trainer.status === "Active" ? (
                              <button
                                // onClick={() => {
                                //   setSelectedTrainer(trainer);
                                //   setShowSuspendModal(true);
                                // }}
                                className="p-2 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                                title="Suspend Trainer"
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                // onClick={() => handleSuspendTrainer()}
                                className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                title="Activate Trainer"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}

                            {/* Demote to User Button */}
                            <button
                              onClick={() => {
                                setSelectedTrainer(trainer);
                                setShowDemoteModal(true);
                              }}
                              disabled={
                                processingId === trainer._id &&
                                actionType === "demote"
                              }
                              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                              title="Demote to User"
                            >
                              {processingId === trainer._id &&
                              actionType === "demote" ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <UserMinus className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredTrainers.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredTrainers.length)}{" "}
                of {filteredTrainers.length} trainers
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
      {showDetailModal && selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Trainer Details
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
                <div className="relative">
                  <div className="w-20 h-20  rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    <Avatar>
                      <Avatar.Image
                        alt={selectedTrainer?.name}
                        src={selectedTrainer?.image}
                      />
                      <Avatar.Fallback>
                        {selectedTrainer?.name?.charAt(0) || "U"}
                      </Avatar.Fallback>
                    </Avatar>
                  </div>
                  {selectedTrainer.rating >= 4.5 && (
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedTrainer.name}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {selectedTrainer.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(selectedTrainer.status)}
                    <div className="flex items-center gap-1">
                      {getRatingStars(selectedTrainer.rating)}
                      <span className="text-sm font-medium">
                        {selectedTrainer.rating?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Specialty
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedTrainer.specialty}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Experience
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedTrainer.experience} years
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Availability
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedTrainer.availability}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total Clients
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedTrainer.clients || 0}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Certification
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedTrainer.certification || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Joined Date
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedTrainer.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>

              {selectedTrainer.bio && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Bio
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedTrainer.bio}
                  </p>
                </div>
              )}

              {selectedTrainer.socialLinks && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Social Links
                  </p>
                  <div className="flex gap-3">
                    {selectedTrainer.socialLinks.instagram && (
                      <a
                        href={selectedTrainer.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700"
                      >
                        {/* <Instagram className="w-5 h-5" /> */}
                      </a>
                    )}
                    {selectedTrainer.socialLinks.facebook && (
                      <a
                        href={selectedTrainer.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {/* <Facebook className="w-5 h-5" /> */}
                      </a>
                    )}
                    {selectedTrainer.socialLinks.twitter && (
                      <a
                        href={selectedTrainer.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-500 hover:text-sky-600"
                      >
                        {/* <Twitter className="w-5 h-5" /> */}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {selectedTrainer.demotionHistory && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-2">
                    Previous Demotions
                  </p>
                  {selectedTrainer.demotionHistory.map((record, index) => (
                    <div
                      key={index}
                      className="text-sm text-yellow-700 dark:text-yellow-300 mb-1"
                    >
                      <p>
                        {new Date(record.date).toLocaleDateString()}:{" "}
                        {record.reason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setShowDemoteModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <UserMinus className="w-4 h-4" />
                Demote to User
              </button>
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

      {/* Demote Trainer Modal */}
      {showDemoteModal && selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserMinus className="w-5 h-5 text-red-500" />
                Demote Trainer to User
              </h3>
              <button
                onClick={closeAllModals}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Warning: This action cannot be undone
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      You are about to remove trainer privileges from{" "}
                      <strong>{selectedTrainer.name}</strong>. They will lose
                      access to all trainer features including:
                    </p>
                    <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                      <li>Ability to create and manage classes</li>
                      <li>Access to client management tools</li>
                      <li>Trainer dashboard and analytics</li>
                      <li>Revenue and payment features</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trainer Summary
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Specialty:
                    </span>{" "}
                    <span className="font-medium">
                      {selectedTrainer.specialty}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Experience:
                    </span>{" "}
                    <span className="font-medium">
                      {selectedTrainer.experience} years
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Rating:
                    </span>{" "}
                    <span className="font-medium">
                      {selectedTrainer.rating?.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Clients:
                    </span>{" "}
                    <span className="font-medium">
                      {selectedTrainer.clients || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Demotion *
                </label>
                <textarea
                  value={demoteReason}
                  onChange={(e) => {
                    setDemoteReason(e.target.value);
                    if (demoteErrors.reason) {
                      setDemoteErrors({});
                    }
                  }}
                  rows="4"
                  maxLength="500"
                  placeholder="Provide a detailed reason for removing trainer privileges (minimum 10 characters)..."
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-gray-100 resize-none ${
                    demoteErrors.reason
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {demoteReason.length}/500 characters
                  </p>
                  {demoteErrors.reason && (
                    <p className="text-xs text-red-500">
                      {demoteErrors.reason}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={handleDemoteTrainer}
                disabled={processingId === selectedTrainer._id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {processingId === selectedTrainer._id &&
                actionType === "demote" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserMinus className="w-4 h-4" />
                )}
                Confirm Demotion
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

      {/* Suspend Trainer Modal */}
      {showSuspendModal && selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                Suspend Trainer
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
                Are you sure you want to suspend{" "}
                <strong>{selectedTrainer.name}</strong>?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                They will be temporarily unable to conduct classes or access
                trainer features.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleSuspendTrainer}
                  disabled={processingId === selectedTrainer._id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  {processingId === selectedTrainer._id &&
                  actionType === "suspend" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  Suspend
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

export default ManageTrainers;
