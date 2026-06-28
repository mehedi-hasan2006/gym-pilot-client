import ClassDetails from "@/components/classDetails/ClassDetails";
import { getApprovedClassById } from "@/lib/class/class";
import { sessionData } from "@/lib/session/session";

export default async function ApprovedClassDetailsPage({ params }) {
  const { id } = await params;


  const user = await sessionData();

  const res = await getApprovedClassById(id);


  return (
    <div>
      <ClassDetails id={id} user={user} res={res} />
    </div>
  );
}
