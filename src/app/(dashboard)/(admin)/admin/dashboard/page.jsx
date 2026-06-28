import { sessionData } from "@/lib/session/session";
import React from "react";
import AdminDashboard from "../_components/AdminDashboard";

export default async function AdminDashboardPage() {
  const user = await sessionData();
  return (
    <div>
      <AdminDashboard user={user} />
    </div>
  );
}
