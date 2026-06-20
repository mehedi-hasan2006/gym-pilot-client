"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  Image as ImageIcon,
  AlignLeft,
  Type,
  Send,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { addPost } from "@/lib/class/class";

export default function AddForumPost({ user }) {
    console.log(user)
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    authorId: user?.id || "",
    authorName: user?.name || "",
    authorEmail: user?.email || "",
    authorRole: user?.role || "trainner",
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState(null);

  const showToast = (message, type = "success") => {
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

  // Handle image upload to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file (PNG, JPG, or WEBP)", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size should be less than 5MB", "error");
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
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: uploadFormData,
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
        showToast("Failed to upload image. Please try again.", "error");
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast(
        "Error uploading image. Please check your connection.",
        "error",
      );
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
    if (!formData.title.trim()) {
      showToast("Post title is required", "error");
      return false;
    }
    if (formData.title.trim().length < 5) {
      showToast("Title must be at least 5 characters long", "error");
      return false;
    }
    if (formData.title.trim().length > 200) {
      showToast("Title must be less than 200 characters", "error");
      return false;
    }
    if (!formData.image) {
      showToast("Please upload an image for your post", "error");
      return false;
    }
    if (!formData.description.trim()) {
      showToast("Description is required", "error");
      return false;
    }
    if (formData.description.trim().length < 20) {
      showToast("Description must be at least 20 characters long", "error");
      return false;
    }
    if (formData.description.trim().length > 5000) {
      showToast("Description must be less than 5000 characters", "error");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await addPost({
        ...formData,
        likes: [],
        comments: [],
        status: "active",
      });

      if (response) {
        showToast("Forum post created successfully!", "success");
        // Reset form
        setFormData({
          title: "",
          image: "",
          description: "",
          authorId: user?.id || "",
          authorName: user?.name || "",
          authorEmail: user?.email || "",
          authorRole: user?.role || "trainner",
        });
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Redirect to forum page after short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showToast(
          response.message || "Failed to create post. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("Error creating forum post:", error);
      showToast("Error creating post. Please check your connection.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 lg:p-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              toastType === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                toastType === "success" ? "bg-green-400" : "bg-red-400"
              }`}
            />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm">Back to Forum</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Create Forum Post
              </h1>
              <p className="text-zinc-400">
                Share your knowledge, tips, and experiences with the fitness
                community
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Send className="size-8 text-violet-400" />
              </div>
            </div>
          </div>

          {/* Author Info Card */}
          <div className="mt-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
              <span className="text-sm font-medium text-violet-400">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "T"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {user?.name || "Trainer"}
              </p>
              <p className="text-xs text-zinc-500">Posting as Trainer</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Section */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Type className="size-5 text-violet-400" />
              Post Title *
            </h2>
            <div>
              <input
                type="text"
                name="title"
                placeholder="Enter an engaging title for your post..."
                value={formData.title}
                onChange={handleInputChange}
                maxLength={200}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors text-lg"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-zinc-500">
                  Be specific and descriptive to attract more readers
                </p>
                <p
                  className={`text-xs ${
                    formData.title.length > 180
                      ? "text-amber-400"
                      : "text-zinc-500"
                  }`}
                >
                  {formData.title.length}/200
                </p>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="size-5 text-violet-400" />
              Post Image *
            </h2>
            <div>
              {imagePreview ? (
                <div className="relative">
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Post preview"
                      className="w-full max-h-96 object-cover rounded-xl border border-zinc-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-3 right-3 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    Image uploaded successfully
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-700 rounded-xl p-12 text-center hover:border-violet-500/50 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-violet-500/20 transition-colors">
                    <Upload className="size-8 text-violet-400" />
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">
                    Click to upload an image for your post
                  </p>
                  <p className="text-xs text-zinc-500">
                    PNG, JPG or WEBP (max. 5MB)
                  </p>
                  <p className="text-xs text-violet-400 mt-3">
                    Recommended size: 1200 x 630 pixels
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
                <div className="mt-3 flex items-center gap-2 text-sm text-violet-400">
                  <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                  Uploading image...
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlignLeft className="size-5 text-violet-400" />
              Description *
            </h2>
            <div>
              <textarea
                name="description"
                placeholder="Write your post content here... Share your expertise, tips, and experiences with the community. You can include training techniques, nutrition advice, success stories, or any valuable information for fitness enthusiasts."
                value={formData.description}
                onChange={handleInputChange}
                rows={12}
                maxLength={5000}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>Minimum 20 characters</span>
                  <span>•</span>
                  <span>Supports plain text</span>
                </div>
                <p
                  className={`text-xs ${
                    formData.description.length > 4500
                      ? "text-amber-400"
                      : "text-zinc-500"
                  }`}
                >
                  {formData.description.length}/5000
                </p>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {formData.title && formData.description && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Eye className="size-5 text-violet-400" />
                Preview
              </h2>
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {formData.title || "Untitled Post"}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-3">
                    {formData.description || "No description yet..."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-500">
                <p>Your post will be visible to all community members</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Post...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Publish Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-8 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase mb-4">
            Tips for a Great Post
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center mb-3">
                <span className="text-sm font-bold text-violet-400">1</span>
              </div>
              <h4 className="text-sm font-medium text-white mb-1">
                Clear Title
              </h4>
              <p className="text-xs text-zinc-400">
                Use descriptive titles that clearly state what your post is
                about
              </p>
            </div>
            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center mb-3">
                <span className="text-sm font-bold text-violet-400">2</span>
              </div>
              <h4 className="text-sm font-medium text-white mb-1">
                Quality Image
              </h4>
              <p className="text-xs text-zinc-400">
                Use high-quality, relevant images to make your post more
                engaging
              </p>
            </div>
            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center mb-3">
                <span className="text-sm font-bold text-violet-400">3</span>
              </div>
              <h4 className="text-sm font-medium text-white mb-1">
                Valuable Content
              </h4>
              <p className="text-xs text-zinc-400">
                Share actionable tips, personal experiences, or expert knowledge
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
