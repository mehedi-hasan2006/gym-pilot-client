"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, Clock, Dumbbell, Users, Heart } from "lucide-react";
import Link from "next/link";
import { getApprovedClasses } from "@/lib/class/class";
import { toggleFavorite, getFavoriteClasses } from "@/lib/user/user";
import Image from "next/image";
import { toast } from "@heroui/react";

const MemberAllClasses = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [togglingIds, setTogglingIds] = useState([]); // Track which favorites are being toggled

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [classesRes, favoritesRes] = await Promise.all([
        getApprovedClasses(),
        user?.id
          ? getFavoriteClasses(user.id)
          : Promise.resolve({ success: true, data: [] }),
      ]);

      const classList = classesRes || [];

      setClasses(classList);

      setCategories(["All", ...new Set(classList.map((c) => c.category))]);

      const favoriteIds = favoritesRes?.success
        ? favoritesRes.data.map((cls) => cls._id)
        : [];

      setFavorites(favoriteIds);
    } catch (error) {
      console.error(error);
      setClasses([]);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (classId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) {
      alert("Please log in to save favorites");
      return;
    }

    // Add to toggling state
    setTogglingIds((prev) => [...prev, classId]);

    try {
      await toggleFavorite(classId, user.id);

      // Update favorites state
      setFavorites((prev) => {
        if (prev.includes(classId)) {
          return prev.filter((id) => id !== classId);
        } else {
          return [...prev, classId];
        }
      });
      toast.success("Favorites updated successfully");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorite. Please try again.");
    } finally {
      // Remove from toggling state
      setTogglingIds((prev) => prev.filter((id) => id !== classId));
    }
  };

  const isFavorite = (classId) => favorites.includes(classId);

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.className
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || cls.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || favorites.includes(cls._id);

    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const getDifficultyColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Our Fitness Classes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find the perfect class to achieve your fitness goals
          </p>
          {user && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              Click the heart icon to save your favorite classes
            </p>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:focus:border-transparent transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:focus:border-transparent transition-colors cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Favorites Toggle */}
          {user && (
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                showFavoritesOnly
                  ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-300 dark:hover:border-red-700"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${showFavoritesOnly ? "fill-current" : ""}`}
              />
              <span>
                Favorites
                {favorites.length > 0 && ` (${favorites.length})`}
              </span>
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600 dark:text-gray-400">
          {showFavoritesOnly ? (
            <span>
              Showing {filteredClasses.length} favorite{" "}
              {filteredClasses.length === 1 ? "class" : "classes"} out of{" "}
              {favorites.length} saved
            </span>
          ) : (
            <span>
              Showing {filteredClasses.length}{" "}
              {filteredClasses.length === 1 ? "class" : "classes"}
            </span>
          )}
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <div className="text-center py-12">
            <Dumbbell className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {showFavoritesOnly ? "No favorite classes" : "No classes found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {showFavoritesOnly
                ? "You haven't saved any classes yet. Browse classes and click the heart icon to save them."
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClasses.map((cls) => (
              <div
                key={cls._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-gray-900/50 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all duration-300 hover:scale-[1.02] group relative"
              >
                {/* Favorite Button */}
                {user && (
                  <button
                    onClick={(e) => handleToggleFavorite(cls._id, e)}
                    disabled={togglingIds.includes(cls._id)}
                    className={`absolute top-3 left-3 z-10 p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                      isFavorite(cls._id)
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 hover:text-red-500 shadow-md"
                    } ${togglingIds.includes(cls._id) ? "opacity-50" : ""}`}
                    title={
                      isFavorite(cls._id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {togglingIds.includes(cls._id) ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite(cls._id) ? "fill-current" : ""
                        }`}
                      />
                    )}
                  </button>
                )}

                {/* Class Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={cls.image}
                    alt={cls.className}
                    height={48}
                    width={70}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-semibold shadow-lg dark:shadow-gray-900/50 text-gray-900 dark:text-white backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
                    ${cls.price}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Class Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                      {cls.category}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(cls.difficultyLevel)}`}
                    >
                      {cls.difficultyLevel}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cls.className}
                  </h3>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{cls.duration}</span>
                    <Users className="h-4 w-4 ml-4 mr-1" />
                    <span>{cls.trainnerName}</span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {cls.description}
                  </p>

                  {/* Schedule Preview */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-500 mb-2">
                      Available Days:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {cls.schedules?.slice(0, 3).map((schedule, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
                        >
                          {schedule.day}
                        </span>
                      ))}
                      {cls.schedules?.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{cls.schedules.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link
                    href={`/all-classes/${cls._id}`}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:translate-y-[-2px]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberAllClasses;
