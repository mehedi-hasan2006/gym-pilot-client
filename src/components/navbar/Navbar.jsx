"use client";
import { useState, useEffect } from "react";
import { Link, Button, Avatar } from "@heroui/react";
import logo from "../../../public/images/logo.png";
import Image from "next/image";
import { authClient, useSession } from "@/lib/auth-client";
import { Menu, X, Zap, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const session = useSession();
  const user = session?.data?.user;

  const pathname = usePathname();
  if (pathname.includes("dashboard")) {
    return null;
  }
  if (pathname.includes("admin")) {
    return null;
  }
  if (pathname.includes("member")) {
    return null;
  }
  if (pathname.includes("trainner")) {
    return null;
  }
  if (pathname.includes("add-community-post")) {
    return null;
  }
  if (pathname.includes("community-post")) {
    return null;
  }

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 20);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const navLinks = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "All Classes",
      href: "/all-classes",
    },
    {
      name: "Community Forum",
      href: "/community-forum",
    },
  ];

  return (
    <nav
      className={` w-full transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-xl shadow-2xl shadow-orange-500/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-blue-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <Image
                  src={logo}
                  alt="GymPilot Logo"
                  width={44}
                  height={44}
                  loading="eager"
                  className="relative h-11 w-11 rounded-full"
                />
              </div>
              <span className="text-2xl font-bold text-white">
                GYM<span className="text-blue-500">PILOT</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="relative px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-2 group"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {link.icon}
                        {link.name}
                      </span>
                      <span className="absolute inset-0 bg-linear-to-r from-orange-500/20 to-red-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                    <Avatar>
                      <Avatar.Image alt={user?.name} src={user?.image} />
                      <Avatar.Fallback>
                        {user?.name?.charAt(0) || "U"}
                      </Avatar.Fallback>
                    </Avatar>
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    {user?.name}
                  </span>
                </div>

                <div className=" bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 rounded-full px-6 py-2 text-sm font-medium transition-all duration-200">
                  <Link href={`${user?.role}/dashboard`}>
                    <button className="flex gap-1.5 items-center">
                      <LayoutDashboard />
                      <p className="">Dashboard</p>
                    </button>
                  </Link>
                </div>

                <Button
                  onClick={handleLogout}
                  className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 rounded-full px-6 py-2 text-sm font-medium transition-all duration-200"
                >
                  Sign Out
                </Button>
              </div>
            )}

            {!user && (
              <div className="flex items-center gap-3">
                <Link
                  href="/signin"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link href="/signup">
                  <Button className="relative group bg-linear-to-r from-blue-500 to-blue-500 text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200">
                    <span className="relative z-10 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Start Free Trial
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-20 transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="mx-4 bg-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </div>
          <div className="p-4 border-t border-white/10 bg-white/5">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-400">Member</p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  className="w-full bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl py-3 font-medium transition-all duration-200"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/signin">
                  <Button className="w-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 rounded-xl py-3 font-medium transition-all duration-200">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white rounded-xl py-3 font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200">
                    <Zap className="w-4 h-4 mr-2" />
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
