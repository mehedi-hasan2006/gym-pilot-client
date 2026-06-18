import React from "react";
import { DashboardLayoutSidebar } from "./DashboardLayoutSidebar";
import { sessionData } from "@/lib/session/session";

export default async function SidebarComponents() {
  const session = await sessionData();
  const user = session?.user;

  return (
    <div>
      <DashboardLayoutSidebar user={user}></DashboardLayoutSidebar>
    </div>
  );
}
