"use client";
import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  Users,
  DollarSign,
  Heart,
  Star,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getApprovedClassById } from "@/lib/class/class";
import { useRouter } from "next/navigation";
import { toast } from "@heroui/react";
import Link from "next/link";
import {
  bookClass,
  getBookingStatus,
  getFavoriteClasses,
} from "@/lib/booking/booking";
import { toggleFavorite } from "@/lib/user/user";

const ClassDetails = ({ id, user, res }) => {
  const navigate = useRouter();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [checkingBooking, setCheckingBooking] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [togglingIds, setTogglingIds] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    fetchClassDetails();
  }, [id]);

  useEffect(() => {
    if (classData && user) {
      checkBookingStatus();
    }
  }, [classData, user]);

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoadingFavorites(true);
      const res = await getFavoriteClasses(user.id);

      if (res.success) {
        // Extract class IDs from favorites
        const ids = res.data.map((item) => item._id || item.classId);
        setFavorites(ids);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavorites([]);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const fetchClassDetails = async () => {
    try {
      const data = res;
      setClassData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching class details:", error);
      toast.danger("Failed to load class details");
      setLoading(false);
    }
  };

  const checkBookingStatus = async () => {
    try {
      const bookStatus = await getBookingStatus(user.id, id);
      setIsBooked(bookStatus.isBooked);
    } catch (error) {
      console.error("Error checking booking status:", error);
    } finally {
      setCheckingBooking(false);
    }
  };

  const handleBookNow = async () => {
    if (isBooked) {
      toast.danger("You have already booked this class");
      return;
    }

    if (!user?.id) {
      toast.danger("Please login first");
      return;
    }

    setProcessing(true);

    try {
      // First, create the booking
      const bookingResponse = await bookClass(id, {
        userId: user.id,
        classId: id,
        userName: user.name,
        email: user.email,
      });

      if (!bookingResponse.success) {
        toast.danger(bookingResponse.message || "Failed to create booking");
        setProcessing(false);
        return;
      }

      toast.success("Booking created successfully!");

      // Then proceed to payment
      const paymentData = {
        classId: id,
        className: classData.className,
        price: classData.price,
        userId: user.id,
        email: user.email,
        name: user.name,
      };

      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.danger("Failed to create payment session");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.danger(error.message || "You have already booked this class.");
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) {
      toast.danger("Please login first");
      return;
    }

    const classId = classData._id || id;

    // Prevent multiple clicks
    if (togglingIds.includes(classId)) return;

    setTogglingIds((prev) => [...prev, classId]);

    try {
      const response = await toggleFavorite(classId, user.id);

      if (!response.success) {
        toast.danger(response.message || "Failed to update favorite");
        return;
      }

      // Update favorites state
      setFavorites((prev) => {
        if (prev.includes(classId)) {
          return prev.filter((favId) => favId !== classId);
        }
        return [...prev, classId];
      });

      toast.success(response.message || "Favorites updated successfully");
    } catch (error) {
      console.error("Favorite Error:", error);
      toast.danger("Something went wrong");
    } finally {
      setTogglingIds((prev) => prev.filter((favId) => favId !== classId));
    }
  };

  const isFavorite = (classId) => favorites.includes(classId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Class Not Found
          </h2>
          <Link href="/all-classes">
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              Back to Classes
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const classId = classData._id || id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/all-classes">
          <button className="text-blue-600 dark:text-blue-400 flex items-center cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Classes
          </button>
        </Link>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-gray-900/50 overflow-hidden transition-all duration-200">
          {/* Image Section */}
          <div className="relative h-64 sm:h-80 lg:h-96">
            <img
              src={classData.image}
              alt={classData.className}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>

            {/* Favorite Button on Image */}
            <button
              onClick={handleToggleFavorite}
              disabled={togglingIds.includes(classId) || loadingFavorites}
              className="absolute top-4 right-4 p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
              title={
                isFavorite(classId)
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              {togglingIds.includes(classId) ? (
                <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
              ) : (
                <Heart
                  className={`w-6 h-6 transition-all duration-300 ${
                    isFavorite(classId)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                />
              )}
            </button>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {classData.className}
              </h1>
              <div className="flex items-center text-white/90 space-x-4">
                <span className="bg-white/20 dark:bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {classData.category}
                </span>
                <span className="bg-white/20 dark:bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {classData.difficultyLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8">
            {/* Quick Info Grid */}
            {/* Info Cards + Booking Badge */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {classData.duration}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-100 dark:border-green-800">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ${classData.price}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full border border-purple-100 dark:border-purple-800">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {classData.trainnerName}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-full border border-orange-100 dark:border-orange-800">
                <Star className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {classData.difficultyLevel}
                </span>
              </div>

              {classData.bookingCount > 0 && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg shadow-rose-500/25">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-bold">
                    {classData.bookingCount} Enrolled
                  </span>
                  {classData.maxCapacity && (
                    <span className="text-xs opacity-90">
                      / {classData.maxCapacity}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {classData.description}
              </p>
            </div>

            {/* Schedule */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                <Calendar className="inline-block h-5 w-5 mr-2" />
                Class Schedule
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {classData.schedules?.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors hover:border-blue-300 dark:hover:border-blue-700"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {schedule.day}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trainer Info */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Trainer Information
              </h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {classData.trainnerName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {classData.trainnerName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {classData.trainnerEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Book Now Button */}
              {!checkingBooking && (
                <button
                  onClick={handleBookNow}
                  disabled={isBooked || processing}
                  className={`
                    flex-1 py-3 px-6 rounded-lg font-medium text-lg
                    transition-all duration-200 transform hover:scale-[1.02]
                    ${
                      isBooked
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 shadow-lg hover:shadow-xl"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  `}
                >
                  {isBooked ? (
                    <span className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Already Booked
                    </span>
                  ) : processing ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Book Now"
                  )}
                </button>
              )}

              {/* Add to Favorites Button */}
              <button
                onClick={handleToggleFavorite}
                disabled={togglingIds.includes(classId) || loadingFavorites}
                className={`
                  py-3 px-6 rounded-lg font-medium text-lg
                  transition-all duration-200 transform hover:scale-[1.02]
                  flex items-center justify-center gap-2
                  ${
                    isFavorite(classId)
                      ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                `}
                title={
                  isFavorite(classId)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                {togglingIds.includes(classId) ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Heart
                    className={`w-6 h-6 transition-all ${
                      isFavorite(classId) ? "fill-current" : ""
                    }`}
                  />
                )}
                {isFavorite(classId)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
