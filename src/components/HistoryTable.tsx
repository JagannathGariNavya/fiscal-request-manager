
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HistoryRecord, RequestStatus } from "@/types/budget";

interface HistoryTableProps {
  records: HistoryRecord[];
}

const HistoryTable = ({ records }: HistoryTableProps) => {
  // Format date and time
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount?: number): string => {
    if (amount === undefined) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get action badge
  const getActionBadge = (action: HistoryRecord["action"]) => {
    switch (action) {
      case "created":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Created</Badge>;
      case "edited":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Edited</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case "reverted":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Reverted</Badge>;
    }
  };

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "finance":
        return <Badge className="bg-finance text-white">Finance</Badge>;
      case "hod":
        return <Badge className="bg-hod text-white">HOD</Badge>;
      case "clerk":
        return <Badge className="bg-clerk text-white">Clerk</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Unknown</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status?: RequestStatus) => {
    if (!status) return null;
    
    switch (status) {
      case "approved":
        return <Badge className="bg-approved text-white">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-rejected text-white">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-pending text-white">Pending</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Performed By</TableHead>
            <TableHead className="hidden md:table-cell">Status Change</TableHead>
            <TableHead className="hidden md:table-cell">Amount Change</TableHead>
            <TableHead className="hidden lg:table-cell">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                No history records found
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDateTime(record.timestamp)}
                </TableCell>
                <TableCell>{getActionBadge(record.action)}</TableCell>
                <TableCell>{getRoleBadge(record.performedByRole)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {record.previousStatus || record.newStatus ? (
                    <div className="flex items-center gap-2">
                      {record.previousStatus && getStatusBadge(record.previousStatus)}
                      {record.previousStatus && record.newStatus && (
                        <span className="text-muted-foreground">→</span>
                      )}
                      {record.newStatus && getStatusBadge(record.newStatus)}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {record.previousAmount !== undefined || record.newAmount !== undefined ? (
                    <div className="flex items-center gap-2">
                      {record.previousAmount !== undefined && (
                        <span>{formatCurrency(record.previousAmount)}</span>
                      )}
                      {record.previousAmount !== undefined && record.newAmount !== undefined && (
                        <span className="text-muted-foreground">→</span>
                      )}
                      {record.newAmount !== undefined && (
                        <span>{formatCurrency(record.newAmount)}</span>
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="max-w-[200px] truncate hidden lg:table-cell">
                  {record.notes || "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistoryTable;
