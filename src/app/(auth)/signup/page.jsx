"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// --- Icons Components ---
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [image, setImage] = useState("");
  const [role, setRole] = useState("member");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // --- ImgBB Image Upload Handler ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.danger("Please select a valid image file.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (result.success) {
        setImage(result.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.danger("Failed to upload image. Try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.danger("Something went wrong during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- Submit Registration ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name: fullName,
        image,
        role,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Account has been created.");
          router.push("/dashboard");
        },
        onError: (res) => {
          setIsLoading(false);
          toast.danger(
            res.error.message ||
              res.error.statusText ||
              "Registration Failed. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen mt-20 items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-white/30 dark:border-gray-800/50 rounded-2xl shadow-2xl p-8 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-orange-500 to-red-600 rounded-full mb-4 shadow-lg">
              <UserIcon />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Create Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Join us and start your fitness journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Profile Image Upload */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Picture
              </label>
              <label
                className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  image
                    ? "border-orange-500 bg-green-50/10"
                    : "border-gray-300 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-4 pb-5 px-4 text-center">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                      <p className="text-xs text-gray-500">Uploading...</p>
                    </div>
                  ) : image ? (
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600 font-medium text-xs flex items-center gap-1">
                        <CheckIcon /> Uploaded
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="text-gray-400 mb-1">
                        <UploadIcon />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        PNG, JPG or WEBP
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* MEMBER */}
                <label
                  className={`relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    role === "member"
                      ? "border-orange-500 bg-orange-500/5 shadow-md"
                      : "border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-800"
                  }`}
                >
                  <input
                    type="radio"
                    value="member"
                    checked={role === "member"}
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">🔍</span>
                    <span className="text-sm font-medium">Member</span>
                  </div>
                  {role === "member" && (
                    <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-0.5">
                      <CheckIcon />
                    </div>
                  )}
                </label>

                {/* TRAINER */}
                <label
                  className={`relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    role === "trainner"
                      ? "border-rose-500 bg-orange-500/5 shadow-md"
                      : "border-gray-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-800"
                  }`}
                >
                  <input
                    type="radio"
                    value="trainner"
                    checked={role === "trainner"}
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">💪</span>
                    <span className="text-sm font-medium">Trainer</span>
                  </div>
                  {role === "trainner" && (
                    <div className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-0.5">
                      <CheckIcon />
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <MailIcon />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <LockIcon />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-700 hover:to-red-700 cursor-pointer text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating account...
                </div>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <a
                href="/signin"
                className="text-orange-600 dark:text-orange-400 font-medium hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;