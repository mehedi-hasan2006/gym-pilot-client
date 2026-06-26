"use client";
import React, { useState, useEffect } from "react";
import { Heart, Clock, Dumbbell, Users, Trash2 } from "lucide-react";
import Link from "next/link";
import { getFavoriteClasses, toggleFavorite } from "@/lib/user/user";
import Image from "next/image";

const FavoriteClasses = ({ user }) => {
  const [favoriteClasses, setFavoriteClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingIds, setRemovingIds] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getFavoriteClasses(user?.id);

      if (response?.success) {
        setFavoriteClasses(response.data || []);
      } else {
        setFavoriteClasses([]);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Failed to load favorite classes");
      setFavoriteClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (classId) => {
    setRemovingIds((prev) => [...prev, classId]);

    try {
      await toggleFavorite(classId, user.id);

      setFavoriteClasses((prev) => prev.filter((cls) => cls._id !== classId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setRemovingIds((prev) => prev.filter((id) => id !== classId));
    }
  };

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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Favorite Classes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your saved classes for quick access
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {favoriteClasses.length}{" "}
            {favoriteClasses.length === 1 ? "class" : "classes"} saved
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-center">
              {error}
            </p>
            <button
              onClick={fetchFavorites}
              className="mt-2 mx-auto block text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Favorites Grid */}
        {favoriteClasses.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No favorite classes yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Browse our classes and click the heart icon to save your favorites
            </p>
            <Link
              href="/all-classes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Dumbbell className="w-5 h-5" />
              Explore Classes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteClasses.map((cls) => (
              <div
                key={cls._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-gray-900/50 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all duration-300 hover:scale-[1.02] group relative"
              >
                {/* Remove Favorite Button */}
                <button
                  onClick={() => handleRemoveFavorite(cls._id)}
                  disabled={removingIds.includes(cls._id)}
                  className="absolute top-3 left-3 z-10 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 transform hover:scale-110 disabled:opacity-50"
                  title="Remove from favorites"
                >
                  {removingIds.includes(cls._id) ? (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-5 h-5 text-red-500" />
                  )}
                </button>

                {/* Favorite Indicator */}
                <div className="absolute top-3 right-3 z-10 p-2 bg-red-500 rounded-full shadow-lg">
                  <Heart className="w-4 h-4 text-white fill-current" />
                </div>

                {/* Class Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={cls.image}
                    alt={cls.className}
                    height={48}
                    width={70}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
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

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${cls.price}
                    </span>
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

export default FavoriteClasses;
