
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ExpenditureRequest, RequestStatus } from "@/types/budget";
import { 
  getDepartmentName, 
  getSubDepartmentName, 
  getBudgetHeadName, 
  getSubBudgetHeadName 
} from "@/data/mockData";
import { Check, X, RotateCcw } from "lucide-react";

interface RequestsTableProps {
  requests: ExpenditureRequest[];
  onApprove?: (id: string, amount: number, notes: string) => void;
  onReject?: (id: string, notes: string) => void;
  onRevert?: (id: string) => void;
}

const RequestsTable = ({ requests, onApprove, onReject, onRevert }: RequestsTableProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isHod = user?.role === "hod";
  const isClerk = user?.role === "clerk";

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ExpenditureRequest | null>(null);
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-approved text-white">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-rejected text-white">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-pending text-white">Pending</Badge>;
    }
  };

  // Open approve dialog
  const handleApproveClick = (request: ExpenditureRequest) => {
    setSelectedRequest(request);
    setApprovedAmount(request.requestedAmount); // Default to requested amount
    setNotes("");
    setApproveDialogOpen(true);
  };

  // Open reject dialog
  const handleRejectClick = (request: ExpenditureRequest) => {
    setSelectedRequest(request);
    setNotes("");
    setRejectDialogOpen(true);
  };

  // Handle approve submission
  const handleApproveSubmit = () => {
    if (selectedRequest && onApprove) {
      onApprove(selectedRequest.id, approvedAmount, notes);
      toast({
        title: "Request approved",
        description: `Request has been approved with amount ${formatCurrency(approvedAmount)}`,
      });
      setApproveDialogOpen(false);
    }
  };

  // Handle reject submission
  const handleRejectSubmit = () => {
    if (selectedRequest && onReject) {
      onReject(selectedRequest.id, notes);
      toast({
        title: "Request rejected",
        description: "Request has been rejected",
      });
      setRejectDialogOpen(false);
    }
  };

  // Handle revert action
  const handleRevert = (id: string) => {
    if (onRevert) {
      onRevert(id);
      toast({
        title: "Action reverted",
        description: "The previous action has been reverted",
      });
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department/Budget</TableHead>
              <TableHead className="text-right">Requested Amount</TableHead>
              <TableHead className="text-center hidden md:table-cell">Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center hidden md:table-cell">Purpose</TableHead>
              {isHod && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isHod ? 6 : 5} className="text-center py-10 text-muted-foreground">
                  No expenditure requests found
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {getDepartmentName(request.departmentId)} / {getSubDepartmentName(request.subDepartmentId)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getBudgetHeadName(request.budgetHeadId)} / {getSubBudgetHeadName(request.subBudgetHeadId)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <div>
                      {formatCurrency(request.requestedAmount)}
                      {request.status === "approved" && request.approvedAmount !== request.requestedAmount && (
                        <div className="text-xs text-muted-foreground">
                          Approved: {formatCurrency(request.approvedAmount)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">{formatDate(request.createdAt)}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-center max-w-[200px] truncate hidden md:table-cell">
                    {request.purpose}
                  </TableCell>
                  {isHod && (
                    <TableCell className="text-right">
                      {request.status === "pending" ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800" onClick={() => handleApproveClick(request)}>
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800" onClick={() => handleRejectClick(request)}>
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleRevert(request.id)}>
                          <RotateCcw className="h-4 w-4 mr-1" /> Revert
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Expenditure Request</DialogTitle>
            <DialogDescription>
              Adjust the amount if needed before approving this request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="approved-amount">Approved Amount</Label>
              <Input
                id="approved-amount"
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(Number(e.target.value))}
                max={selectedRequest?.requestedAmount}
              />
              <p className="text-xs text-muted-foreground">
                Requested amount: {selectedRequest ? formatCurrency(selectedRequest.requestedAmount) : ""}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this approval"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApproveSubmit}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Expenditure Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-notes">Reason for Rejection</Label>
              <Textarea
                id="reject-notes"
                placeholder="Enter reason for rejection"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRejectSubmit}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestsTable;
