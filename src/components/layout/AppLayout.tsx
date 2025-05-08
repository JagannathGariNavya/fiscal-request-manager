
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SidebarNav from "@/components/layout/SidebarNav";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Get the role color for styling
  const getRoleColor = () => {
    switch (user.role) {
      case "finance":
        return "bg-finance-light text-finance border-finance";
      case "hod":
        return "bg-hod-light text-hod border-hod";
      case "clerk":
        return "bg-clerk-light text-clerk border-clerk";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Get the role display name
  const getRoleName = () => {
    switch (user.role) {
      case "finance":
        return "Finance";
      case "hod":
        return "Head of Department";
      case "clerk":
        return "Clerk";
      default:
        return "User";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <div className="flex flex-col space-y-2">
              <h2 className="text-xl font-bold">Budget Management</h2>
              <div className={`px-3 py-1 rounded-md border ${getRoleColor()}`}>
                {getRoleName()}
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4 py-6">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {user.name}
              </p>
              {user.department && (
                <p className="text-xs text-muted-foreground">
                  Department: {user.department}
                </p>
              )}
            </div>
            <Separator className="my-4" />
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={logout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b px-4 flex items-center">
            <SidebarTrigger>
              <Button variant="ghost" size="icon">
                <ArrowLeft size={18} />
              </Button>
            </SidebarTrigger>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
