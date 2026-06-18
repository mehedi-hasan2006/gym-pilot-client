"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  Clock,
  Calendar,
  DollarSign,
  BookOpen,
  AlignLeft,
  Image as ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { createClass } from "@/lib/class/class";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CATEGORIES = [
  "Yoga",
  "HIIT",
  "Pilates",
  "Strength Training",
  "Cardio",
  "Dance",
  "Martial Arts",
  "Meditation",
  "CrossFit",
  "Spinning",
];

const DIFFICULTY_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "All Levels",
];

export default function AddClass({ user }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState(null);

  const [formData, setFormData] = useState({
    className: "",
    image: "",
    category: "",
    difficultyLevel: "",
    duration: "",
    schedules: [],
    price: "",
    description: "",
    status: "Pending",
  });

  // Simple toast function
  const showToast = (message, type = "danger") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 3000);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle day selection (checkbox)
  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const currentDays = prev.schedules.map((s) => s.day);
      if (currentDays.includes(day)) {
        // Remove day
        return {
          ...prev,
          schedules: prev.schedules.filter((s) => s.day !== day),
        };
      } else {
        // Add day
        return {
          ...prev,
          schedules: [...prev.schedules, { day, startTime: "", endTime: "" }],
        };
      }
    });
  };

  // Handle schedule time changes
  const handleScheduleTimeChange = (day, field, value) => {
    setFormData((prev) => {
      const updatedSchedules = prev.schedules.map((schedule) => {
        if (schedule.day === day) {
          return {
            ...schedule,
            [field]: value,
          };
        }
        return schedule;
      });
      return {
        ...prev,
        schedules: updatedSchedules,
      };
    });
  };

  // Handle image upload to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to ImgBB
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          image: data.data.url,
        }));
        showToast("Image uploaded successfully", "success");
      } else {
        showToast("Failed to upload image");
        setImagePreview(null);
      }
    } catch (error) {
      showToast("Error uploading image");
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.className.trim()) {
      showToast("Class name is required");
      return false;
    }
    if (!formData.image) {
      showToast("Class image is required");
      return false;
    }
    if (!formData.category) {
      showToast("Category is required");
      return false;
    }
    if (!formData.difficultyLevel) {
      showToast("Difficulty level is required");
      return false;
    }
    if (!formData.duration.trim()) {
      showToast("Duration is required");
      return false;
    }
    if (!formData.price.trim()) {
      showToast("Price is required");
      return false;
    }
    if (!formData.description.trim()) {
      showToast("Description is required");
      return false;
    }

    if (formData.schedules.length === 0) {
      showToast("Please select at least one day for the schedule");
      return false;
    }

    // Validate schedules
    const invalidSchedule = formData.schedules.some(
      (schedule) => !schedule.startTime || !schedule.endTime,
    );

    if (invalidSchedule) {
      showToast("Please complete all schedule time fields");
      return false;
    }

    // Validate time logic
    const invalidTime = formData.schedules.some(
      (schedule) => schedule.startTime >= schedule.endTime,
    );

    if (invalidTime) {
      showToast("End time must be after start time");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const classData = {
      ...formData,
      trainnerId: user?.id,
      trainnerName: user?.name,
      trainnerEmail: user?.email,
    };

    setIsSubmitting(true);

    try {
      const addClass = await createClass(classData);

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showToast("Class added successfully! Pending approval.", "success");
    } catch (error) {
      showToast("Failed to add class. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 lg:p-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg ${
              toastType === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {toastMessage}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Add New Class</h1>
          <p className="text-zinc-400">
            Create a new class listing. All new classes require admin approval.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-amber-400">
              Status: Pending Approval
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Class Name */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="size-5 text-violet-400" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Class Name *
                </label>
                <input
                  type="text"
                  name="className"
                  placeholder="Enter class name"
                  value={formData.className}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleSelectChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Difficulty Level *
                  </label>
                  <div className="space-y-2">
                    {DIFFICULTY_LEVELS.map((level) => (
                      <label
                        key={level}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="difficultyLevel"
                          value={level}
                          checked={formData.difficultyLevel === level}
                          onChange={(e) =>
                            handleSelectChange(
                              "difficultyLevel",
                              e.target.value,
                            )
                          }
                          className="w-4 h-4 text-violet-600 bg-zinc-900 border-zinc-700 focus:ring-violet-500"
                        />
                        <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="size-5 text-violet-400" />
              Class Image *
            </h2>
            <div>
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Class preview"
                    className="w-64 h-48 object-cover rounded-xl border border-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:border-violet-500/50 transition-colors cursor-pointer"
                >
                  <Upload className="size-8 text-zinc-500 mx-auto mb-2" />
                  <p className="text-sm text-zinc-400 mb-1">
                    Click to upload image
                  </p>
                  <p className="text-xs text-zinc-500">
                    PNG, JPG or WEBP (max. 5MB)
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
              {isUploading && (
                <p className="text-sm text-violet-400 mt-2">Uploading...</p>
              )}
            </div>
          </div>

          {/* Duration & Price */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="size-5 text-violet-400" />
              Duration & Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Duration *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g., 1 hour, 45 minutes"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                  <input
                    type="text"
                    name="price"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Class Schedule */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="size-5 text-violet-400" />
              Class Schedule *
            </h2>
            <div className="space-y-4">
              {/* Day Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Select Days *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <label
                      key={day}
                      className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-zinc-800/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.schedules.some((s) => s.day === day)}
                        onChange={() => handleDayToggle(day)}
                        className="w-4 h-4 text-violet-600 bg-zinc-900 border-zinc-700 rounded focus:ring-violet-500"
                      />
                      <span className="text-sm text-zinc-300">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Slots for Selected Days */}
              {formData.schedules.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-zinc-300">
                    Time Slots
                  </label>
                  {formData.schedules.map((schedule) => (
                    <div
                      key={schedule.day}
                      className="flex items-center gap-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800"
                    >
                      <div className="w-24">
                        <span className="text-sm font-medium text-violet-400">
                          {schedule.day}
                        </span>
                      </div>

                      <div className="flex-1">
                        <input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) =>
                            handleScheduleTimeChange(
                              schedule.day,
                              "startTime",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>

                      <span className="text-zinc-500 text-sm">to</span>

                      <div className="flex-1">
                        <input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) =>
                            handleScheduleTimeChange(
                              schedule.day,
                              "endTime",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDayToggle(schedule.day)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove day"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formData.schedules.length === 0 && (
                <p className="text-sm text-zinc-500">
                  Select at least one day above
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlignLeft className="size-5 text-violet-400" />
              Description *
            </h2>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Class Description
              </label>
              <textarea
                name="description"
                placeholder="Describe what students can expect from this class..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                maxLength={1000}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
              <p className="text-xs text-zinc-500 mt-2">
                {formData.description.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isSubmitting ? "Adding Class..." : "Add Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
