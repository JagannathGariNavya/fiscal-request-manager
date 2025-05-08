
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
import { departments, subDepartments, budgetHeads, subBudgetHeads } from "@/data/mockData";

// Form schema
const formSchema = z.object({
  departmentId: z.string({
    required_error: "Please select a department",
  }),
  subDepartmentId: z.string({
    required_error: "Please select a sub-department",
  }),
  budgetHeadId: z.string({
    required_error: "Please select a budget head",
  }),
  subBudgetHeadId: z.string({
    required_error: "Please select a sub-budget head",
  }),
  financialYear: z.string({
    required_error: "Please enter financial year",
  }),
  amount: z.coerce.number()
    .positive("Amount must be a positive number")
    .min(1, "Amount must be at least 1"),
});

// Props interface
interface BudgetFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  initialData?: z.infer<typeof formSchema>;
  isEdit?: boolean;
}

const BudgetForm = ({ onSubmit, initialData, isEdit = false }: BudgetFormProps) => {
  const { toast } = useToast();
  const [filteredSubDepts, setFilteredSubDepts] = useState<typeof subDepartments>([]);
  const [filteredSubBudgetHeads, setFilteredSubBudgetHeads] = useState<typeof subBudgetHeads>([]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      departmentId: "",
      subDepartmentId: "",
      budgetHeadId: "",
      subBudgetHeadId: "",
      financialYear: "",
      amount: 0,
    },
  });

  // Watch department and budget head to filter related sub-items
  const watchDepartment = form.watch("departmentId");
  const watchBudgetHead = form.watch("budgetHeadId");

  // Filter sub-departments when department changes
  useEffect(() => {
    if (watchDepartment) {
      const filtered = subDepartments.filter(
        (subDept) => subDept.departmentId === watchDepartment
      );
      setFilteredSubDepts(filtered);
      
      // Reset sub-department selection if current selection is not valid
      const currentSubDeptId = form.getValues("subDepartmentId");
      if (currentSubDeptId && !filtered.find(sd => sd.id === currentSubDeptId)) {
        form.setValue("subDepartmentId", "");
      }
    } else {
      setFilteredSubDepts([]);
      form.setValue("subDepartmentId", "");
    }
  }, [watchDepartment, form]);

  // Filter sub-budget heads when budget head changes
  useEffect(() => {
    if (watchBudgetHead) {
      const filtered = subBudgetHeads.filter(
        (sbh) => sbh.budgetHeadId === watchBudgetHead
      );
      setFilteredSubBudgetHeads(filtered);
      
      // Reset sub-budget head selection if current selection is not valid
      const currentSubBudgetHeadId = form.getValues("subBudgetHeadId");
      if (currentSubBudgetHeadId && !filtered.find(sbh => sbh.id === currentSubBudgetHeadId)) {
        form.setValue("subBudgetHeadId", "");
      }
    } else {
      setFilteredSubBudgetHeads([]);
      form.setValue("subBudgetHeadId", "");
    }
  }, [watchBudgetHead, form]);

  // Handle form submission
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      onSubmit(data);
      if (!isEdit) {
        form.reset();
      }
      toast({
        title: `Budget ${isEdit ? 'updated' : 'created'} successfully`,
        description: `Budget for ${getDepartmentName(data.departmentId)} - ${getSubDepartmentName(data.subDepartmentId)} has been ${isEdit ? 'updated' : 'created'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} budget. Please try again.`,
        variant: "destructive",
      });
    }
  };

  // Helper functions to get names
  const getDepartmentName = (id: string): string => {
    const dept = departments.find((d) => d.id === id);
    return dept ? dept.name : "";
  };

  const getSubDepartmentName = (id: string): string => {
    const subDept = subDepartments.find((sd) => sd.id === id);
    return subDept ? subDept.name : "";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department */}
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sub Department */}
          <FormField
            control={form.control}
            name="subDepartmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                  disabled={filteredSubDepts.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredSubDepts.map((subDept) => (
                      <SelectItem key={subDept.id} value={subDept.id}>
                        {subDept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Budget Head */}
          <FormField
            control={form.control}
            name="budgetHeadId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Head</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget head" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {budgetHeads.map((bh) => (
                      <SelectItem key={bh.id} value={bh.id}>
                        {bh.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sub Budget Head */}
          <FormField
            control={form.control}
            name="subBudgetHeadId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Budget Head</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                  disabled={filteredSubBudgetHeads.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub budget head" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredSubBudgetHeads.map((sbh) => (
                      <SelectItem key={sbh.id} value={sbh.id}>
                        {sbh.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Financial Year */}
          <FormField
            control={form.control}
            name="financialYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Financial Year</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 2023-2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">{isEdit ? "Update" : "Create"} Budget</Button>
        </div>
      </form>
    </Form>
  );
};

export default BudgetForm;
