import React from "react";
import AddForumPost from "../_compotents/AddForumPost";
import { sessionData } from "@/lib/session/session";

export default async function AddForumPostPage() {
  const user = await sessionData();
  return (
    <div>
      <AddForumPost user={user} />
    </div>
  );
}
