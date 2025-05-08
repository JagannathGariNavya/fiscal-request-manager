
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for demonstration
import { expenditureRequests } from "@/data/mockData";
import { ExpenditureRequest } from "@/types/budget";

// Form schema
const formSchema = z.object({
  requestId: z.string({
    required_error: "Please select an approved request",
  }),
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }).positive({
    message: "Amount must be positive",
  }),
  installmentNumber: z.number().int().positive(),
  totalInstallments: z.number().int().min(1),
  notes: z.string().optional(),
});

interface ExpenseFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  requests: ExpenditureRequest[];
}

const ExpenseForm = ({ onSubmit, requests = [] }: ExpenseFormProps) => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      installmentNumber: 1,
      totalInstallments: 1,
      notes: "",
    },
  });

  // Handle form submission
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
    form.reset();
  };

  // Find the selected request to display details
  const selectedRequestDetails = selectedRequest 
    ? requests.find(req => req.id === selectedRequest)
    : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="requestId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Approved Request</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedRequest(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an approved request" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {requests.map((request) => (
                    <SelectItem key={request.id} value={request.id}>
                      ID: {request.id.slice(0, 8)} - Amount: ₹{request.approvedAmount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedRequestDetails && (
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium">Request Reference: {selectedRequestDetails.referenceNumber || 'N/A'}</p>
            <p className="text-sm">Approved Amount: ₹{selectedRequestDetails.approvedAmount}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="installmentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Installment Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalInstallments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Installments</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes here"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit">Record Expense</Button>
        </div>
      </form>
    </Form>
  );
};

export default ExpenseForm;
