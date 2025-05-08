
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import BudgetTable from "@/components/BudgetTable";
import BudgetForm from "@/components/BudgetForm";
import { Budget } from "@/types/budget";
import { budgets as mockBudgets } from "@/data/mockData";

const Budgets = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isFinance = user?.role === "finance";

  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  
  // Handle budget creation
  const handleCreate = (data: any) => {
    const newBudget: Budget = {
      id: `budget-${Date.now()}`,
      departmentId: data.departmentId,
      subDepartmentId: data.subDepartmentId,
      budgetHeadId: data.budgetHeadId,
      subBudgetHeadId: data.subBudgetHeadId,
      financialYear: data.financialYear,
      amount: data.amount,
      allocatedAmount: 0,
      remainingAmount: data.amount,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBudgets([...budgets, newBudget]);
    setDialogOpen(false);
    toast({
      title: "Budget created",
      description: "The budget has been created successfully.",
    });
  };

  // Handle budget update
  const handleUpdate = (data: any) => {
    if (currentBudget) {
      const updatedBudget: Budget = {
        ...currentBudget,
        departmentId: data.departmentId,
        subDepartmentId: data.subDepartmentId,
        budgetHeadId: data.budgetHeadId,
        subBudgetHeadId: data.subBudgetHeadId,
        financialYear: data.financialYear,
        amount: data.amount,
        remainingAmount: data.amount - (currentBudget.allocatedAmount || 0),
        updatedAt: new Date().toISOString(),
      };

      setBudgets(budgets.map(b => b.id === currentBudget.id ? updatedBudget : b));
      setDialogOpen(false);
      setCurrentBudget(null);
      toast({
        title: "Budget updated",
        description: "The budget has been updated successfully.",
      });
    }
  };

  // Handle budget edit button click
  const handleEdit = (budget: Budget) => {
    setCurrentBudget(budget);
    setIsEdit(true);
    setDialogOpen(true);
  };

  // Handle budget delete
  const handleDelete = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
    toast({
      title: "Budget deleted",
      description: "The budget has been deleted successfully.",
    });
  };

  // Open create dialog
  const openCreateDialog = () => {
    setCurrentBudget(null);
    setIsEdit(false);
    setDialogOpen(true);
  };

  // Filter active and archived budgets
  const activeBudgets = budgets.filter(budget => budget.status === "active");
  const archivedBudgets = budgets.filter(budget => budget.status !== "active");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Budget Management</h2>
            <p className="text-muted-foreground">
              {isFinance ? "Manage and allocate budgets across departments" : "View budget allocations for your department"}
            </p>
          </div>
          {isFinance && (
            <Button onClick={openCreateDialog}>Create Budget</Button>
          )}
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <BudgetTable 
              budgets={activeBudgets} 
              onEdit={isFinance ? handleEdit : undefined}
              onDelete={isFinance ? handleDelete : undefined}
            />
          </TabsContent>
          <TabsContent value="archived">
            <BudgetTable 
              budgets={archivedBudgets} 
              onEdit={isFinance ? handleEdit : undefined}
              onDelete={isFinance ? handleDelete : undefined}
            />
          </TabsContent>
        </Tabs>

        {/* Budget Form Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit Budget" : "Create Budget"}</DialogTitle>
              <DialogDescription>
                {isEdit 
                  ? "Update the budget details below." 
                  : "Fill in the details to create a new budget allocation."}
              </DialogDescription>
            </DialogHeader>
            <BudgetForm 
              onSubmit={isEdit ? handleUpdate : handleCreate} 
              initialData={isEdit && currentBudget ? {
                departmentId: currentBudget.departmentId,
                subDepartmentId: currentBudget.subDepartmentId,
                budgetHeadId: currentBudget.budgetHeadId,
                subBudgetHeadId: currentBudget.subBudgetHeadId,
                financialYear: currentBudget.financialYear,
                amount: currentBudget.amount,
              } : undefined}
              isEdit={isEdit}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Budgets;
