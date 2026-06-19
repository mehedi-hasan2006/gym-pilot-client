"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, Clock, Dumbbell, Users } from "lucide-react";
import Link from "next/link";
import { getApprovedClasses } from "@/lib/class/class";

const MemberAllClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchApprovedClasses();
  }, []);

  const fetchApprovedClasses = async () => {
    try {
      //  actual API
      const data = await getApprovedClasses();

      setClasses(data);

      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(data.map((c) => c.category))];
      setCategories(uniqueCategories);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.className
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || cls.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Fitness Classes
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect class to achieve your fitness goals
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          Showing {filteredClasses.length}{" "}
          {filteredClasses.length === 1 ? "class" : "classes"}
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <div className="text-center py-12">
            <Dumbbell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No classes found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClasses.map((cls) => (
              <div
                key={cls._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Class Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cls.image}
                    alt={cls.className}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                    ${cls.price}
                  </div>
                </div>

                {/* Class Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {cls.category}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(cls.difficultyLevel)}`}
                    >
                      {cls.difficultyLevel}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {cls.className}
                  </h3>

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{cls.duration}</span>
                    <Users className="h-4 w-4 ml-4 mr-1" />
                    <span>{cls.trainnerName}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {cls.description}
                  </p>

                  {/* Schedule Preview */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Available Days:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {cls.schedules?.slice(0, 3).map((schedule, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {schedule.day}
                        </span>
                      ))}
                      {cls.schedules?.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{cls.schedules.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link
                    href={`/all-classes/${cls._id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
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
