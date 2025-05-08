
import { useState, useEffect } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle, 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import HistoryTable from "@/components/HistoryTable";
import { HistoryRecord } from "@/types/budget";
import { historyRecords as mockHistory } from "@/data/mockData";
import { Search } from "lucide-react";

const History = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryRecord[]>(mockHistory);
  const [filteredHistory, setFilteredHistory] = useState<HistoryRecord[]>(mockHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Filter history based on role, department, and search term
  useEffect(() => {
    let filtered = [...history];

    // Filter by action if not "all"
    if (actionFilter !== "all") {
      filtered = filtered.filter(record => record.action === actionFilter);
    }

    // Filter by role if not "all"
    if (roleFilter !== "all") {
      filtered = filtered.filter(record => record.performedByRole === roleFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHistory(filtered);
  }, [history, searchTerm, actionFilter, roleFilter]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">History & Audit Log</h2>
          <p className="text-muted-foreground">
            View and track all budget and request activities
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter and search through the history records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or notes..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="edited">Edited</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="reverted">Reverted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hod">HOD</SelectItem>
                  <SelectItem value="clerk">Clerk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <HistoryTable records={filteredHistory} />
      </div>
    </AppLayout>
  );
};

export default History;
