
import { Expense } from "@/types/budget";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ExpensesTableProps {
  expenses: Expense[];
}

const ExpensesTable = ({ expenses }: ExpensesTableProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PP");
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "recorded":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Recorded</Badge>;
      case "verified":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ref. Number</TableHead>
            <TableHead>Amount (₹)</TableHead>
            <TableHead>Installment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                No expenses recorded
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.referenceNumber}</TableCell>
                <TableCell>₹{expense.amount.toLocaleString()}</TableCell>
                <TableCell>{expense.installmentNumber} of {expense.totalInstallments}</TableCell>
                <TableCell>{formatDate(expense.createdAt)}</TableCell>
                <TableCell>{getStatusBadge(expense.status)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpensesTable;
