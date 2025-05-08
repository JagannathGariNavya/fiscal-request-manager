
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const SidebarNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Define navigation items based on user role
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      allowedRoles: ["finance", "hod", "clerk"],
    },
    {
      title: "Budget Management",
      href: "/budgets",
      allowedRoles: ["finance", "hod", "clerk"],
    },
    {
      title: "Expenditure Requests",
      href: "/requests",
      allowedRoles: ["hod", "clerk"],
    },
    {
      title: "History",
      href: "/history",
      allowedRoles: ["finance", "hod", "clerk"],
    },
  ];

  // Filter items based on user role
  const filteredItems = navItems.filter(item => 
    user && item.allowedRoles.includes(user.role)
  );

  return (
    <nav className="space-y-1">
      {filteredItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center py-2 px-3 text-sm font-medium rounded-md",
            location.pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default SidebarNav;
