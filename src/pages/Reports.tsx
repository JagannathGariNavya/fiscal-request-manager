
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download } from "lucide-react";

// Mock data
import { departments } from "@/data/mockData";

const Reports = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [reportType, setReportType] = useState<string>("budgets");
  const [isGenerating, setIsGenerating] = useState(false);

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

    setIsGenerating(true);
    
    // Toast notification
    toast({
      title: "Report generating",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report for the selected department is being prepared in ${format.toUpperCase()} format.`,
    });

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      
      // Create mock data for the report
      const mockData = generateMockReportData(reportType, selectedDepartment);
      
      // Generate the report file
      if (format === "pdf") {
        generatePDF(mockData, reportType, selectedDepartment);
      } else {
        generateExcel(mockData, reportType, selectedDepartment);
      }
      
      toast({
        title: "Download complete",
        description: "Your report has been downloaded successfully.",
      });
    }, 1500);
  };

  // Generate mock data for the report
  const generateMockReportData = (type: string, departmentId: string) => {
    // This would typically come from an API in a real application
    const departmentName = departments.find(d => d.id === departmentId)?.name || "Unknown";
    
    // Generate different mock data based on report type
    switch (type) {
      case "budgets":
        return {
          department: departmentName,
          date: new Date().toLocaleDateString(),
          budgets: [
            { head: "Salaries", allocated: 500000, spent: 350000, remaining: 150000 },
            { head: "Infrastructure", allocated: 200000, spent: 75000, remaining: 125000 },
            { head: "Operations", allocated: 150000, spent: 120000, remaining: 30000 },
          ]
        };
      case "requests":
        return {
          department: departmentName,
          date: new Date().toLocaleDateString(),
          requests: [
            { id: "REQ001", purpose: "Office Equipment", requested: 50000, approved: 45000, status: "Approved" },
            { id: "REQ002", purpose: "Travel Expenses", requested: 25000, approved: 25000, status: "Approved" },
            { id: "REQ003", purpose: "Software Subscription", requested: 15000, approved: 0, status: "Rejected" },
          ]
        };
      case "expenses":
        return {
          department: departmentName,
          date: new Date().toLocaleDateString(),
          expenses: [
            { ref: "EXP001", request: "REQ001", amount: 30000, date: "2023-05-01", installment: "1 of 2" },
            { ref: "EXP002", request: "REQ001", amount: 15000, date: "2023-05-15", installment: "2 of 2" },
            { ref: "EXP003", request: "REQ002", amount: 25000, date: "2023-05-10", installment: "1 of 1" },
          ]
        };
      default:
        return { department: departmentName, date: new Date().toLocaleDateString() };
    }
  };

  // Generate PDF report
  const generatePDF = (data: any, type: string, departmentId: string) => {
    // In a real app, this would generate a PDF file
    // For now, we'll create a text blob with JSON data to simulate the download
    const departmentName = departments.find(d => d.id === departmentId)?.name || "Unknown";
    const fileName = `${type}-report-${departmentName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/pdf' });
    
    // Create download link and trigger click
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  // Generate Excel report
  const generateExcel = (data: any, type: string, departmentId: string) => {
    // In a real app, this would generate an Excel file
    // For now, we'll create a text blob with CSV data to simulate the download
    const departmentName = departments.find(d => d.id === departmentId)?.name || "Unknown";
    const fileName = `${type}-report-${departmentName.toLowerCase().replace(/\s+/g, '-')}.csv`;
    
    // Convert data to CSV format
    let csvContent = "";
    
    // Add headers and content based on report type
    if (type === "budgets" && data.budgets) {
      csvContent = "Budget Head,Allocated Amount,Spent Amount,Remaining Amount\n";
      data.budgets.forEach((item: any) => {
        csvContent += `${item.head},${item.allocated},${item.spent},${item.remaining}\n`;
      });
    } else if (type === "requests" && data.requests) {
      csvContent = "Request ID,Purpose,Requested Amount,Approved Amount,Status\n";
      data.requests.forEach((item: any) => {
        csvContent += `${item.id},${item.purpose},${item.requested},${item.approved},${item.status}\n`;
      });
    } else if (type === "expenses" && data.expenses) {
      csvContent = "Reference,Request ID,Amount,Date,Installment\n";
      data.expenses.forEach((item: any) => {
        csvContent += `${item.ref},${item.request},${item.amount},${item.date},${item.installment}\n`;
      });
    } else {
      csvContent = "No data available";
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    
    // Create download link and trigger click
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
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
                  disabled={isGenerating}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => downloadReport("excel")}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isGenerating}
                >
                  <FileText className="mr-2 h-4 w-4" />
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
