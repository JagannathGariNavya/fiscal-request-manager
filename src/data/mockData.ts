
import { Department, SubDepartment, BudgetHead, SubBudgetHead, Budget, ExpenditureRequest, HistoryRecord } from "@/types/budget";

// Departments
export const departments: Department[] = [
  { id: "dept-1", name: "Engineering" },
  { id: "dept-2", name: "Finance" },
  { id: "dept-3", name: "Human Resources" },
  { id: "dept-4", name: "Marketing" },
];

// Sub Departments
export const subDepartments: SubDepartment[] = [
  { id: "sub-dept-1", name: "Software Development", departmentId: "dept-1" },
  { id: "sub-dept-2", name: "QA & Testing", departmentId: "dept-1" },
  { id: "sub-dept-3", name: "IT Operations", departmentId: "dept-1" },
  { id: "sub-dept-4", name: "Accounts", departmentId: "dept-2" },
  { id: "sub-dept-5", name: "Treasury", departmentId: "dept-2" },
  { id: "sub-dept-6", name: "Recruitment", departmentId: "dept-3" },
  { id: "sub-dept-7", name: "Training", departmentId: "dept-3" },
  { id: "sub-dept-8", name: "Digital Marketing", departmentId: "dept-4" },
  { id: "sub-dept-9", name: "Brand Management", departmentId: "dept-4" },
];

// Budget Heads
export const budgetHeads: BudgetHead[] = [
  { id: "bh-1", name: "Operational Expenses" },
  { id: "bh-2", name: "Capital Expenditure" },
  { id: "bh-3", name: "Employee Benefits" },
  { id: "bh-4", name: "Research & Development" },
];

// Sub Budget Heads
export const subBudgetHeads: SubBudgetHead[] = [
  { id: "sbh-1", name: "Office Supplies", budgetHeadId: "bh-1" },
  { id: "sbh-2", name: "Utilities", budgetHeadId: "bh-1" },
  { id: "sbh-3", name: "Equipment Purchase", budgetHeadId: "bh-2" },
  { id: "sbh-4", name: "Infrastructure", budgetHeadId: "bh-2" },
  { id: "sbh-5", name: "Training Programs", budgetHeadId: "bh-3" },
  { id: "sbh-6", name: "Healthcare", budgetHeadId: "bh-3" },
  { id: "sbh-7", name: "New Product Development", budgetHeadId: "bh-4" },
  { id: "sbh-8", name: "Innovation Projects", budgetHeadId: "bh-4" },
];

// Budgets
export const budgets: Budget[] = [
  {
    id: "budget-1",
    departmentId: "dept-1",
    subDepartmentId: "sub-dept-1",
    budgetHeadId: "bh-1",
    subBudgetHeadId: "sbh-1",
    financialYear: "2023-2024",
    amount: 500000,
    allocatedAmount: 120000,
    remainingAmount: 380000,
    status: "active",
    createdAt: "2023-04-01T00:00:00Z",
    updatedAt: "2023-04-01T00:00:00Z",
  },
  {
    id: "budget-2",
    departmentId: "dept-1",
    subDepartmentId: "sub-dept-1",
    budgetHeadId: "bh-2",
    subBudgetHeadId: "sbh-3",
    financialYear: "2023-2024",
    amount: 1000000,
    allocatedAmount: 350000,
    remainingAmount: 650000,
    status: "active",
    createdAt: "2023-04-01T00:00:00Z",
    updatedAt: "2023-04-01T00:00:00Z",
  },
  {
    id: "budget-3",
    departmentId: "dept-2",
    subDepartmentId: "sub-dept-4",
    budgetHeadId: "bh-1",
    subBudgetHeadId: "sbh-2",
    financialYear: "2023-2024",
    amount: 300000,
    allocatedAmount: 75000,
    remainingAmount: 225000,
    status: "active",
    createdAt: "2023-04-01T00:00:00Z",
    updatedAt: "2023-04-01T00:00:00Z",
  },
  {
    id: "budget-4",
    departmentId: "dept-3",
    subDepartmentId: "sub-dept-6",
    budgetHeadId: "bh-3",
    subBudgetHeadId: "sbh-5",
    financialYear: "2023-2024",
    amount: 400000,
    allocatedAmount: 150000,
    remainingAmount: 250000,
    status: "active",
    createdAt: "2023-04-01T00:00:00Z",
    updatedAt: "2023-04-01T00:00:00Z",
  },
];

