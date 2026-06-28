import { sessionData } from "@/lib/session/session";
import React from "react";
import TrainerDashboard from "../_components/TrainerDashboard";

export default async function TrainnerDashboardPage() {
  const user = await sessionData();
  return (
    <div>
      <TrainerDashboard user={user} />
    </div>
  );
}
