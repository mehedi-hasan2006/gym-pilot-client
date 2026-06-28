"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Clock,
  FileText,
  User,
  Mail,
  Calendar,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Info,
  Star,
} from "lucide-react";
import {
  createApplication,
  getApplicationByUser,
} from "@/lib/application/application";

const ApplyTrainer = ({ user }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    experience: "",
    specialty: "",
    otherSpecialty: "",
    certification: "",
    bio: "",
    availability: "Flexible",
    status: "Pending",
  });

  const specialties = [
    { value: "Yoga", label: "Yoga", icon: "🧘" },
    { value: "Weights", label: "Weights", icon: "🏋️" },
    { value: "Cardio", label: "Cardio", icon: "🏃" },
    { value: "Pilates", label: "Pilates", icon: "💪" },
    { value: "CrossFit", label: "CrossFit", icon: "🏆" },
    { value: "Martial Arts", label: "Martial Arts", icon: "🥋" },
    { value: "Dance", label: "Dance", icon: "💃" },
    { value: "Swimming", label: "Swimming", icon: "🏊" },
    { value: "Cycling", label: "Cycling", icon: "🚴" },
    { value: "Other", label: "Other", icon: "✨" },
  ];

  const availabilityOptions = [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Weekends", label: "Weekends" },
    { value: "Evenings", label: "Evenings" },
    { value: "Flexible", label: "Flexible" },
  ];

  // Check for existing application
  const checkExistingApplication = async () => {
    if (!user?.id) {
      setCheckingStatus(false);
      return;
    }

    setCheckingStatus(true);

    try {
      const response = await getApplicationByUser(user.id);
      console.log("Existing Application Response:", response);

      // Handle different response formats
      if (response?.success && response?.data) {
        setExistingApplication(response.data);
      } else if (response?.data) {
        setExistingApplication(response.data);
      } else if (response?._id || response?.status) {
        // Direct application object
        setExistingApplication(response);
      } else {
        setExistingApplication(null);
      }
    } catch (error) {
      console.log("No existing application found:", error.message);
      setExistingApplication(null);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkExistingApplication();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await createApplication({
        ...formData,
        userId: user.id,
        name: user.name,
        email: user.email,
      });

      console.log("Create Application Response:", response);

      if (response?.success) {
        setSuccessMessage(response.message || "Application submitted successfully!");

        // Reset form
        setFormData({
          experience: "",
          specialty: "",
          otherSpecialty: "",
          certification: "",
          bio: "",
          availability: "Flexible",
          status: "Pending",
        });

        // IMPORTANT: Fetch the updated application immediately
        await checkExistingApplication();

        // Scroll to top to show the application status
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrorMessage(response?.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      setErrorMessage(
        error?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Pending Review</span>
          </div>
        );
      case "Approved":
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Approved</span>
          </div>
        );
      case "Rejected":
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Rejected</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Loading state while checking for existing application
  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Checking application status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Apply as Trainer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Share your expertise and inspire others. Fill out the form below to
            apply for a trainer position.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3 animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800 dark:text-green-200 font-medium">
                Success!
              </p>
              <p className="text-green-700 dark:text-green-300 text-sm">
                {successMessage}
              </p>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-green-500 hover:text-green-700 shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 dark:text-red-200 font-medium">
                Error
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setErrorMessage("")}
              className="text-red-500 hover:text-red-700 shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Existing Application Status */}
        {existingApplication && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Application
              </h2>
              {getStatusBadge(existingApplication.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Specialty</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {existingApplication.specialty || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Experience</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {existingApplication.experience || 0} years
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Availability</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {existingApplication.availability || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Applied on</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {existingApplication.createdAt
                    ? new Date(existingApplication.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            {existingApplication.certification && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Certification
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {existingApplication.certification}
                </p>
              </div>
            )}

            {existingApplication.reviewNotes && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-1">
                  Review Notes
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  {existingApplication.reviewNotes}
                </p>
              </div>
            )}

            {existingApplication.rejectionReason && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">
                  Rejection Reason
                </p>
                <p className="text-red-700 dark:text-red-300">
                  {existingApplication.rejectionReason}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Application Form - Show if no application or rejected */}
        {(!existingApplication ||
          existingApplication.status === "Rejected") && (
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-4 border-b border-gray-200 dark:border-gray-700">
                {existingApplication?.status === "Rejected"
                  ? "Re-apply as Trainer"
                  : "Trainer Application Form"}
              </h2>

              {/* User Info (Read Only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Star className="w-4 h-4 inline mr-1" />
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  step="0.5"
                  placeholder="Enter years of experience"
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Award className="w-4 h-4 inline mr-1" />
                  Specialty *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {specialties.map((specialty) => (
                    <button
                      key={specialty.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          specialty: specialty.value,
                        }))
                      }
                      className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                        formData.specialty === specialty.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-md"
                          : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <span className="text-2xl block mb-1">
                        {specialty.icon}
                      </span>
                      <span className="text-sm font-medium">
                        {specialty.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Other Specialty */}
              {formData.specialty === "Other" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Please specify your specialty *
                  </label>
                  <input
                    type="text"
                    name="otherSpecialty"
                    value={formData.otherSpecialty}
                    onChange={handleChange}
                    placeholder="Enter your specialty"
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
              )}

              {/* Certification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Certification (Optional)
                </label>
                <input
                  type="text"
                  name="certification"
                  value={formData.certification}
                  onChange={handleChange}
                  placeholder="e.g., ACE, NASM, ISSA"
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Availability *
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Info className="w-4 h-4 inline mr-1" />
                  Short Bio (Optional)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  maxLength="500"
                  placeholder="Tell us about yourself and your training philosophy..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || user?.role === "trainer"}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </span>
                  ) : existingApplication?.status === "Rejected" ? (
                    "Re-submit Application"
                  ) : (
                    "Submit Application"
                  )}
                </button>

                {user?.role === "trainer" && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center mt-3">
                    You are already registered as a trainer.
                  </p>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyTrainer;