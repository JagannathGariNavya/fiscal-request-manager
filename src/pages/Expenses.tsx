
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ExpenseForm from "@/components/ExpenseForm";
import ExpensesTable from "@/components/ExpensesTable";
import RequestExpenseStatus from "@/components/RequestExpenseStatus";
import { Expense, ExpenditureRequest } from "@/types/budget";
import { expenditureRequests as mockRequestsData } from "@/data/mockData";
import { Stop } from "lucide-react";

const Expenses = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isClerk = user?.role === "clerk";

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requests, setRequests] = useState<ExpenditureRequest[]>([]);
  const [activeTab, setActiveTab] = useState("expenses");

  // Filter for only approved requests
  useEffect(() => {
    const approvedRequests = mockRequestsData.filter(req => req.status === "approved");
    setRequests(approvedRequests);
  }, []);

  // Handle expense creation
  const handleCreate = (data: any) => {
    if (!user) return;
    
    const requestDetails = requests.find(req => req.id === data.requestId);
    if (!requestDetails) return;

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      requestId: data.requestId,
      referenceNumber: requestDetails.referenceNumber || `EXP-${Date.now().toString().slice(-6)}`,
      departmentId: requestDetails.departmentId,
      subDepartmentId: requestDetails.subDepartmentId,
      budgetHeadId: requestDetails.budgetHeadId,
      subBudgetHeadId: requestDetails.subBudgetHeadId,
      amount: data.amount,
      installmentNumber: data.installmentNumber,
      totalInstallments: data.totalInstallments,
      recordedBy: user.id,
      status: "recorded",
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Check if amount exceeds remaining approved amount
    const existingExpensesForRequest = expenses.filter(exp => exp.requestId === data.requestId);
    const totalSpent = existingExpensesForRequest.reduce((sum, exp) => sum + exp.amount, 0);
    
    if (totalSpent + data.amount > requestDetails.approvedAmount) {
      toast({
        title: "Amount exceeds limit",
        description: "The expense amount exceeds the remaining approved amount.",
        variant: "destructive",
      });
      return;
    }

    setExpenses([...expenses, newExpense]);
    setDialogOpen(false);
    toast({
      title: "Expense recorded",
      description: "Your expense has been recorded successfully.",
    });
  };

  // Handle stopping further expenses for a request
  const handleStopExpenses = (requestId: string) => {
    setRequests(
      requests.map(req => {
        if (req.id === requestId) {
          const existingExpenses = expenses.filter(exp => exp.requestId === requestId);
          const totalSpent = existingExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          const remainingAmount = req.approvedAmount - totalSpent;
          
          // In a real app, this would update the budget's remaining amount
          return {
            ...req,
            status: "completed",
            updatedAt: new Date().toISOString(),
          };
        }
        return req;
      })
    );
    
    toast({
      title: "Request completed",
      description: "This expenditure request has been marked as completed. Any remaining amount has been returned to the budget.",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Expense Tracking</h2>
            <p className="text-muted-foreground">
              {isClerk
                ? "Record and track expenses against approved requests"
                : "View and manage recorded expenses"}
            </p>
          </div>
          {isClerk && (
            <Button onClick={() => setDialogOpen(true)} className="bg-clerk hover:bg-clerk/80">
              Record Expense
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="requests">Approved Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expenses" className="space-y-4">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Expenses</TabsTrigger>
                <TabsTrigger value="pending">Pending Installments</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <ExpensesTable expenses={expenses} />
              </TabsContent>
              <TabsContent value="pending">
                <ExpensesTable
                  expenses={expenses.filter(exp => exp.installmentNumber < exp.totalInstallments)}
                />
              </TabsContent>
              <TabsContent value="completed">
                <ExpensesTable
                  expenses={expenses.filter(exp => exp.installmentNumber === exp.totalInstallments)}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="requests">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Reference</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Approved Amount</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Spent</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Remaining</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr className="border-b">
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No approved requests found
                      </td>
                    </tr>
                  ) : (
                    requests
                      .filter(req => req.status === "approved")
                      .map(request => {
                        const requestExpenses = expenses.filter(exp => exp.requestId === request.id);
                        const totalSpent = requestExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                        const remaining = request.approvedAmount - totalSpent;
                        const isCompleted = request.status === "completed" || remaining <= 0;

                        return (
                          <tr key={request.id} className="border-b hover:bg-muted/50">
                            <td className="p-4">{request.referenceNumber || request.id.slice(0, 8)}</td>
                            <td className="p-4">₹{request.approvedAmount.toLocaleString()}</td>
                            <td className="p-4">₹{totalSpent.toLocaleString()}</td>
                            <td className="p-4">₹{remaining.toLocaleString()}</td>
                            <td className="p-4">
                              {isClerk && remaining > 0 && !isCompleted && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStopExpenses(request.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Stop className="h-4 w-4" />
                                  Stop
                                </Button>
                              )}
                              {isCompleted && (
                                <span className="text-sm text-muted-foreground">Completed</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Expense Form Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Record Expense</DialogTitle>
              <DialogDescription>
                Record an expense against an approved request. You can split expenses into installments.
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm onSubmit={handleCreate} requests={requests.filter(req => req.status === "approved")} />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Expenses;
