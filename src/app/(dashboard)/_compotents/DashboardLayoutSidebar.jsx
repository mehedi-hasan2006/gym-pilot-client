"use client";

import {
  LayoutSideContentLeft,
  Bell,
  Envelope,
  Gear,
  House,
  Plus,
  FileText,
} from "@gravity-ui/icons";
import { Avatar, Button, Drawer } from "@heroui/react";
import { Book, icons, List, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardLayoutSidebar({ user }) {
  const pathname = usePathname();
  

  const dashboardItems = {
    member: [
      { icon: House, label: "Home", href: "/member/dashboard" },
      { icon: Plus, label: "Add Community Post", href: "/add-community-post" },
      {
        icon: House,
        label: "All Community Post",
        href: "/member/all-community-post",
      },
    ],
    trainner: [
      { icon: House, label: "Home", href: "/trainner/dashboard" },
      { icon: Plus, label: "Add Class", href: "/trainner/add-class" },
      { icon: Book, label: "My Classes", href: "/trainner/my-classes" },
      { icon: Plus, label: "Add Community Post", href: "/add-community-post" },
      { icon: List, label: "Applications", href: "/trainner/application" },
    ],
    admin: [
      { icon: House, label: "Home", href: "/admin/dashboard" },
      { icon: House, label: "Home", href: "/add-community-post" },
      { icon: User, label: "Users", href: "/admin/users" },
    ],
  };

  const navItems = dashboardItems[user?.role] ?? [];

  const userCard = (
    <div className="flex flex-col items-center gap-3 px-3 py-2.5 rounded-xl  border border-zinc-800/50 backdrop-blur-sm">
      <div className="relative">
        <Avatar>
          <Avatar.Image alt={user?.name} src={user?.image} />
          <Avatar.Fallback>{user?.name?.charAt(0) || "U"}</Avatar.Fallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-zinc-900" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate leading-tight">
          {user?.name || "User"}
        </p>
        <p className="text-xs text-zinc-400 truncate leading-tight mt-0.5">
          {user?.email || "user@example.com"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-base font-bold text-white leading-tight">
            {user?.role.toUpperCase() || "Member"}
          </h1>
          <p className="text-xs text-zinc-500">Dashboard</p>
        </div>
      </div>
    </div>
  );

  const menu = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link key={item.label} href={item.href} className="outline-none">
            <button
              className={`flex items-center gap-3 w-full cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-violet-600/20 text-violet-200 border border-violet-500/30 shadow-sm shadow-violet-500/10"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
              type="button"
            >
              <item.icon
                className={`size-5 transition-colors duration-200 ${
                  isActive
                    ? "text-violet-400"
                    : "text-zinc-500 group-hover:text-zinc-300"
                }`}
              />
              {item.label}
            </button>
          </Link>
        );
      })}
    </nav>
  );

  const sidebarContent = (
    <>
      {/* User Info at Top */}
      <div className="px-6 mb-6">{userCard}</div>

      {/* Divider */}
      <div className="px-6 mb-6">
        <div className="border-t border-zinc-800/50" />
      </div>

      {/* Navigation */}
      <div className="flex-1 px-6">
        <div className="mb-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Main Menu
          </p>
        </div>
        {menu}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0  border-r border-zinc-800/50 py-6">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Drawer>
          <Button
            className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl px-3 py-2 min-w-0 transition-all duration-200 shadow-lg"
            variant="bordered"
          >
            <LayoutSideContentLeft className="size-5" />
          </Button>
          <Drawer.Backdrop className="bg-black/60 backdrop-blur-sm" />
          <Drawer.Content
            placement="left"
            className="bg-zinc-950 border-r border-zinc-800/50"
          >
            <Drawer.Dialog className="h-full flex flex-col">
              <Drawer.CloseTrigger className="text-zinc-400 hover:text-white absolute top-4 right-4" />
              <Drawer.Header className="border-b border-zinc-800/50 pb-4">
                <Drawer.Heading className="text-lg font-bold text-white">
                  Navigation
                </Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body className="flex-1 py-6">
                <div className="flex flex-col h-full">
                  {/* Mobile User Card */}
                  <div className="px-3 mb-6">{userCard}</div>

                  <div className="px-3 mb-6">
                    <div className="border-t border-zinc-800/50" />
                  </div>

                  <div className="flex-1 px-3">
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        Main Menu
                      </p>
                    </div>
                    {menu}
                  </div>
                </div>
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer>
      </div>
    </>
  );
}
