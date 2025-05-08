
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  departments,
  subDepartments,
  budgetHeads,
  subBudgetHeads,
  budgets,
  getDepartmentName,
  getSubDepartmentName,
  getBudgetHeadName,
  getSubBudgetHeadName
} from "@/data/mockData";

// Form schema
const formSchema = z.object({
  budgetId: z.string({
    required_error: "Please select a budget",
  }),
  requestedAmount: z.coerce
    .number()
    .positive("Amount must be a positive number")
    .min(1, "Amount must be at least 1"),
  purpose: z
    .string()
    .min(10, "Purpose must be at least 10 characters")
    .max(200, "Purpose must not exceed 200 characters"),
});

// Props interface
interface RequestFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

const RequestForm = ({ onSubmit }: RequestFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [availableBudgets, setAvailableBudgets] = useState<typeof budgets>([]);
  const [selectedBudget, setSelectedBudget] = useState<typeof budgets[0] | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budgetId: "",
      requestedAmount: 0,
      purpose: "",
    },
  });

  // Filter budgets based on user's department if they are a Clerk or HOD
  useEffect(() => {
    if (user && (user.role === "clerk" || user.role === "hod")) {
      if (user.department) {
        const departmentId = departments.find(d => d.name === user.department)?.id;
        if (departmentId) {
          const filtered = budgets.filter(budget => 
            budget.departmentId === departmentId && 
            budget.remainingAmount > 0 &&
            budget.status === "active"
          );
          setAvailableBudgets(filtered);
        }
      }
    } else {
      // For finance users, show all active budgets
      setAvailableBudgets(budgets.filter(b => b.status === "active" && b.remainingAmount > 0));
    }
  }, [user]);

  // Watch budget ID to update selected budget info
  const watchBudgetId = form.watch("budgetId");

  // Update selected budget when budgetId changes
  useEffect(() => {
    if (watchBudgetId) {
      const budget = budgets.find(b => b.id === watchBudgetId) || null;
      setSelectedBudget(budget);
      
      // If user changes budget, validate amount is not greater than remaining
      if (budget) {
        const currentRequestedAmount = form.getValues("requestedAmount");
        if (currentRequestedAmount > budget.remainingAmount) {
          form.setValue("requestedAmount", budget.remainingAmount);
        }
      }
    } else {
      setSelectedBudget(null);
    }
  }, [watchBudgetId, form]);

  // Format amount as currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Handle form submission
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (!selectedBudget) {
      toast({
        title: "Error",
        description: "Please select a valid budget",
        variant: "destructive",
      });
      return;
    }

    if (data.requestedAmount > selectedBudget.remainingAmount) {
      toast({
        title: "Error",
        description: "Requested amount exceeds available budget",
        variant: "destructive",
      });
      return;
    }

    try {
      onSubmit(data);
      form.reset();
      toast({
        title: "Request submitted",
        description: "Your expenditure request has been submitted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Budget Selection */}
        <FormField
          control={form.control}
          name="budgetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Budget</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a budget" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableBudgets.map((budget) => (
                    <SelectItem key={budget.id} value={budget.id}>
                      {getDepartmentName(budget.departmentId)} - {getSubBudgetHeadName(budget.subBudgetHeadId)} ({formatCurrency(budget.remainingAmount)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Selected Budget Info */}
        {selectedBudget && (
          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2">Selected Budget Details</h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Department:</dt>
                <dd>{getDepartmentName(selectedBudget.departmentId)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Sub Department:</dt>
                <dd>{getSubDepartmentName(selectedBudget.subDepartmentId)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Budget Head:</dt>
                <dd>{getBudgetHeadName(selectedBudget.budgetHeadId)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Sub Budget Head:</dt>
                <dd>{getSubBudgetHeadName(selectedBudget.subBudgetHeadId)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Financial Year:</dt>
                <dd>{selectedBudget.financialYear}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Remaining Amount:</dt>
                <dd className="font-medium">{formatCurrency(selectedBudget.remainingAmount)}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Requested Amount */}
        <FormField
          control={form.control}
          name="requestedAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requested Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter requested amount"
                  {...field}
                  disabled={!selectedBudget}
                />
              </FormControl>
              {selectedBudget && (
                <p className="text-xs text-muted-foreground">
                  Maximum available: {formatCurrency(selectedBudget.remainingAmount)}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Purpose */}
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the purpose of this expenditure request"
                  className="min-h-[100px]"
                  {...field}
                  disabled={!selectedBudget}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={!selectedBudget}>
            Submit Request
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RequestForm;
