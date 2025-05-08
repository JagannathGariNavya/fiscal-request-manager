
import { UserRole } from "./auth";

export type BudgetStatus = 'active' | 'draft' | 'archived';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type ExpenseStatus = 'recorded' | 'verified' | 'rejected';

export interface Department {
  id: string;
  name: string;
}

export interface SubDepartment {
  id: string;
  name: string;
  departmentId: string;
}

export interface BudgetHead {
  id: string;
  name: string;
}

export interface SubBudgetHead {
  id: string;
  name: string;
  budgetHeadId: string;
}

export interface Budget {
  id: string;
  departmentId: string;
  subDepartmentId: string;
  budgetHeadId: string;
  subBudgetHeadId: string;
  financialYear: string;
  amount: number;
  allocatedAmount: number;
  remainingAmount: number;
  status: BudgetStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenditureRequest {
  id: string;
  budgetId: string;
  departmentId: string;
  subDepartmentId: string;
  budgetHeadId: string;
  subBudgetHeadId: string;
  requestedBy: string;
  requestedAmount: number;
  approvedAmount: number;
  purpose: string;
  status: RequestStatus;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  requestId: string;
  referenceNumber: string;
  departmentId: string;
  subDepartmentId: string;
  budgetHeadId: string;
  subBudgetHeadId: string;
  amount: number;
  installmentNumber: number;
  totalInstallments: number;
  recordedBy: string;
  status: ExpenseStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryRecord {
  id: string;
  requestId: string;
  action: 'created' | 'edited' | 'approved' | 'rejected' | 'reverted';
  performedBy: string;
  performedByRole: UserRole;
  previousStatus?: RequestStatus;
  newStatus?: RequestStatus;
  previousAmount?: number;
  newAmount?: number;
  notes?: string;
  timestamp: string;
}
