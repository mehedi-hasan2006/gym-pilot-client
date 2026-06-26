import React from "react";
import MemberAllClasses from "../(dashboard)/_compotents/MemberAllClasses";
import { sessionData } from "@/lib/session/session";

export default async function MemberClasses() {
  const user = await sessionData();
  return (
    <div>
      <MemberAllClasses user={user} />
    </div>
  );
}
