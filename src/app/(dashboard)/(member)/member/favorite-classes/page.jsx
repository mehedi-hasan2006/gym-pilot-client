import React from "react";
import FavoriteClasses from "../../_components/FavoriteClasses";
import { sessionData } from "@/lib/session/session";

export default async function FavoriteClassesPage() {
  const user = await sessionData();
  console.log(user)
  return (
    <div>
      <FavoriteClasses user={user} />{" "}
    </div>
  );
}
