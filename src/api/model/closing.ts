import { ID } from "@/api/model/common.ts";
import { PaymentType } from "@/api/model/payment_type.ts";

export interface TerminalCash {
  terminal_id: string;
  terminal_name: string;
  cash_amount: number;
}

export interface PaymentSummary {
  payment_type: PaymentType;
  amount: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category?: string;
}

export interface Closing extends ID {
  date: string;
  previous_day_balance: number;
  petty_cash: number;
  terminal_cash: TerminalCash[];
  payment_summaries: PaymentSummary[];
  expenses: Expense[];
  total_cash: number;
  total_other_payments: number;
  total_expenses: number;
  net_amount: number;
  notes?: string;
  created_by?: string;
  created_at: string;
  status: 'draft' | 'completed';
}