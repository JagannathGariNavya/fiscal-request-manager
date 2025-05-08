
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, FileExcel, Download } from "lucide-react";

// Mock data
import { departments } from "@/data/mockData";

const Reports = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [reportType, setReportType] = useState<string>("budgets");

  // Handle report download
  const downloadReport = (format: "pdf" | "excel") => {
    if (!selectedDepartment) {
      toast({
        title: "Department required",
        description: "Please select a department before downloading the report.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API to generate and download the report
    toast({
      title: "Report downloading",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report for the selected department is being prepared in ${format.toUpperCase()} format.`,
    });

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Your report has been downloaded successfully.",
      });
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Department Reports</h2>
          <p className="text-muted-foreground">
            Generate and download department-wise reports in various formats
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
              <CardDescription>
                Configure the parameters for your report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select onValueChange={(value) => setSelectedDepartment(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => downloadReport("pdf")}
                  className="w-full mb-2 bg-red-600 hover:bg-red-700"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => downloadReport("excel")}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <FileExcel className="mr-2 h-4 w-4" />
                  Download Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Report Type</CardTitle>
              <CardDescription>
                Select the type of report you want to generate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="budgets" onValueChange={(value) => setReportType(value)}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="budgets" className="flex-1">Budget Allocation</TabsTrigger>
                  <TabsTrigger value="requests" className="flex-1">Expenditure Requests</TabsTrigger>
                  <TabsTrigger value="expenses" className="flex-1">Expenses</TabsTrigger>
                </TabsList>

                <TabsContent value="budgets" className="space-y-4">
                  <p>
                    This report includes all budget allocations for the selected department, 
                    including remaining amounts and allocation history.
                  </p>
                </TabsContent>

                <TabsContent value="requests" className="space-y-4">
                  <p>
                    This report includes all expenditure requests for the selected department, 
                    including status, requested amounts, and approval details.
                  </p>
                </TabsContent>

                <TabsContent value="expenses" className="space-y-4">
                  <p>
                    This report includes all recorded expenses for the selected department, 
                    including installment details and reference numbers.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
