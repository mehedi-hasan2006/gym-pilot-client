"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Award,
} from "lucide-react";

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      rating: 5,
      text: "Joining FitStudio was the best decision I've ever made! The trainers are incredibly supportive, and the community keeps me motivated. I've lost 30 pounds and gained so much confidence.",
      achievement: "Lost 30 lbs in 6 months",
      location: "New York, USA",
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Software Developer",
      rating: 5,
      text: "As someone who sits at a desk all day, finding the right workout routine was crucial. The personalized training plans helped me improve my posture and build strength. Highly recommended!",
      achievement: "Improved flexibility & strength",
      location: "San Francisco, USA",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Yoga Instructor",
      rating: 5,
      text: "The variety of classes is amazing! From yoga to HIIT, there's something for everyone. The booking system is seamless, and the trainers are top-notch professionals.",
      achievement: "Completed 200+ classes",
      location: "Miami, USA",
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Marathon Runner",
      rating: 4,
      text: "The cardio classes helped me improve my marathon time significantly. The trainers understand individual needs and push you just the right amount. Great atmosphere!",
      achievement: "Improved marathon time by 15 mins",
      location: "Chicago, USA",
    },
    {
      id: 5,
      name: "Lisa Martinez",
      role: "Busy Mom",
      rating: 5,
      text: "With two kids, I never thought I'd have time for fitness. The flexible class schedules and online options made it possible. I feel stronger and more energetic than ever!",
      achievement: "Transformed lifestyle",
      location: "Austin, USA",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play
  React.useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-full border border-yellow-200 dark:border-yellow-800 mb-4"
          >
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
              Success Stories
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Members Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real stories from real people who transformed their lives with
            FitStudio
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative">
          {/* Main Testimonial Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-center"
              >
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="w-12 h-12 text-blue-500/20 mx-auto" />
                </div>

                {/* Rating Stars */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonials[currentIndex].rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed italic">
                  "{testimonials[currentIndex].text}"
                </p>

                {/* Achievement Badge */}
                {testimonials[currentIndex].achievement && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-full border border-yellow-200 dark:border-yellow-800 mb-8">
                    <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                      {testimonials[currentIndex].achievement}
                    </span>
                  </div>
                )}

                {/* Author Info */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-gray-100 dark:ring-gray-700">
                    {testimonials[currentIndex].image ? (
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      testimonials[currentIndex].name.charAt(0)
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonials[currentIndex].role}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {testimonials[currentIndex].location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 -left-4 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 -right-4 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-8 h-3 bg-blue-600"
                  : "w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16"
        >
          {[
            { icon: Heart, value: "98%", label: "Satisfaction Rate" },
            { icon: Star, value: "4.9/5", label: "Average Rating" },
            { icon: Award, value: "1000+", label: "Success Stories" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;
