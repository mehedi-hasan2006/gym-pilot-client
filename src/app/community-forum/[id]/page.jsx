import ForumPostDetails from "@/app/(dashboard)/_compotents/ForumPostDetails";
import { getPostDetails } from "@/lib/class/class";
import { sessionData } from "@/lib/session/session";
import React from "react";

export default async function PostDetails({ params }) {
  const { id } = await params;
  const user = await sessionData();
  const res = await getPostDetails(id);
  return (
    <div>
      <ForumPostDetails user={user} postId={id} res={res}></ForumPostDetails>
    </div>
  );
}
