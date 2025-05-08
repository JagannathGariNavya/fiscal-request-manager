
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Budget } from "@/types/budget";
import { budgets, expenditureRequests } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalBudget: 0,
    allocatedBudget: 0,
    remainingBudget: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });
  
  const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate statistics based on user role and department
  useEffect(() => {
    if (user) {
      let userBudgets = [...budgets];
      let userRequests = [...expenditureRequests];
      
      // Filter by department for clerk and HOD users
      if (user.role !== "finance" && user.department) {
        const departmentId = user.department === "Engineering" ? "dept-1" : 
                            user.department === "Finance" ? "dept-2" :
                            user.department === "Human Resources" ? "dept-3" : "dept-4";
        
        userBudgets = userBudgets.filter(budget => budget.departmentId === departmentId);
        userRequests = userRequests.filter(request => request.departmentId === departmentId);
      }
      
      setFilteredBudgets(userBudgets);
      
      // Calculate totals
      const totalBudget = userBudgets.reduce((sum, budget) => sum + budget.amount, 0);
      const allocatedBudget = userBudgets.reduce((sum, budget) => sum + budget.allocatedAmount, 0);
      const remainingBudget = userBudgets.reduce((sum, budget) => sum + budget.remainingAmount, 0);
      
      const pendingRequests = userRequests.filter(req => req.status === "pending").length;
      const approvedRequests = userRequests.filter(req => req.status === "approved").length;
      const rejectedRequests = userRequests.filter(req => req.status === "rejected").length;
      
      setStats({
        totalBudget,
        allocatedBudget,
        remainingBudget,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
      });
      
      // Prepare chart data for budget allocation
      const chartData = userBudgets.map(budget => ({
        name: budget.subDepartmentId.replace('sub-dept-', 'SD'),
        allocated: budget.allocatedAmount,
        remaining: budget.remainingAmount,
        total: budget.amount,
      }));
      
      setChartData(chartData);
    }
  }, [user]);

  const renderUserSpecificCards = () => {
    switch (user?.role) {
      case "finance":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Budget Allocation</CardTitle>
                <CardDescription>Department-wise budget allocation</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="allocated" name="Allocated" fill="#1e40af" />
                    <Bar dataKey="remaining" name="Remaining" fill="#93c5fd" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Budget Summary</CardTitle>
                <CardDescription>Overall budget status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalBudget)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Allocated</p>
                      <p className="text-xl font-semibold text-primary">{formatCurrency(stats.allocatedBudget)}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((stats.allocatedBudget / stats.totalBudget) * 100)}% of total
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                      <p className="text-xl font-semibold text-blue-500">{formatCurrency(stats.remainingBudget)}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((stats.remainingBudget / stats.totalBudget) * 100)}% of total
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button onClick={() => navigate("/budgets")}>Manage Budgets</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "hod":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Requests</CardTitle>
                <CardDescription>Requests needing your approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-4xl font-bold text-hod">{stats.pendingRequests}</p>
                    <p className="text-sm text-muted-foreground">Pending expenditure requests</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Approved</p>
                      <p className="text-xl font-semibold text-approved">{stats.approvedRequests}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                      <p className="text-xl font-semibold text-rejected">{stats.rejectedRequests}</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="bg-hod hover:bg-hod/80" onClick={() => navigate("/requests")}>Review Requests</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Department Budget</CardTitle>
                <CardDescription>Budget status for your department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalBudget)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Allocated</p>
                      <p className="text-xl font-semibold text-hod">{formatCurrency(stats.allocatedBudget)}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((stats.allocatedBudget / stats.totalBudget) * 100)}% of total
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                      <p className="text-xl font-semibold text-blue-500">{formatCurrency(stats.remainingBudget)}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((stats.remainingBudget / stats.totalBudget) * 100)}% of total
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" onClick={() => navigate("/budgets")}>View Budgets</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "clerk":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Requests</CardTitle>
                <CardDescription>Status of your expenditure requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-xl font-semibold text-pending">{stats.pendingRequests}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Approved</p>
                      <p className="text-xl font-semibold text-approved">{stats.approvedRequests}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                      <p className="text-xl font-semibold text-rejected">{stats.rejectedRequests}</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="bg-clerk hover:bg-clerk/80" onClick={() => navigate("/requests")}>Create Request</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Available Budget</CardTitle>
                <CardDescription>Current budget status for your department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department Budget</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalBudget)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Remaining Budget</p>
                    <p className="text-xl font-semibold text-blue-500">{formatCurrency(stats.remainingBudget)}</p>
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                      <div 
                        className="h-full bg-clerk rounded-full" 
                        style={{ width: `${Math.round((stats.remainingBudget / stats.totalBudget) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {Math.round((stats.remainingBudget / stats.totalBudget) * 100)}% remaining
                    </p>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" onClick={() => navigate("/budgets")}>View Budgets</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <CardDescription>All allocated funds</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalBudget)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-medium">Allocated Budget</CardTitle>
                <CardDescription>Currently allocated</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.allocatedBudget)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
                <CardDescription>Available for spending</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.remainingBudget)}</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 py-4">
            {renderUserSpecificCards()}
          </TabsContent>
          <TabsContent value="recent" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user?.role === "finance" ? (
                    <>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div>
                          <p className="font-medium">Budget Updated</p>
                          <p className="text-sm text-muted-foreground">Engineering Department - Capital Expenditure</p>
                        </div>
                        <p className="text-sm text-muted-foreground">1 day ago</p>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div>
                          <p className="font-medium">New Budget Created</p>
                          <p className="text-sm text-muted-foreground">Marketing Department - Operational Expenses</p>
                        </div>
                        <p className="text-sm text-muted-foreground">3 days ago</p>
                      </div>
                    </>
                  ) : user?.role === "hod" ? (
                    <>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div>
                          <p className="font-medium">Request Approved</p>
                          <p className="text-sm text-muted-foreground">Team building event supplies</p>
                        </div>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div>
                          <p className="font-medium">Request Rejected</p>
                          <p className="text-sm text-muted-foreground">Office decor and plants</p>
                        </div>
                        <p className="text-sm text-muted-foreground">1 day ago</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div>
                          <p className="font-medium">Request Created</p>
                          <p className="text-sm text-muted-foreground">Team building event supplies</p>
                        </div>
                        <p className="text-sm text-muted-foreground">5 hours ago</p>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div>
                          <p className="font-medium">Request Status Updated</p>
                          <p className="text-sm text-muted-foreground">Office supplies request approved</p>
                        </div>
                        <p className="text-sm text-muted-foreground">2 days ago</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
