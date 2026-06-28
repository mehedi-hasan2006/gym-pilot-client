import AchievementsSection from "@/components/AchievementsSection/AchievementsSection";
import FeaturedClasses from "@/components/featuedClasses/FeaturedClasses";
import LatestForumPosts from "@/components/LatestForumPostsHome/LatestForumPosts";
import Hero from "@/components/navbar/Hero";
import TestimonialSection from "@/components/TestimonialSection/TestimonialSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedClasses />
      <LatestForumPosts />
      <TestimonialSection />
      <AchievementsSection />
    </div>
  );
}
