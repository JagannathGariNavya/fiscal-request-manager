
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
import RequestsTable from "@/components/RequestsTable";
import RequestForm from "@/components/RequestForm";
import { ExpenditureRequest } from "@/types/budget";
import { expenditureRequests as mockRequests } from "@/data/mockData";

const Requests = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isClerk = user?.role === "clerk";
  const isHod = user?.role === "hod";

  const [requests, setRequests] = useState<ExpenditureRequest[]>(mockRequests);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle request creation
  const handleCreate = (data: any) => {
    if (!user) return;

    const newRequest: ExpenditureRequest = {
      id: `req-${Date.now()}`,
      budgetId: data.budgetId,
      departmentId: "dept-1", // Hardcoded for demo
      subDepartmentId: "sub-dept-1", // Hardcoded for demo
      budgetHeadId: "bh-1", // Hardcoded for demo
      subBudgetHeadId: "sbh-1", // Hardcoded for demo
      requestedBy: user.id,
      requestedAmount: data.requestedAmount,
      approvedAmount: 0,
      purpose: data.purpose,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests([...requests, newRequest]);
    setDialogOpen(false);
    toast({
      title: "Request submitted",
      description: "Your expenditure request has been submitted successfully.",
    });
  };

  // Handle request approval
  const handleApprove = (id: string, amount: number, notes: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "approved",
              approvedAmount: amount,
              notes: notes || req.notes,
              updatedAt: new Date().toISOString(),
            }
          : req
      )
    );
    toast({
      title: "Request approved",
      description: "The expenditure request has been approved successfully.",
    });
  };

  // Handle request rejection
  const handleReject = (id: string, notes: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "rejected",
              notes: notes,
              updatedAt: new Date().toISOString(),
            }
          : req
      )
    );
    toast({
      title: "Request rejected",
      description: "The expenditure request has been rejected.",
    });
  };

  // Handle revert action
  const handleRevert = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "pending",
              updatedAt: new Date().toISOString(),
            }
          : req
      )
    );
    toast({
      title: "Action reverted",
      description: "The action has been reverted successfully.",
    });
  };

  // Open create dialog
  const openCreateDialog = () => {
    setDialogOpen(true);
  };

  // Filter requests based on status
  const pendingRequests = requests.filter((req) => req.status === "pending");
  const approvedRequests = requests.filter((req) => req.status === "approved");
  const rejectedRequests = requests.filter((req) => req.status === "rejected");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Expenditure Requests</h2>
            <p className="text-muted-foreground">
              {isClerk
                ? "Create and manage budget expenditure requests"
                : isHod
                ? "Review and approve expenditure requests"
                : "View all expenditure requests"}
            </p>
          </div>
          {isClerk && (
            <Button onClick={openCreateDialog} className="bg-clerk hover:bg-clerk/80">
              Create Request
            </Button>
          )}
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <RequestsTable
              requests={pendingRequests}
              onApprove={isHod ? handleApprove : undefined}
              onReject={isHod ? handleReject : undefined}
              onRevert={isHod ? handleRevert : undefined}
            />
          </TabsContent>
          <TabsContent value="approved">
            <RequestsTable
              requests={approvedRequests}
              onRevert={isHod ? handleRevert : undefined}
            />
          </TabsContent>
          <TabsContent value="rejected">
            <RequestsTable
              requests={rejectedRequests}
              onRevert={isHod ? handleRevert : undefined}
            />
          </TabsContent>
        </Tabs>

        {/* Request Form Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Expenditure Request</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new expenditure request.
              </DialogDescription>
            </DialogHeader>
            <RequestForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Requests;
