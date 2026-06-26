"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  Users,
  Eye,
  Clock,
  Calendar,
  DollarSign,
  BookOpen,
  Search,
  Filter,
  ChevronDown,
  X,
  AlertCircle,
  Plus,
} from "lucide-react";
import {
  deleteClassById,
  editClass,
  getAllClasses,
  getClasses,
} from "@/lib/class/class";

export default function AllClasses() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Update form states
  const [updateForm, setUpdateForm] = useState({
    className: "",
    category: "",
    difficultyLevel: "",
    duration: "",
    price: "",
    description: "",
    status: "pending",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Fetch classes
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const getClass = await getAllClasses();
      const data = getClass;

      if (data) {
        setClasses(data || []);
      } else {
        setError(data.message || "Failed to fetch classes");
      }
    } catch (err) {
      setError("Error loading classes");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDeleteClick = (classItem) => {
    setSelectedClass(classItem);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedClass) return;

    setIsDeleting(true);
    try {
      // Replace with your actual API endpoint
      const deleteClass = await deleteClassById(selectedClass._id);

      if (deleteClass) {
        setClasses(classes.filter((c) => c._id !== selectedClass._id));
        showToast("Class deleted successfully", "success");
        setShowDeleteModal(false);
      } else {
        showToast("Failed to delete class", "error");
      }
    } catch (err) {
      showToast("Error deleting class", "error");
      console.error("Error deleting class:", err);
    } finally {
      setIsDeleting(false);
      setSelectedClass(null);
    }
  };

  // Handle update
  const handleUpdateClick = (classItem) => {
    setSelectedClass(classItem);
    setUpdateForm({
      className: classItem.className,
      category: classItem.category,
      difficultyLevel: classItem.difficultyLevel,
      duration: classItem.duration,
      price: classItem.price,
      description: classItem.description,
      status: classItem.status,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const result = await editClass(selectedClass._id, updateForm);

      if (result.modifiedCount > 0) {
        setClasses(
          classes.map((c) =>
            c._id === selectedClass._id ? { ...c, ...updateForm } : c,
          ),
        );

        showToast("Class updated successfully", "success");
        setShowUpdateModal(false);
      } else {
        showToast("No changes were made", "warning");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating class", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle view attendees
  const handleViewAttendees = async (classItem) => {
    setSelectedClass(classItem);
    setShowAttendeesModal(true);
    setLoadingAttendees(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/classes/${classItem._id}/attendees`);
      const data = await response.json();

      if (data.success) {
        setAttendees(data.data);
      } else {
        setAttendees([]);
        showToast("No attendees found", "info");
      }
    } catch (err) {
      console.error("Error fetching attendees:", err);
      showToast("Error loading attendees", "error");
    } finally {
      setLoadingAttendees(false);
    }
  };

  // Filter and search classes
  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      (classItem.className || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (classItem.trainnerName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (classItem.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
        
    const matchesStatus =
      statusFilter === "All" || classItem.status === statusFilter;
    const matchesCategory =
      categoryFilter === "All" || classItem.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories for filter
  const uniqueCategories = ["All", ...new Set(classes.map((c) => c.category))];
  const statusOptions = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
    "Active",
    "Inactive",
  ];

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Approved: "bg-green-500/10 text-green-400 border-green-500/20",
      Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
      Active: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Inactive: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.Pending}`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="size-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchClasses}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 lg:p-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg ${
              toastType === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : toastType === "error"
                  ? "bg-red-500/10 border border-red-500/20 text-red-400"
                  : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
            }`}
          >
            {toastMessage}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">My Classes</h1>
              <p className="text-zinc-400">
                Manage your classes, view attendees, and track status
              </p>
            </div>
            <button
              onClick={() => router.push("/trainner/add-class")}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="size-4" />
              Add New Class
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <p className="text-sm text-zinc-400 mb-1">Total Classes</p>
              <p className="text-2xl font-bold text-white">{classes.length}</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <p className="text-sm text-zinc-400 mb-1">Approved</p>
              <p className="text-2xl font-bold text-green-400">
                {classes.filter((c) => c.status === "Approved").length}
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <p className="text-sm text-zinc-400 mb-1">Pending</p>
              <p className="text-2xl font-bold text-amber-400">
                {classes.filter((c) => c.status === "Pending").length}
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <p className="text-sm text-zinc-400 mb-1">Reject</p>
              <p className="text-2xl font-bold text-red-400">
                {classes.filter((c) => c.status === "Rejected").length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
            >
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Classes Table */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">
                    Class
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">
                    Category
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">
                    Schedule
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">
                    Price
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">
                    Created
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8">
                      <BookOpen className="size-12 text-zinc-600 mx-auto mb-4" />
                      <p className="text-zinc-400">No classes found</p>
                      <button
                        onClick={() =>
                          router.push("/dashboard/trainer/add-class")
                        }
                        className="mt-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        Create your first class
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((classItem) => (
                    <tr
                      key={classItem._id}
                      className="border-b border-zinc-800 hover:bg-zinc-900/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {classItem.image ? (
                            <img
                              src={classItem.image}
                              alt={classItem.className}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                              <BookOpen className="size-5 text-zinc-600" />
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium">
                              {classItem.className}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {classItem.difficultyLevel}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-zinc-300">
                          {classItem.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {classItem.schedules
                            ?.slice(0, 2)
                            .map((schedule, index) => (
                              <div
                                key={index}
                                className="text-xs text-zinc-400"
                              >
                                {schedule.day}: {schedule.startTime} -{" "}
                                {schedule.endTime}
                              </div>
                            ))}
                          {classItem.schedules?.length > 2 && (
                            <span className="text-xs text-violet-400">
                              +{classItem.schedules.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="size-3 text-zinc-500" />
                          <span className="text-sm text-zinc-300">
                            {classItem.price}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={classItem.status} />
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-zinc-400">
                          {new Date(classItem.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewAttendees(classItem)}
                            className="p-2 text-zinc-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"
                            title="View Students"
                          >
                            <Users className="size-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateClick(classItem)}
                            className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Update"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(classItem)}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-500/10 rounded-full">
                <Trash2 className="size-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Delete Class
                </h3>
                <p className="text-zinc-400 mb-4">
                  Are you sure you want to delete "{selectedClass?.className}"?
                  This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedClass(null);
                    }}
                    className="px-4 py-2 text-zinc-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Update Class
                </h3>
                <button
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedClass(null);
                  }}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Class Name
                  </label>
                  <input
                    type="text"
                    value={updateForm.className}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        className: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Category
                    </label>
                    <select
                      value={updateForm.category}
                      onChange={(e) =>
                        setUpdateForm({
                          ...updateForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={updateForm.difficultyLevel}
                      onChange={(e) =>
                        setUpdateForm({
                          ...updateForm,
                          difficultyLevel: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>
                </div>

                {/* status */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Status
                  </label>
                  <select
                    value={updateForm.status}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="not_selected">Select</option>
                    <option value="Approved">Approve</option>
                    <option value="Rejected">Reject</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={updateForm.duration}
                      onChange={(e) =>
                        setUpdateForm({
                          ...updateForm,
                          duration: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g., 1 hour"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Price
                    </label>
                    <input
                      type="text"
                      value={updateForm.price}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, price: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={updateForm.description}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                    placeholder="Class description"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpdateModal(false);
                      setSelectedClass(null);
                    }}
                    className="px-4 py-2 text-zinc-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Class"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Attendees Modal */}
      {showAttendeesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Students - {selectedClass?.className}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {attendees.length} student{attendees.length !== 1 ? "s" : ""}{" "}
                  enrolled
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAttendeesModal(false);
                  setSelectedClass(null);
                  setAttendees([]);
                }}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {loadingAttendees ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-zinc-400">Loading attendees...</p>
                </div>
              ) : attendees.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="size-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400">No students enrolled yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attendees.map((attendee, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-violet-400">
                          {attendee.name?.charAt(0) ||
                            attendee.email?.charAt(0) ||
                            "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {attendee.name || "Unnamed User"}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {attendee.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-zinc-800">
              <button
                onClick={() => {
                  setShowAttendeesModal(false);
                  setSelectedClass(null);
                  setAttendees([]);
                }}
                className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Keep these constants if needed for the update form
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
