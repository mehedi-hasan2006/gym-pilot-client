"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Dumbbell,
  Heart,
  Trophy,
  Users,
  ArrowRight,
  Play,
  Star,
  Zap,
  ChevronDown,
  Sparkles,
  Flame,
  Target,
  Shield,
  Award,
  Clock,
  TrendingUp,
  Medal,
  Crown,
} from "lucide-react";

const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const words = ["Transform", "Elevate", "Empower", "Ignite"];

  // Scroll animations
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.9]);
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearInterval(wordInterval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)",
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center">
      {/* Dynamic Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0"
      >
        {/* Main Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950" />
        
        {/* Animated Mesh Gradient */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-[150%] h-[150%] bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-cyan-600/30 blur-[150px]"
        />

        {/* Secondary Gradient Orb */}
        <motion.div
          animate={{
            scale: [1.5, 1, 1.5],
            x: [100, -100, 100],
            y: [-50, 50, -50],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/30 via-cyan-500/20 to-purple-500/30 rounded-full blur-[120px]"
        />

        {/* Third Gradient Orb */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [-100, 100, -100],
            y: [50, -50, 50],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/30 via-pink-500/20 to-blue-500/30 rounded-full blur-[100px]"
        />

        {/* Animated Grid Pattern */}
        <motion.div
          animate={{
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(${Math.random() > 0.5 ? '59, 130, 246' : '147, 51, 234'}, ${Math.random() * 0.5 + 0.3})`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Premium Badge */}
          <motion.div variants={itemVariants} className="mb-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="w-5 h-5 text-yellow-400" />
              </motion.div>
              <span className="text-sm md:text-base font-medium bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                Premium Fitness Experience
              </span>
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tighter">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWord}
                  initial={{ y: 80, opacity: 0, rotateX: -90 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  exit={{ y: -80, opacity: 0, rotateX: 90 }}
                  transition={{ 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 50,
                  }}
                  className="inline-block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                >
                  {words[currentWord]}
                </motion.span>
              </AnimatePresence>
              <br />
              <span className="relative inline-block">
                Your Body
                <motion.svg
                  className="absolute -bottom-4 left-0 w-full h-4"
                  viewBox="0 0 200 20"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.5, duration: 1, ease: "easeInOut" }}
                >
                  <motion.path
                    d="M 0 10 Q 50 0, 100 10 T 200 10"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Your Journey
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl text-gray-300/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Unleash your potential with world-class training, cutting-edge facilities, 
            and a community that pushes you beyond your limits.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
          >
            <motion.button
              whileHover={{ 
                scale: 1.08,
                boxShadow: "0 0 60px rgba(59, 130, 246, 0.7)",
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 text-white rounded-full font-bold text-lg shadow-2xl shadow-blue-500/40 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <span className="relative z-10 flex items-center gap-3">
                Start Your Journey
                <motion.span
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.span>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 bg-white/5 backdrop-blur-xl text-white rounded-full font-bold text-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300 flex items-center gap-4 shadow-2xl"
            >
              <motion.span
                animate={{
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(239, 68, 68, 0)",
                    "0 0 0 15px rgba(239, 68, 68, 0.3)",
                    "0 0 0 0 rgba(239, 68, 68, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </motion.span>
              <span className="text-lg">Watch Showcase</span>
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {[
              { 
                icon: Users, 
                value: "25K+", 
                label: "Active Members",
                color: "from-blue-400 to-cyan-400",
                shadow: "shadow-blue-500/30",
              },
              { 
                icon: Trophy, 
                value: "1.2K+", 
                label: "Success Stories",
                color: "from-yellow-400 to-orange-400",
                shadow: "shadow-yellow-500/30",
              },
              { 
                icon: TrendingUp, 
                value: "95%", 
                label: "Satisfaction Rate",
                color: "from-green-400 to-emerald-400",
                shadow: "shadow-green-500/30",
              },
              { 
                icon: Medal, 
                value: "50+", 
                label: "Expert Trainers",
                color: "from-purple-400 to-pink-400",
                shadow: "shadow-purple-500/30",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 1.2 + index * 0.15,
                  type: "spring",
                  stiffness: 80,
                }}
                whileHover={{ 
                  scale: 1.08, 
                  y: -8,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                }}
                className={`relative group cursor-pointer`}
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 relative overflow-hidden">
                  {/* Card Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(59, 130, 246, 0)",
                        "0 0 0 12px rgba(59, 130, 246, 0.1)",
                        "0 0 0 0 rgba(59, 130, 246, 0)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl ${stat.shadow} relative z-10`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 1.5 + index * 0.15,
                      type: "spring",
                      stiffness: 150,
                    }}
                    className="text-3xl md:text-4xl font-black text-white mb-2 relative z-10"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-gray-400 text-sm md:text-base font-medium relative z-10">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating Feature Bubbles */}
          <motion.div variants={itemVariants} className="mt-16">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { icon: Dumbbell, label: "Strength Training" },
                { icon: Heart, label: "Cardio Fitness" },
                { icon: Flame, label: "HIIT Workouts" },
                { icon: Target, label: "Personal Training" },
                { icon: Shield, label: "Safe Environment" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 2 + index * 0.15,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{ scale: 1.15, y: -5 }}
                  className="flex items-center gap-2 px-5 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 shadow-xl"
                >
                  <feature.icon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300 font-medium">
                    {feature.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative Corner Elements */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[15%] left-[5%] hidden xl:block"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl rotate-12 backdrop-blur-sm border border-white/5" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 40, 0],
          rotate: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[20%] right-[5%] hidden xl:block"
      >
        <div className="w-40 h-40 bg-gradient-to-bl from-cyan-500/10 to-blue-500/10 rounded-full backdrop-blur-sm border border-white/5" />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{
            y: [0, 15, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-3 cursor-pointer"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400 text-sm font-medium tracking-wider uppercase"
          >
            Discover More
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="w-12 h-12 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-white/20 hover:border-blue-400/50 transition-all duration-300 shadow-xl"
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-blue-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated Ring */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.03] rounded-full hidden lg:block"
      />
      
      <motion.div
        animate={{
          rotate: -360,
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
          scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.05] rounded-full hidden lg:block"
      />
    </div>
  );
};

export default Hero;