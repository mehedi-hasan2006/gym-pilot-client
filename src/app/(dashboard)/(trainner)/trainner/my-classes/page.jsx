import React from "react";
import MyClasses from "../_components/MyClasses";
import { sessionData } from "@/lib/session/session";

export default async function MyClassesPage() {
  const user = await sessionData()
  return (
    <div>
      <MyClasses user={user} />
    </div>
  );
}
