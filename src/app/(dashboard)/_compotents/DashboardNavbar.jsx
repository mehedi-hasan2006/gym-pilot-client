import React from "react";
import DashboardNavbarComponent from "./DashboardNavbarComponent";
import { sessionData } from "@/lib/session/session";

export default async function DashboardNavbar() {

  const user = await sessionData()
  return (
    <div>
      <DashboardNavbarComponent user={user}></DashboardNavbarComponent>
    </div>
  );
}
