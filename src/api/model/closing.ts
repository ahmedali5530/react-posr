import { ID } from "@/api/model/common.ts";
import { PaymentType } from "@/api/model/payment_type.ts";
import { DateTime } from "surrealdb";

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
  date_from: Date;
  date_to: Date;
  previous_day_balance?: number;
  cash_added: number;
  cash_withdrawn: number;
  closing_balance: number;
  denominations?: object
  terminal_cash?: TerminalCash[];
  payments_data: PaymentSummary[];
  expenses: number;
  expenses_data: Expense[];
  total_cash?: number;
  total_other_payments?: number;
  net_amount?: number;
  notes?: string;
  created_by?: string;
  created_at: DateTime;
  status: 'draft' | 'completed';
}