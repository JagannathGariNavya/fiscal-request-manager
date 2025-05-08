
import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import ExpenseForm from "@/components/ExpenseForm";
import ExpensesTable from "@/components/ExpensesTable";
import { Expense } from "@/types/budget";

const Expenses = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isClerk = user?.role === "clerk";

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle expense creation
  const handleCreate = (data: any) => {
    if (!user) return;

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      requestId: data.requestId,
      referenceNumber: data.referenceNumber,
      departmentId: data.departmentId || "dept-1",
      subDepartmentId: data.subDepartmentId || "sub-dept-1",
      budgetHeadId: data.budgetHeadId || "bh-1",
      subBudgetHeadId: data.subBudgetHeadId || "sbh-1",
      amount: data.amount,
      installmentNumber: data.installmentNumber,
      totalInstallments: data.totalInstallments,
      recordedBy: user.id,
      status: "recorded",
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setExpenses([...expenses, newExpense]);
    setDialogOpen(false);
    toast({
      title: "Expense recorded",
      description: "Your expense has been recorded successfully.",
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

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Expenses</TabsTrigger>
            <TabsTrigger value="pending">Pending Installments</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ExpensesTable
              expenses={expenses}
            />
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

        {/* Expense Form Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Record Expense</DialogTitle>
              <DialogDescription>
                Record an expense against an approved request. You can split expenses into installments.
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Expenses;
