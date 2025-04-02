import {ID, KeyValue} from "@/api/model/common.ts";
import {User} from "@/api/model/user.ts";

export interface DayClosing extends ID {
  cash_added: number
  cash_withdraw: number
  closed_at?: Date
  closed_by?: User
  closing_balance: number
  created_at: Date
  date_from: Date|null
  date_to: Date|null
  denominations: KeyValue
  expenses: number
  expenses_data: object[]
  opened_by?: User
  opening_balance: number
  payments_data?: KeyValue
}