import DashboardNavbar from "./_compotents/DashboardNavbar";
import SidebarComponents from "./_compotents/SidebarComponents";

function RecruiterDashboarLayout({ children }) {
  return (
    <div>
      <DashboardNavbar></DashboardNavbar>
      <div className="flex min-h-screen">
        <SidebarComponents />
        <div className="flex-1"> {children}</div>
      </div>
    </div>
  );
}

export default RecruiterDashboarLayout;
