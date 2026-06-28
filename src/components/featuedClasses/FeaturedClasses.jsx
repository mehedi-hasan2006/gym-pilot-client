"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Loader2,
  X,
  Clock,
  User,
  DollarSign,
  Tag,
  Users,
  BookOpen,
  Dumbbell,
  Star,
  TrendingUp,
  Award,
  Flame,
  Filter,
  ArrowUpDown,
  Zap,
} from "lucide-react";
import { getFeaturedClasses } from "@/lib/class/class";
import Image from "next/image";
import Link from "next/link";

const FeaturedClasses = () => {
  const router = useRouter();

  // State
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  // Fetch classes
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getFeaturedClasses();
      if (response?.success && response?.data) {
        setClasses(response.data);
      } else if (Array.isArray(response)) {
        setClasses(response);
      }
    } catch (error) {
      console.error("Error fetching featured classes:", error);
      setError(error.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);



  // Filter and sort classes
  const filteredClasses = classes
    .filter((cls) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        cls.className?.toLowerCase().includes(searchLower) ||
        cls.trainnerName?.toLowerCase().includes(searchLower) ||
        cls.category?.toLowerCase().includes(searchLower)
      );
    })
    .filter((cls) => {
      if (categoryFilter === "All") return true;
      return cls.category === categoryFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b._id) - new Date(a._id);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "name-asc":
          return (a.className || "").localeCompare(b.className || "");
        case "name-desc":
          return (b.className || "").localeCompare(a.className || "");
        case "popular":
        default:
          return (b.bookingCount || 0) - (a.bookingCount || 0);
      }
    });

  // Stats

  const totalBookings = classes.reduce(
    (sum, c) => sum + (c.bookingCount || 0),
    0,
  );


  // Pagination
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClasses = filteredClasses.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, categoryFilter]);

  // Get difficulty color
  const getDifficultyColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Advanced":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading featured classes...
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
                Featured Classes
              </h1>
              <p className="text-gray-600 dark:text-gray-400 ml-13">
                Discover our most popular and highly-rated classes
              </p>
            </div>
            <button
              onClick={fetchClasses}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

       

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 dark:text-red-200">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-16 text-center">
            <Dumbbell className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No classes found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || categoryFilter !== "All"
                ? "Try adjusting your search or filters"
                : "No featured classes available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedClasses.map((cls, index) => (
              <div
                key={cls._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group relative"
              >
                {/* Popular Badge */}
                {index < 3 && (
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    {index === 0
                      ? "Most Popular"
                      : index === 1
                        ? "Trending"
                        : "Hot Pick"}
                  </div>
                )}

                {/* Class Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={cls.image || "/placeholder-class.jpg"}
                    alt={cls.className}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full text-sm font-bold text-gray-900 dark:text-white shadow-lg">
                      <DollarSign className="w-3.5 h-3.5 text-green-500" />$
                      {cls.price}
                    </span>
                  </div>

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-1 drop-shadow-lg">
                      {cls.className}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                        <User className="w-3 h-3" />
                        {cls.trainnerName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      {cls.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        cls.difficultyLevel,
                      )}`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {cls.difficultyLevel}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
                      <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Duration
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {cls.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
                      <Users className="w-4 h-4 text-purple-500 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Bookings
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {cls.bookingCount || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Progress Bar */}
                  {cls.bookingCount > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Popularity
                        </span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {cls.bookingCount} bookings
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              ((cls.bookingCount || 0) / (totalBookings || 1)) *
                                100 *
                                3,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Details Button */}
                  <Link
                    href={`/all-classes/${cls._id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium text-sm shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02]"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {/* {totalPages > 1 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredClasses.length)} of{" "}
              {filteredClasses.length} classes
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default FeaturedClasses;
