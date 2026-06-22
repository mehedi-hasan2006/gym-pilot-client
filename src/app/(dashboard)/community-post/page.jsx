import React from "react";
import UserPosts from "../_compotents/UserPosts";
import { sessionData } from "@/lib/session/session";
import { forumApi } from "@/lib/services/forumApi";

export default async function page() {
  const user = await sessionData();
  
  return (
    <div>
      <UserPosts user={user}  />
    </div>
  );
}