// Expenditure Requests
export const expenditureRequests: ExpenditureRequest[] = [
  {
    id: "req-1",
    budgetId: "budget-1",
    departmentId: "dept-1",
    subDepartmentId: "sub-dept-1",
    budgetHeadId: "bh-1",
    subBudgetHeadId: "sbh-1",
    requestedBy: "3", // Clerk User ID
    requestedAmount: 25000,
    approvedAmount: 22000,
    purpose: "Purchase of stationery and office supplies",
    status: "approved",
    createdAt: "2023-04-15T10:30:00Z",
    updatedAt: "2023-04-16T14:20:00Z",
  },
  {
    id: "req-2",
    budgetId: "budget-2",
    departmentId: "dept-1",
    subDepartmentId: "sub-dept-1",
    budgetHeadId: "bh-2",
    subBudgetHeadId: "sbh-3",
    requestedBy: "3", // Clerk User ID
    requestedAmount: 120000,
    approvedAmount: 115000,
    purpose: "New developer workstations and equipment",
    status: "approved",
    createdAt: "2023-05-02T09:15:00Z",
    updatedAt: "2023-05-03T11:45:00Z",
  },
  {
    id: "req-3",
    budgetId: "budget-1",
    departmentId: "dept-1",
    subDepartmentId: "sub-dept-1",
    budgetHeadId: "bh-1",
    subBudgetHeadId: "sbh-1",
    requestedBy: "3", // Clerk User ID
    requestedAmount: 18000,
    approvedAmount: 0,
    purpose: "Office decor and plants",
    status: "rejected",
    notes: "Not a priority expense at this time",
    createdAt: "2023-05-10T13:20:00Z",
    updatedAt: "2023-05-11T09:30:00Z",
  },
  {
    id: "req-4",
    budgetId: "budget-1",
    departmentId: "dept-1",
    subDepartmentId: "sub-dept-1",
    budgetHeadId: "bh-1",
    subBudgetHeadId: "sbh-1",
    requestedBy: "3", // Clerk User ID
    requestedAmount: 35000,
    approvedAmount: 0,
    purpose: "Team building event supplies",
    status: "pending",
    createdAt: "2023-05-20T15:45:00Z",
    updatedAt: "2023-05-20T15:45:00Z",
  },
];

// History Records
export const historyRecords: HistoryRecord[] = [
  {
    id: "hist-1",
    requestId: "req-1",
    action: "created",
    performedBy: "3", // Clerk User ID
    performedByRole: "clerk",
    newStatus: "pending",
    newAmount: 25000,
    timestamp: "2023-04-15T10:30:00Z",
  },
  {
    id: "hist-2",
    requestId: "req-1",
    action: "edited",
    performedBy: "2", // HOD User ID
    performedByRole: "hod",
    previousAmount: 25000,
    newAmount: 22000,
    notes: "Adjusted amount based on current pricing",
    timestamp: "2023-04-16T14:00:00Z",
  },
  {
    id: "hist-3",
    requestId: "req-1",
    action: "approved",
    performedBy: "2", // HOD User ID
    performedByRole: "hod",
    previousStatus: "pending",
    newStatus: "approved",
    timestamp: "2023-04-16T14:20:00Z",
  },
  {
    id: "hist-4",
    requestId: "req-2",
    action: "created",
    performedBy: "3", // Clerk User ID
    performedByRole: "clerk",
    newStatus: "pending",
    newAmount: 120000,
    timestamp: "2023-05-02T09:15:00Z",
  },
  {
    id: "hist-5",
    requestId: "req-2",
    action: "edited",
    performedBy: "2", // HOD User ID
    performedByRole: "hod",
    previousAmount: 120000,
    newAmount: 115000,
    notes: "Adjusted based on latest quotation",
    timestamp: "2023-05-03T11:30:00Z",
  },
  {
    id: "hist-6",
    requestId: "req-2",
    action: "approved",
    performedBy: "2", // HOD User ID
    performedByRole: "hod",
    previousStatus: "pending",
    newStatus: "approved",
    timestamp: "2023-05-03T11:45:00Z",
  },
  {
    id: "hist-7",
    requestId: "req-3",
    action: "created",
    performedBy: "3", // Clerk User ID
    performedByRole: "clerk",
    newStatus: "pending",
    newAmount: 18000,
    timestamp: "2023-05-10T13:20:00Z",
  },
  {
    id: "hist-8",
    requestId: "req-3",
    action: "rejected",
    performedBy: "2", // HOD User ID
    performedByRole: "hod",
    previousStatus: "pending",
    newStatus: "rejected",
    notes: "Not a priority expense at this time",
    timestamp: "2023-05-11T09:30:00Z",
  },
  {
    id: "hist-9",
    requestId: "req-4",
    action: "created",
    performedBy: "3", // Clerk User ID
    performedByRole: "clerk",
    newStatus: "pending",
    newAmount: 35000,
    timestamp: "2023-05-20T15:45:00Z",
  },
];

// Function to get department name by ID
export const getDepartmentName = (id: string): string => {
  const department = departments.find(dept => dept.id === id);
  return department ? department.name : 'Unknown Department';
};

// Function to get sub department name by ID
export const getSubDepartmentName = (id: string): string => {
  const subDepartment = subDepartments.find(subDept => subDept.id === id);
  return subDepartment ? subDepartment.name : 'Unknown Sub Department';
};

// Function to get budget head name by ID
export const getBudgetHeadName = (id: string): string => {
  const budgetHead = budgetHeads.find(bh => bh.id === id);
  return budgetHead ? budgetHead.name : 'Unknown Budget Head';
};

// Function to get sub budget head name by ID
export const getSubBudgetHeadName = (id: string): string => {
  const subBudgetHead = subBudgetHeads.find(sbh => sbh.id === id);
  return subBudgetHead ? subBudgetHead.name : 'Unknown Sub Budget Head';
};
