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
} from "lucide-react";
import { getApprovedClassById } from "@/lib/class/class";
import { useRouter } from "next/navigation";
import { toast } from "@heroui/react";

const ClassDetails = ({ id, user }) => {
  const navigate = useRouter();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingBooking, setCheckingBooking] = useState(true);
  const [checkingFavorite, setCheckingFavorite] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchClassDetails();
  }, [id]);

  useEffect(() => {
    if (classData && user) {
      checkBookingStatus();
      checkFavoriteStatus();
    }
  }, [classData, user]);

  const fetchClassDetails = async () => {
    try {
      //  actual API
      const data = await getApprovedClassById(`${id}`);

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
      // Check if user has already booked this class
      const response = await fetch(
        `/api/bookings/check?classId=${id}&userId=${user._id}`,
      );
      const data = await response.json();
      setIsBooked(data.isBooked);
      setCheckingBooking(false);
    } catch (error) {
      console.error("Error checking booking status:", error);
      setCheckingBooking(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      // Check if class is in user's favorites
      const response = await fetch(
        `/api/favorites/check?classId=${id}&userId=${user._id}`,
      );
      const data = await response.json();
      setIsFavorite(data.isFavorite);
      setCheckingFavorite(false);
    } catch (error) {
      console.error("Error checking favorite status:", error);
      setCheckingFavorite(false);
    }
  };

  const handleBookNow = async () => {
    if (isBooked) {
      toast.danger("You have already booked this class");
      return;
    }

    // Double-check from database
    setProcessing(true);
    try {
      const response = await fetch(
        `/api/bookings/check?classId=${id}&userId=${user._id}`,
      );
      const data = await response.json();

      if (data.isBooked) {
        setIsBooked(true);
        toast.danger("You have already booked this class");
      } else {
        // Redirect to payment page
        navigate(`/payment/${id}`, {
          state: {
            classData: classData,
          },
        });
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      toast.danger("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleFavorite = async () => {
    setProcessing(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch("/api/favorites/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classId: id,
            userId: user._id,
          }),
        });

        if (response.ok) {
          setIsFavorite(false);
          toast.success("Removed from favorites");
        }
      } else {
        // Add to favorites
        const response = await fetch("/api/favorites/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classId: id,
            userId: user._id,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsFavorite(true);
          toast.success("Successfully added to your favorites!");
        } else if (data.message === "Already in favorites") {
          setIsFavorite(true);
          toast.danger("This class is already in your favorites");
        }
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.danger("Failed to update favorites");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Class Not Found
          </h2>
          <button
            onClick={() => navigate("/classes")}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Classes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/classes")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Classes
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Image Section */}
          <div className="relative h-64 sm:h-80 lg:h-96">
            <img
              src={classData.image}
              alt={classData.className}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {classData.className}
              </h1>
              <div className="flex items-center text-white/90 space-x-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {classData.category}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {classData.difficultyLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {classData.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${classData.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-purple-50 p-3 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Trainer</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {classData.trainnerName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-orange-50 p-3 rounded-lg">
                <Star className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-xs text-gray-500">Level</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {classData.difficultyLevel}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {classData.description}
              </p>
            </div>

            {/* Schedule */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                <Calendar className="inline-block h-5 w-5 mr-2" />
                Class Schedule
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {classData.schedules?.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <span className="font-medium text-gray-900">
                      {schedule.day}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trainer Info */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Trainer Information
              </h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {classData.trainnerName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {classData.trainnerName}
                  </p>
                  <p className="text-sm text-gray-500">
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
                    transition-all duration-200
                    ${
                      isBooked
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {isBooked ? (
                    <span className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Already Booked
                    </span>
                  ) : processing ? (
                    "Processing..."
                  ) : (
                    "Book Now"
                  )}
                </button>
              )}

              {/* Add to Favorites Button */}
              {!checkingFavorite && (
                <button
                  onClick={handleToggleFavorite}
                  disabled={processing}
                  className={`
                    flex-1 py-3 px-6 rounded-lg font-medium text-lg
                    border-2 transition-all duration-200
                    ${
                      isFavorite
                        ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <span className="flex items-center justify-center">
                    <Heart
                      className={`h-5 w-5 mr-2 ${isFavorite ? "fill-current" : ""}`}
                    />
                    {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
