import React from "react";
import AddClass from "../_components/AddClass";
import { sessionData } from "@/lib/session/session";

async function AddClassPage() {
  const user = await sessionData();
 
  return (
    <div>
      <AddClass user={user}></AddClass>
    </div>
  );
}

export default AddClassPage;
