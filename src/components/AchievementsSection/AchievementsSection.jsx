"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Trophy,
  Users,
  Globe,
  Building2,
  Award,
  Star,
  Heart,
  Shield,
  Zap,
  Sparkles,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const AchievementsSection = () => {
  // Achievements
  const achievements = [
    {
      icon: Trophy,
      value: "50+",
      label: "Industry Awards",
      description: "Recognized for excellence in fitness training",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Users,
      value: "25,000+",
      label: "Active Members",
      description: "Growing community of fitness enthusiasts",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: Globe,
      value: "15+",
      label: "Countries",
      description: "Serving members across the globe",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: Building2,
      value: "100+",
      label: "Partner Gyms",
      description: "Trusted by top fitness facilities worldwide",
      color: "from-purple-400 to-pink-500",
    },
  ];

  // Partners
  //   const partners = [
  //     { name: "FitLife", logo: "/partners/partner1.png" },
  //     { name: "HealthPlus", logo: "/partners/partner2.png" },
  //     { name: "GymPro", logo: "/partners/partner3.png" },
  //     { name: "NutriFit", logo: "/partners/partner4.png" },
  //     { name: "SportMax", logo: "/partners/partner5.png" },
  //     { name: "WellnessHub", logo: "/partners/partner6.png" },
  //   ];

  // Features
  const features = [
    {
      icon: Shield,
      title: "Certified Trainers",
      description:
        "All our trainers are certified professionals with years of experience",
    },
    {
      icon: Zap,
      title: "Modern Equipment",
      description:
        "State-of-the-art facilities with the latest fitness technology",
    },
    {
      icon: CheckCircle,
      title: "Proven Results",
      description: "Thousands of success stories from our satisfied members",
    },
    {
      icon: Heart,
      title: "Community First",
      description: "Supportive environment that feels like family",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Achievements Grid */}
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-4"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-blue-300">
              Why We Stand Out
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Achievements
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Numbers that reflect our commitment to excellence in fitness
          </p>
        </motion.div>

        {/* Achievement Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all text-center group"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <achievement.icon className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-black text-white mb-2">
                {achievement.value}
              </p>
              <p className="text-lg font-semibold text-gray-200 mb-2">
                {achievement.label}
              </p>
              <p className="text-sm text-gray-400">{achievement.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-white mb-12">
            What Makes Us Different
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/20">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partners Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20 mb-8">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Trusted Partners
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all cursor-pointer"
              >
                <div className="h-12 flex items-center justify-center">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={100}
                      height={40}
                      className="opacity-60 hover:opacity-100 transition-opacity object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 font-semibold text-sm">
                      {partner.name}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};

export default AchievementsSection;
