import { sessionData } from "@/lib/session/session";
import React from "react";
import UserBookings from "../../_components/UserBookings";

export default async function BookingPage() {
  const user = await sessionData();
  return (
    <div>
      <UserBookings user={user} />
    </div>
  );
}
