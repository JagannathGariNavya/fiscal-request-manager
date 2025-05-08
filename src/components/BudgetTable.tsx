
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Budget, BudgetStatus } from "@/types/budget";
import { 
  departments, 
  subDepartments, 
  budgetHeads, 
  subBudgetHeads, 
  getDepartmentName, 
  getSubDepartmentName, 
  getBudgetHeadName, 
  getSubBudgetHeadName 
} from "@/data/mockData";

interface BudgetTableProps {
  budgets: Budget[];
  onEdit?: (budget: Budget) => void;
  onDelete?: (id: string) => void;
}

const BudgetTable = ({ budgets, onEdit, onDelete }: BudgetTableProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isFinance = user?.role === "finance";

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: BudgetStatus) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case "draft":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Draft</Badge>;
      case "archived":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Archived</Badge>;
    }
  };

  // Handle edit button click
  const handleEdit = (budget: Budget) => {
    if (onEdit) onEdit(budget);
  };

  // Handle delete button click
  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
      toast({
        title: "Budget deleted",
        description: "The budget has been deleted successfully.",
      });
    }
  };

  // Calculate remaining percentage for progress indicator
  const getRemainingPercentage = (budget: Budget): number => {
    if (budget.amount === 0) return 0;
    return (budget.remainingAmount / budget.amount) * 100;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department</TableHead>
            <TableHead>Budget Head</TableHead>
            <TableHead className="hidden md:table-cell">Financial Year</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
            <TableHead className="text-center">Status</TableHead>
            {isFinance && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isFinance ? 7 : 6} className="text-center py-10 text-muted-foreground">
                No budget records found
              </TableCell>
            </TableRow>
          ) : (
            budgets.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell className="font-medium">
                  <div>
                    {getDepartmentName(budget.departmentId)}
                    <div className="text-xs text-muted-foreground">
                      {getSubDepartmentName(budget.subDepartmentId)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {getBudgetHeadName(budget.budgetHeadId)}
                    <div className="text-xs text-muted-foreground">
                      {getSubBudgetHeadName(budget.subBudgetHeadId)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{budget.financialYear}</TableCell>
                <TableCell className="text-right">{formatCurrency(budget.amount)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span>{formatCurrency(budget.remainingAmount)}</span>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${getRemainingPercentage(budget)}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(budget.status)}</TableCell>
                {isFinance && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(budget)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(budget.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BudgetTable;
