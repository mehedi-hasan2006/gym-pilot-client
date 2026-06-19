import ClassDetails from "@/components/classDetails/ClassDetails";
import { sessionData } from "@/lib/session/session";

export default async function ApprovedClassDetailsPage({ params }) {
  const { id } = await params;
  const user = await sessionData()
  return (
    <div>
      <ClassDetails id={id} user={user} />
    </div>
  );
}
