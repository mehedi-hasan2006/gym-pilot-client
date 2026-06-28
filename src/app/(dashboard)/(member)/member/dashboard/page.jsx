import { sessionData } from "@/lib/session/session";
import React from "react";
import MemberDashboard from "../../_components/MemberDashboard";

export default async function MemberDashboardPage() {
  const user = await sessionData();

  return (
    <div>
      <MemberDashboard user={user} />
    </div>
  );
}
