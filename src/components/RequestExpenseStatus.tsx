
import { useState } from "react";
import { Expense, ExpenditureRequest } from "@/types/budget";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Stop } from "lucide-react";

interface RequestExpenseStatusProps {
  request: ExpenditureRequest;
  expenses: Expense[];
  onStopExpenses: (requestId: string) => void;
  isClerk: boolean;
}

const RequestExpenseStatus = ({ 
  request, 
  expenses, 
  onStopExpenses, 
  isClerk 
}: RequestExpenseStatusProps) => {
  const requestExpenses = expenses.filter(exp => exp.requestId === request.id);
  const totalSpent = requestExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = request.approvedAmount - totalSpent;
  const percentSpent = (totalSpent / request.approvedAmount) * 100;

  return (
    <div className="border rounded-md p-4 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">
          {request.referenceNumber || `Request ${request.id.slice(0, 8)}`}
        </h3>
        <span className="text-sm text-muted-foreground">
          Approved: ₹{request.approvedAmount.toLocaleString()}
        </span>
      </div>
      
      <Progress value={percentSpent} className="h-2" />
      
      <div className="flex justify-between text-sm">
        <span>Spent: ₹{totalSpent.toLocaleString()}</span>
        <span>Remaining: ₹{remaining.toLocaleString()}</span>
      </div>
      
      {isClerk && remaining > 0 && (
        <Button
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={() => onStopExpenses(request.id)}
        >
          <Stop className="mr-2 h-4 w-4" />
          Stop and Return Remaining Funds
        </Button>
      )}
    </div>
  );
};

export default RequestExpenseStatus;
