import FeaturedClasses from "@/components/featuedClasses/FeaturedClasses";
import LatestForumPosts from "@/components/LatestForumPostsHome/LatestForumPosts";
import Hero from "@/components/navbar/Hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedClasses />
      <LatestForumPosts />
    </div>
  );
}
